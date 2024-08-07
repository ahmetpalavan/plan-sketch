import { type ClassValue, clsx } from 'clsx';
import React, { useCallback } from 'react';
import { twMerge } from 'tailwind-merge';
import { Camera, Color, Point, Side, XYWH } from '~/types/canvas';

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
