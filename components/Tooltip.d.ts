declare module 'Tooltip' {
  import { FC } from 'react';
  
  interface TooltipProps {
    content: string;
    children: React.ReactNode;
  }

  export const Tooltip: FC<TooltipProps>;
  export default Tooltip;
}
