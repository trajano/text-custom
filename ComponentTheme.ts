/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ITheme } from "./NativeBaseTheme";
import type { ColorSchemeName } from "react-native";
import type { StylesProps } from "styled-system";

export type StyleFunctionBaseProps = {
  theme: ITheme;
  colorMode: NonNullable<ColorSchemeName>;
  accessibleColors: boolean;
  setColorMode(colorMode: NonNullable<ColorSchemeName>): void;
  setAccessibleColors(accessibleColors: boolean): void;
};
type StyleProps<P> = { [styleKey: string]: any } & Partial<P>;
type StyleFunction<P> = (props: P & StyleFunctionBaseProps) => StylesProps;
export type ComponentTheme<
  P extends Record<string, unknown> = { [propKey: string]: any }
> = {
  baseStyle?: StyleFunction<P> | StyleProps<P>;
  defaultProps?: P;
  sizes?: Record<string, StyleProps<P>>;
  variants?: Record<string, StyleFunction<P> | StyleProps<P>>;
};
