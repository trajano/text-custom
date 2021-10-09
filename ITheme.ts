import type { ColorModeOptions, ITheme as NBITheme } from "native-base";
import type { TextStyle } from "react-native";
import type { BreakpointsConfig } from "./BreakpointsConfig";

import type { ComponentTheme } from "./ComponentTheme";

/**
 * NativeBase sizes.  This includes string to allow custom sizes.
 */
export type Size =
  | "2xs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "9xl"
  | string;

/**
 * NativeBase font weight.  This includes string to allow custom font weight.
 */
export type FontWeight =
  | "hairline"
  | "thin"
  | "light"
  | "normal"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black"
  | "extraBlack"
  | string;

export type FontFamilyStyleConfig = {
  /**
   * Normal style font.  This is required, if italic is not present it will fallback to this style.
   */
  normal: string;
  italic?: string;
};
export type FontFamilyConfig = {
  [nativeFontWeight: number]: FontFamilyStyleConfig;
  400: FontFamilyStyleConfig;
};
export type FontConfig = {
  [fontFamily: string]: FontFamilyConfig;
};

/**
 * Text props set for the font.  This allows setting `fontFamily` and it will configure these as the default props for the font.  *TODO*
 * This is not part of NativeBase.
 */
export type FontStyleProp = TextStyle & {
  /**
   * The **NativeBase** font-family.  So this is not the system font with a
   * specifc styling unless it is itself a system font that is not defined
   * in the NativeBase theme.
   */
  fontFamily?: TextStyle["fontFamily"];
  fontWeight?: TextStyle["fontWeight"];
  fontSize?: TextStyle["fontSize"];
};

/**
 * Color value.  In case NB supports the other types in the future.
 */
type ColorValue = string;
type ColorSwatch = {
  /**
   * Lightest value for the swatch.
   */
  50: ColorValue;
  100: ColorValue;
  200: ColorValue;
  300: ColorValue;
  400: ColorValue;
  /**
   * This is the base value for the swatch.
   */
  500: ColorValue;
  600: ColorValue;
  700: ColorValue;
  800: ColorValue;
  /**
   * Darkest value for the swatch.
   */
  900: ColorValue;
};

type ColorsConfig = {
  contrastThreshold: number;
  white: ColorValue;
  black: ColorValue;
  lightText: ColorValue;
  darkText: ColorValue;
} & {
  [colorScheme: string]: ColorSwatch;
  danger: ColorSwatch;
  error: ColorSwatch;
  success: ColorSwatch;
  warning: ColorSwatch;
  muted: ColorSwatch;
  primary: ColorSwatch;
  info: ColorSwatch;
  secondary: ColorSwatch;
  light: ColorSwatch;
  tertiary: ColorSwatch;
  dark: ColorSwatch;
};

type FontsConfig = { [fontFamily: string]: string | FontStyleProp } & {
  body: string;
  heading: string;
  mono: string;
};

/**
 * This is a typesafe version of the NativeBase theme.  The original ITheme
 * relies on `typeof` a theme, but that does not provide the necessary type
 * safety guarantees nor does it allow any meaningful extensions to a theme.
 */
export type ITheme = {
  fontSizes: { [fontSize: Size]: TextStyle["fontSize"] };
  letterSpacings: { [fontSize: Size]: string | TextStyle["letterSpacing"] };
  lineHeights: { [fontSize: Size]: string | TextStyle["lineHeight"] };
  fonts: FontsConfig;
  fontConfig: FontConfig;
  fontWeights: { [fontWeight: FontWeight]: number };
  components: {
    [componentName: string]: ComponentTheme;
  };
  config: ColorModeOptions;
  colors: ColorsConfig;
  breakpoints: BreakpointsConfig;

  // TODO later
  borderWidths: any;
  radii: any;
  sizes: any;
  space: any;
  shadows: any;
  opacity: any;
} & NBITheme;
