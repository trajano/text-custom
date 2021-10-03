import { ColorModeOptions, ITheme as NBITheme } from "native-base";
import { TextStyle } from "react-native";

/**
 * NativeBase font sizes.  This includes string to allow custom font sizes.
 */
export type FontSize =
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

type FontConfig = {
  [fontFamily: string]: {
    [nativeFontWeight: number]: {
      normal?: string;
      italic?: string;
    };
  };
};

/**
 * This is a typesafe version of the NativeBase theme.  The original ITheme 
 * relies on `typeof` a theme, but that does not provide the necessary type
 * safety guarantees nor does it allow any meaningful extensions to a theme.
 */
export type ITheme = {
  fontSizes: { [fontSize: FontSize]: TextStyle["fontSize"] };
  letterSpacings: { [fontSize: FontSize]: TextStyle["letterSpacing"] };
  lineHeights: { [fontSize: FontSize]: TextStyle["lineHeight"] };
  fonts: { [fontFamily: FontFamily]: string };
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
  components: any;
  config: ColorModeOptions;
} & NBITheme;
