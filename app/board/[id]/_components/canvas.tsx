'use client';

import { LiveObject } from '@liveblocks/client';
import { useCanRedo, useCanUndo, useHistory, useOthersMapped } from '@liveblocks/react';
import { nanoid } from 'nanoid';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  colorToCss,
  connectionIdColor,
  findIntersectingLayersWithRectangle,
  penPointsToPathLayer,
  pointerEventToCanvasPoint,
  resizeBounds,
} from '~/lib/utils';
import { useMutation, useSelf, useStorage } from '~/liveblocks.config';
import { CanvasMode, CanvasState, Color, LayerType, Point, Side, XYWH } from '~/types/canvas';
import { CursorsPresence } from './cursors-presence';
import { Info } from './info';
import { LayerPreview } from './layer-preview';
import { Participants } from './participants';
import { SelectionBox } from './selection-box';
import { SelectionTools } from './selection-tools';
import { Toolbar } from './toolbar';
import { Path } from './path';
import { useDisableScrollBounce } from '~/hooks/use-disable-scroll-bounce';
import { useDeleteLayers } from '~/hooks/use-delete-layers';

interface Props {
  boardId: string;
}

const MAX_LAYERS = 100;

export const Canvas = ({ boardId }: Props) => {
  const pencilDraft = useSelf((self) => self.presence.pencilDraft);
  const layerIds = useStorage((state) => state.layerIds);
  const [canvasState, setCanvasState] = useState<CanvasState>({ mode: CanvasMode.None });
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [lastUsedColor, setLastUsedColor] = useState<Color>({ b: 0, g: 0, r: 0 });
  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  useDisableScrollBounce();

  const insertLayer = useMutation(
    ({ setMyPresence, storage }, layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note, position: Point) => {
      const liveLayers = storage.get('layers');
      if (liveLayers.size >= MAX_LAYERS) {
        return;
      }
      const liveLayerIds = storage.get('layerIds');
      const layerId = nanoid();

      const layer = new LiveObject({
        type: layerType,
        x: position.x,
        y: position.y,
        width: 100,
        height: 100,
        fill: lastUsedColor,
      });
      liveLayerIds.push(layerId);
      liveLayers.set(layerId, layer as any);

      setMyPresence({ selection: [layerId] }, { addToHistory: true });
      setCanvasState({ mode: CanvasMode.None });
    },
    [lastUsedColor]
  );

  const onResizeHandlePointerDown = useCallback(
    (corner: Side, initialBounds: XYWH) => {
      history.pause();
      setCanvasState({
        mode: CanvasMode.Resizing,
        corner,
        initialBounds,
      });
    },
    [history]
  );

  const unSelectLayer = useMutation(({ setMyPresence, self }) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);

  const insertPath = useMutation(
    ({ setMyPresence, self, storage }) => {
      const livelayers = storage.get('layers');
      const { pencilDraft } = self.presence;

      if (pencilDraft === null || pencilDraft.length < 2 || livelayers.size >= MAX_LAYERS) {
        setMyPresence({ pencilDraft: null });
        return;
      }

      const id = nanoid();
      livelayers.set(id, new LiveObject(penPointsToPathLayer(pencilDraft, lastUsedColor)));

      const liveLayerIds = storage.get('layerIds');
      liveLayerIds.push(id);

      setMyPresence({ pencilDraft: null });
      setCanvasState({ mode: CanvasMode.Pencil });
    },
    [lastUsedColor]
  );

  const onPointerUp = useMutation(
    ({}, e) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.None || canvasState.mode === CanvasMode.Pressing) {
        unSelectLayer();
        setCanvasState({ mode: CanvasMode.None });
      } else if (canvasState.mode === CanvasMode.Pencil) {
        insertPath();
      } else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else {
        setCanvasState({ mode: CanvasMode.None });
      }
      history.resume();
    },
    [camera, canvasState.mode, insertLayer, history, unSelectLayer, insertPath]
  );

  const selections = useOthersMapped((other) => other.presence.selection);

  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {};

    for (const user of selections) {
      const [connectionId, selection] = user;
      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = connectionIdColor(connectionId);
      }
    }
    return layerIdsToColorSelection;
  }, [selections]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }));
  }, []);

  const resizeLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) {
        return;
      }
      const initialBounds = resizeBounds(canvasState.corner, canvasState.initialBounds, point);

      const liveLayers = storage.get('layers');
      const layers = liveLayers.get(self.presence.selection[0]);
      if (layers) {
        layers.update(initialBounds);
      }
    },
    [canvasState]
  );

  const translateSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) {
        return;
      }
      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };

      const livelayers = storage.get('layers');
      for (const layerId of self.presence.selection) {
        const layer = livelayers.get(layerId);
        if (layer) {
          layer.update({
            x: layer.get('x') + offset.x,
            y: layer.get('y') + offset.y,
          });
        }
      }

      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [canvasState]
  );

  const startMultiSelection = useCallback((current: Point, origin: Point) => {
    if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
      console.log('startMultiSelection');
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });
    }
  }, []);

  const updateSelectionNet = useMutation(
    ({ storage, setMyPresence }, current: Point, origin: Point) => {
      const layers = storage.get('layers').toImmutable();
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });
      const ids = findIntersectingLayersWithRectangle(layerIds || [], layers, origin, current);

      setMyPresence({ selection: ids });
    },
    [layerIds]
  );

  const continueDrawing = useMutation(
    ({ setMyPresence, self }, point: Point, e: React.PointerEvent) => {
      const { pencilDraft } = self.presence;

      if (canvasState.mode !== CanvasMode.Pencil || pencilDraft === null || e.buttons !== 1) {
        return;
      }

      setMyPresence({
        pencilDraft: [
          ...(pencilDraft.length === 1 && pencilDraft[0][0] === point.x && pencilDraft[0][1] === point.y
            ? pencilDraft
            : ([...pencilDraft, [point.x, point.y, e.pressure]] as [number, number, number][])),
        ],
        cursor: point,
      });
    },
    [canvasState.mode]
  );

  const onPointerMove: React.PointerEventHandler<SVGSVGElement> = useMutation(
    ({ setMyPresence }, e) => {
      e.preventDefault();
      const current = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Pressing) {
        startMultiSelection(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.SelectionNet) {
        updateSelectionNet(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayer(current);
      } else if (canvasState.mode === CanvasMode.Resizing) {
        resizeLayer(current);
      } else if (canvasState.mode === CanvasMode.Pencil) {
        continueDrawing(current, e);
      }

      setMyPresence({ cursor: current });
    },
    [canvasState, resizeLayer, camera, continueDrawing]
  );

  const onPointerLeave: React.PointerEventHandler<SVGSVGElement> = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  const startDrawing = useMutation(
    ({ setMyPresence }, point: Point, pressure: number) => {
      setMyPresence({
        pencilColor: lastUsedColor,
        pencilDraft: [[point.x, point.y, pressure]],
      });
    },
    [lastUsedColor]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (canvasState.mode === CanvasMode.Inserting) {
        return;
      }

      e.preventDefault();
      const point = pointerEventToCanvasPoint(e, camera);
      if (canvasState.mode === CanvasMode.Pencil) {
        console.log('Starting drawing');
        startDrawing(point, e.pressure);
      } else {
        setCanvasState({ mode: CanvasMode.Pressing, origin: point });
      }
    },
    [canvasState.mode, camera, setCanvasState, startDrawing]
  );
  const onLayerPointDown = useMutation(
    ({ setMyPresence, self }, e: React.PointerEvent, id: string) => {
      if (canvasState.mode === CanvasMode.Pencil || canvasState.mode === CanvasMode.Inserting) {
        return;
      }
      history.pause();
      e.stopPropagation();

      const point = pointerEventToCanvasPoint(e, camera);

      if (!self.presence.selection.includes(id)) {
        setMyPresence({ selection: [id] }, { addToHistory: true });
      }
      setCanvasState({
        mode: CanvasMode.Translating,
        current: point,
      });
    },
    [setCanvasState, camera, history, canvasState.mode]
  );

  const deleteLayers = useDeleteLayers();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'Backspace':
          deleteLayers();
          break;
        case 'z':
          if (e.metaKey || e.ctrlKey) {
            if (e.shiftKey) {
              history.redo();
            } else {
              history.undo();
            }
          }
          break;
      }
    }

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [deleteLayers, history]);

  return (
    <main className='h-screen w-full relative dark:bg-gray-900 touch-none'>
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        undo={history.undo}
        redo={history.redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <SelectionTools camera={camera} setLastUsedColor={setLastUsedColor} />
      <svg
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerLeave}
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        className='h-[100vh] w-[100vw]'
      >
        <g style={{ transform: `translate(${camera.x}px, ${camera.y}px)` }}>
          {layerIds?.map((layerId) => (
            <LayerPreview
              id={layerId}
              onLayerPointDown={onLayerPointDown}
              selectionColor={layerIdsToColorSelection[layerId]}
              key={layerId}
            />
          ))}
          <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />
          {canvasState.mode === CanvasMode.SelectionNet && canvasState.current != null && (
            <rect
              x={Math.min(canvasState.origin.x, canvasState.current?.x)}
              y={Math.min(canvasState.origin.y, canvasState.current.y)}
              width={Math.abs(canvasState.origin.x - canvasState.current.x)}
              height={Math.abs(canvasState.origin.y - canvasState.current.y)}
              className='fill-blue-300/15 stroke-blue-600 stroke-1'
            />
          )}
          <CursorsPresence />
          {pencilDraft != null && pencilDraft.length > 0 && (
            <Path
              points={pencilDraft}
              fill={colorToCss(lastUsedColor)}
              stroke={colorToCss(lastUsedColor)}
              x={0}
              y={0}
              onPointerDown={(e) => onLayerPointDown(e, 'pencil-draft')}
            />
          )}
        </g>
      </svg>
    </main>
  );
};
