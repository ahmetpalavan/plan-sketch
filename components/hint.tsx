import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export interface HintProps {
  label: string;
  children: React.ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
}

export const Hint = ({ label, children, side = 'bottom', align = 'center', sideOffset = 0, alignOffset = 0 }: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align} sideOffset={sideOffset} alignOffset={alignOffset}>
          <p className='text-xs capitalize'>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
