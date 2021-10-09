import type { Size } from "./ITheme";

export type BreakpointsConfig = {
  [breakpointName: Size]: number;
  /**
   * Base resolution for breakpoint.  MUST be ZERO, any other number will not make sense.
   */
  base: 0;
  /**
   * Small devices.  Generally most phones will have this.
   */
  sm: number;
  /**
   * Medium devices.  Generally a tablet on portrait mode will have this size.
   */
  md: number;
  /**
   * Large devices.  Generally a tablet on landscape mode will have this size.
   */
  lg: number;
  /**
   * eXtra Large devices.  Generally a small desktop monitor, or landscape for an iPad Pro.
   */
  xl: number;
  /**
   * Really Large devices.  Generally a large desktop monitor.
   */
  "2xl": number;
};
