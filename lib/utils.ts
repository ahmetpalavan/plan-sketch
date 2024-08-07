import { type ClassValue, clsx } from 'clsx';
import React, { useCallback } from 'react';
import { twMerge } from 'tailwind-merge';
import { Camera, Color } from '~/types/canvas';

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
