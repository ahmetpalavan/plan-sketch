'use client';

import { LiveObject } from '@liveblocks/client';
import { useCanRedo, useCanUndo, useHistory, useOthersMapped } from '@liveblocks/react';
import { nanoid } from 'nanoid';
import React, { useCallback, useMemo, useState } from 'react';
import { connectionIdColor, pointerEventToCanvasPoint, resizeBounds } from '~/lib/utils';
import { useMutation, useStorage } from '~/liveblocks.config';
import { CanvasMode, CanvasState, Color, LayerType, Point, Side, XYWH } from '~/types/canvas';
import { CursorsPresence } from './cursors-presence';
import { Info } from './info';
import { Participants } from './participants';
import { Toolbar } from './toolbar';
import { LayerPreview } from './layer-preview';
import { SelectionBox } from './selection-box';

interface Props {
  boardId: string;
}

const MAX_LAYERS = 100;

export const Canvas = ({ boardId }: Props) => {
  const layerIds = useStorage((state) => state.layerIds);
  const [canvasState, setCanvasState] = useState<CanvasState>({ mode: CanvasMode.None });
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [lastUsedColor, setLastUsedColor] = useState<Color>({ b: 0, g: 0, r: 0 });
  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const insertLayer = useMutation(
    ({ storage, setMyPresence }, layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note, position: Point) => {
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

  const pointerUp = useMutation(
    ({ setMyPresence }, e) => {
      const point = pointerEventToCanvasPoint(e, camera);
      if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else {
        setCanvasState({ mode: CanvasMode.None });
      }
      history.resume();
    },
    [camera, canvasState.mode]
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

  const onPointerMove: React.PointerEventHandler<SVGSVGElement> = useMutation(
    ({ setMyPresence }, e) => {
      e.preventDefault();
      const current = pointerEventToCanvasPoint(e, camera);
      if (canvasState.mode === CanvasMode.Resizing) {
        resizeLayer(current);
      }
      setMyPresence({ cursor: current });
    },
    [canvasState, resizeLayer, camera]
  );

  const onPointerLeave: React.PointerEventHandler<SVGSVGElement> = useMutation(({ self, setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

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
      <svg
        onPointerUp={pointerUp}
        onPointerLeave={onPointerLeave}
        onWheel={onWheel}
        onPointerMove={onPointerMove}
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
          <CursorsPresence />
        </g>
      </svg>
    </main>
  );
};
