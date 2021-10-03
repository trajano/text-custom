import { ColorModeOptions, ITheme } from "native-base";

/**
 * NativeBase font sizes.  This includes string to allow custom font sizes.
 */
type FontSize =
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
type FontWeight =
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
 * This is a typesafe version of the NativeBase theme
 */
type NativeBaseTheme = {
  fontSizes: { [fontSize: FontSize]: TextStyle["fontSize"] };
  letterSpacings: { [fontSize: FontSize]: TextStyle["letterSpacing"] };
  lineHeights: { [fontSize: FontSize]: TextStyle["lineHeight"] };
  fonts: { [fontFamily: FontFamily]: string };
  fontConfig: FontConfig;
  fontWeights: { [fontWeight: FontWeight]: number };

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
} & ITheme;
