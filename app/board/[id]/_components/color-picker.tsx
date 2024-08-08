'use client';
import { colorToCss } from '~/lib/utils';
import { Color } from '~/types/canvas';

interface ColorPickerProps {
  onColorChange: (color: Color) => void;
}

export const ColorPicker = ({ onColorChange }: ColorPickerProps) => {
  return (
    <div className='flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-muted-foreground'>
      <ColorButton color={{ r: 255, g: 0, b: 0 }} onClick={onColorChange} />
      <ColorButton color={{ r: 255, g: 165, b: 0 }} onClick={onColorChange} />
      <ColorButton color={{ r: 255, g: 255, b: 0 }} onClick={onColorChange} />
      <ColorButton color={{ r: 0, g: 128, b: 0 }} onClick={onColorChange} />
      <ColorButton color={{ r: 0, g: 0, b: 255 }} onClick={onColorChange} />
      <ColorButton color={{ r: 75, g: 0, b: 130 }} onClick={onColorChange} />
      <ColorButton color={{ r: 238, g: 130, b: 238 }} onClick={onColorChange} />
      <ColorButton color={{ r: 0, g: 0, b: 0 }} onClick={onColorChange} />
    </div>
  );
};

interface ColorButtonProps {
  color: Color;
  onClick: (color: Color) => void;
}

export const ColorButton = ({ color, onClick }: ColorButtonProps) => {
  return (
    <button
      className='w-8 h-8 flex items-center justify-center hover:opacity-70 transition rounded-full'
      style={{ backgroundColor: colorToCss(color) }}
      onClick={() => onClick(color)}
    >
      <div className='w-8 h-8 rounded-md border border-muted-foreground' style={{ backgroundColor: colorToCss(color) }} />
    </button>
  );
};
