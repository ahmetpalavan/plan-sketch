import { type ClassValue, clsx } from 'clsx';
import React, { useCallback } from 'react';
import { twMerge } from 'tailwind-merge';
import { Camera, Color, Layer, LayerType, PathLayer, Point, Side, XYWH } from '~/types/canvas';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COLORS = ['#F87171', '#FBBF24', '#34D399', '#60A5FA', '#818CF8'];

export function connectionIdColor(connectionId: number): string {
  return COLORS[connectionId % COLORS.length];
}

export function pointerEventToCanvasPoint(e: React.PointerEvent, camera: Camera) {
  return {
    x: Math.round(e.clientX - camera.x),
    y: Math.round(e.clientY - camera.y),
  };
}

export function colorToCss(color: Color) {
  return `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`;
}

export function resizeBounds(corner: Side, initialBounds: XYWH, point: Point) {
  const result = {
    x: initialBounds.x,
    y: initialBounds.y,
    width: initialBounds.width,
    height: initialBounds.height,
  };

  if ((corner & Side.Left) === Side.Left) {
    result.x = Math.min(point.x, initialBounds.x + initialBounds.width);
    result.width = Math.abs(point.x - (initialBounds.x + initialBounds.width));
  }

  if ((corner & Side.Top) === Side.Top) {
    result.y = Math.min(point.y, initialBounds.y + initialBounds.height);
    result.height = Math.abs(point.y - (initialBounds.y + initialBounds.height));
  }

  if ((corner & Side.Right) === Side.Right) {
    result.x = Math.min(point.x, initialBounds.x);
    result.width = Math.abs(point.x - initialBounds.x);
  }

  if ((corner & Side.Bottom) === Side.Bottom) {
    result.y = Math.min(point.y, initialBounds.y);
    result.height = Math.abs(point.y - initialBounds.y);
  }

  return result;
}

export function findIntersectingLayersWithRectangle(layerIds: readonly string[], layers: ReadonlyMap<string, Layer>, a: Point, b: Point) {
  const rect = {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  };

  return layerIds.filter((layerId) => {
    const layer = layers.get(layerId);
    if (!layer) {
      return;
    }

    return (
      layer.x < rect.x + rect.width && layer.x + layer.width > rect.x && layer.y < rect.y + rect.height && layer.y + layer.height > rect.y
    );
  });
}

export function getContrastingTextColor(color: Color) {
  const luminance = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
  return luminance > 182 ? 'black' : 'white';
}

export function penPointsToPathLayer(points: number[][], color: Color): PathLayer {
  if (points.length < 2) {
    throw new Error('Not enough points to create a path');
  }
  let left = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;

  for (const point of points) {
    const [x, y] = point;

    if (left > x) {
      left = x;
    }

    if (top > y) {
      top = y;
    }

    if (right < x) {
      right = x;
    }

    if (bottom < y) {
      bottom = y;
    }
  }

  return {
    type: LayerType.Path,
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
    fill: color,
    points: points.map(([x, y, pressure]) => [x - left, y - top, pressure]),
  };
}

export function getSvgFromStroke(stroke: number[][]) {
  if (!stroke.length) return '';

  const d = stroke.reduce(
    (acc, [x, y], i, arr) => {
      const [px, py] = arr[(i + 1) % arr.length];
      acc.push(x, y, (x + px) / 2, (y + py) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q']
  );
  d.push('Z');
  return d.join(' ');
}
