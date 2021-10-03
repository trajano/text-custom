import { ColorModeOptions, ITheme as NBITheme } from "native-base";
import { TextStyle } from "react-native";

/**
 * NativeBase sizes.  This includes string to allow custom font sizes.
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
 * NativeBase font family.  This includes string to allow custom font weight.
 */
type FontFamily = "body" | "heading" | "mono" | string;

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
 * This is a typesafe version of the NativeBase theme.  The original ITheme
 * relies on `typeof` a theme, but that does not provide the necessary type
 * safety guarantees nor does it allow any meaningful extensions to a theme.
 */
export type ITheme = {
  fontSizes: { [fontSize: Size]: TextStyle["fontSize"] };
  letterSpacings: { [fontSize: Size]: TextStyle["letterSpacing"] };
  lineHeights: { [fontSize: Size]: TextStyle["lineHeight"] };
  fonts: { [fontFamily: FontFamily]: string | FontStyleProp };
  fontConfig: FontConfig;
  fontWeights: { [fontWeight: FontWeight]: number };

  // TODO later
  borderWidths: any;
  breakpoints: any;
  colors: any;
  radii: any;
  sizes: any;
  space: any;
  shadows: any;
  opacity: any;
  components: {
    [componentName: string]: any;
  };
  config: ColorModeOptions;
} & NBITheme;
