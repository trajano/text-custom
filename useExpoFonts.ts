import { FontSource, useFonts } from "expo-font";
import { FontConfig } from "./NativeBaseTheme";

type ExpoFontMeta = {
  key: string;
  family: string;
  weight: number;
  italic: boolean;
};
/**
 * Parses the Expo Google Font key to extract the family, weight and italic indicator.
 * @param key Expo Google Font key
 * @returns meta
 */
function parseExpoFontMeta(key: string): ExpoFontMeta {
  return {
    key,
    family: key.substring(0, key.indexOf("_")),
    weight: parseInt(key.split("_")[1].substring(0, 3)),
    italic: !!key.split("_")[2],
  };
}

/**
 * An expo font  with additional props that are added by expo-google-fonts
 */
type ExpoFont = {
  [font: string]: any;
  /** meta data typo */
  __metdata__?: any;
  /** meta data  */
  __metadata__?: any;
  /**
   * Use fonts function, will be ignored
   */
  useFonts?: any;
};

export function useExpoFonts(fonts: ExpoFont[]): ReturnType<typeof useFonts> {
  // pick off only the sources
  const fontSourceEntries = fonts
    .flatMap(({ __metdata__, __metadata__, useFonts: _useFonts, ...entries }) =>
      Object.entries(entries)
    )
    .reduce(
      (acc, current) => ({ ...acc, [current[0]]: current[1] }),
      {} as Record<string, FontSource>
    );

  return useFonts(fontSourceEntries);
}

function reduceMeta(acc: FontConfig, current: ExpoFontMeta): FontConfig {
  return {
    ...acc,
    [current.family]: {
      ...acc[current.family],
      [current.weight]: {
        ...((acc[current.family] && acc[current.family][current.weight]) ?? {}),
        [current.italic ? "italic" : "normal"]: current.key,
      },
    },
  };
}
export function useExpoNativeBaseFontConfig(fonts: ExpoFont[]): FontConfig {
  const x = fonts
    .flatMap(({ __metdata__, __metadata__, useFonts: _useFonts, ...entries }) =>
      Object.keys(entries)
    )
    .map(parseExpoFontMeta)
    .reduce(reduceMeta, {} as FontConfig);
  console.log(x);
  return x;
}
