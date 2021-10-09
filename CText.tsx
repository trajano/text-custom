import { ITextProps, themeTools, usePropsResolution, useTheme } from "native-base";
import React, { createContext, useContext } from "react";
import { Text, TextStyle } from "react-native";
import type { FontWeight, ITheme } from "./ITheme";


/**
 * Context props.  These are values that are tracked in the context as they
 * are not nestable in React Native text properly primarily due to the font or
 * composite values
 */
type CTextStyle = {
    /**
     * The **NativeBase** font-family.  So this is not the system font with a
     * specifc styling unless it is itself a system font that is not defined
     * in the NativeBase theme.
     */
    fontFamily?: TextStyle["fontFamily"];
    fontWeight?: TextStyle["fontWeight"];
    fontStyle?: TextStyle["fontStyle"];
    fontSize?: TextStyle["fontSize"];

    underline?: boolean;
    strikeThrough?: boolean;
};

const TextStyleContext = createContext<CTextStyle>({});
export function CText({
    children,
    underline,
    strikeThrough,
    style,
    ...rest
}: ITextProps): JSX.Element {
    const theme: ITheme = useTheme();
    // const props = useBreakpointResolvedProps(rest);
    const props = rest;
    const parentContext = useContext(TextStyleContext);

    /**
     * Props for the text of NativeBase.
     */
    const {
        fontFamily,
        fontSize: tFontSize,
        fontWeight: tFontWeight,
        fontStyle: tFontStyle,
        letterSpacing: tLetterSpacing,
        lineHeight: tLineHeight,
        color: newColor,
    } = usePropsResolution("Text", { ...parentContext, ...props });

    const fontWeight = recomputeFontWeightWithProps(tFontWeight, theme, props);
    const fontStyle = recomputeFontStyleWithProps(tFontStyle, props);
    const fontSize = recomputeValueWithProps<TextStyle["fontSize"]>(
        tFontSize,
        theme.fontSizes
    );
    const letterSpacing = recomputeValueWithPropsToDp(
        tLetterSpacing,
        theme.letterSpacings,
        fontSize
    );
    const lineHeight = recomputeValueWithPropsToDp(
        tLineHeight,
        theme.lineHeights,
        fontSize
    );
    const color = themeTools.getColor(theme, newColor, newColor);

    const textDecorationLine = computeTextDecorationLine(
        { underline, strikeThrough },
        parentContext
    );

    const contextProps: CTextStyle = {
        fontFamily,
        fontStyle,
        fontWeight,
        fontSize,
        underline,
        strikeThrough,
    };

    const textProps: TextStyle = {
        ...resolveNativeFontStyle(theme, fontFamily, fontWeight, fontStyle),
        color,
        fontSize,
        letterSpacing,
        lineHeight,
        textDecorationLine,
        textTransform: props.textTransform as TextStyle["textTransform"],
    };
    return (
        <TextStyleContext.Provider value={contextProps}>
            <Text {...props} style={[style, textProps]}>
                {children}
            </Text>
        </TextStyleContext.Provider>
    );
}

/**
 * Using the NativeBase theme, recompute the fontFamily value to
 * use one that is compatible with React Native Text.
 * @param theme NativeBase theme
 * @param fontFamily font family to look for.
 */
function resolveNativeFontStyle(
    theme: ITheme,
    fontFamily: string | undefined,
    fontWeight: TextStyle["fontWeight"] = "normal",
    fontStyle: TextStyle["fontStyle"] = "normal"
): Pick<TextStyle, "fontFamily" | "fontWeight" | "fontStyle"> {
    if (fontFamily) {
        // at this point font family is defined, so check if it is an alias first

        if (fontFamily in theme.fonts) {
            const themeFontFamily = theme.fonts[fontFamily];
            if (
                typeof themeFontFamily !== "string" &&
                themeFontFamily !== undefined
            ) {
                throw new Error("not yet implemented");
            }
            fontFamily = themeFontFamily;
        }
    }

    // fontFamily can become undefined at this point due to `theme.fonts`
    if (fontFamily) {
        // at this point fontFamily should be resolved to a font that could be a
        // thene font or a system font.  So check if it is a theme font

        if (fontFamily in theme.fontConfig) {
            // No need for guard on font weight nor font style as `normal` are guaranteed to be there
            return {
                fontFamily:
                    theme.fontConfig[fontFamily][parseInt(fontWeight)][fontStyle],
            };
        }
    }
    // at this point fontFamily should be a system font or undefined
    return { fontFamily, fontWeight, fontStyle };
}

function recomputeFontWeightWithProps(
    newFontWeight: TextStyle["fontWeight"] | FontWeight,
    { fontWeights }: ITheme,
    { bold }: Pick<ITextProps, "bold">
): TextStyle["fontWeight"] {
    let desiredFontWeightFromProps: "bold" | "normal" | undefined = undefined;
    // Apply prop modifications first

    if (bold === true) {
        desiredFontWeightFromProps = "bold";
    } else if (bold === false) {
        desiredFontWeightFromProps = "normal";
    }

    // font weight can be from native base or from RN
    let desiredFontWeight = desiredFontWeightFromProps ?? newFontWeight;
    if (desiredFontWeight !== undefined) {
        const nbFontWeight: number = fontWeights[desiredFontWeight];
        if (nbFontWeight !== undefined) {
            desiredFontWeight = nbFontWeight.toString();
        }
    }

    return desiredFontWeight as TextStyle["fontWeight"];
}

function recomputeValueWithProps<
    T,
    X extends Record<string, T | undefined> = Record<string, T | undefined>
>(val: string | T, map: X, fallback?: T): T | undefined {
    if (typeof val === "string") {
        return map[val] ?? fallback;
    } else {
        return val;
    }
}

function recomputeValueWithPropsToDp(
    val: string | number | undefined,
    map: Record<string, string | number | undefined>,
    baseFontSize: number | undefined,
    fallback?: number
): number | undefined {
    const computed = recomputeValueWithProps<string | number | undefined>(
        val,
        map,
        fallback
    );
    return convertToDp(computed, baseFontSize);
}

function recomputeFontStyleWithProps(
    fontStyle: TextStyle["fontStyle"],
    { italic }: Pick<ITextProps, "italic">
): TextStyle["fontStyle"] {
    if (italic === true) {
        return "italic";
    } else if (italic === false) {
        return "normal";
    }
    return fontStyle;
}

/**
 * Comptues the text decoration line for strike through, underline or both.  This provides higher level control, but does not track overrides.
 * @param current
 * @param parent
 * @returns textDecorationLine style value.
 */
function computeTextDecorationLine(
    {
        underline: newUnderline,
        strikeThrough: newStrikeThrough,
    }: Pick<CTextStyle, "underline" | "strikeThrough">,
    {
        underline: parentUnderline,
        strikeThrough: parentStrikeThrough,
    }: Pick<CTextStyle, "underline" | "strikeThrough">
): TextStyle["textDecorationLine"] {
    const underline = newUnderline ?? parentUnderline;
    const strikeThrough = newStrikeThrough ?? parentStrikeThrough;

    if (underline === undefined && strikeThrough === undefined) {
        return undefined;
    } else if (underline === false && strikeThrough === false) {
        return "none";
    } else if (underline === true && strikeThrough === true) {
        return "underline line-through";
    } else if (underline === true) {
        return "underline";
    } else if (strikeThrough === true) {
        return "line-through";
    } else {
        throw new Error("should not get here");
    }
}

/**
 * Convert to DP with the capability of specifing the font size.
 * @param val
 * @param baseFontSize
 * @returns
 */
function convertToDp(
    val: string | number | undefined,
    baseFontSize = 16
): number | undefined {
    if (val === undefined) {
        return undefined;
    }
    return (themeTools.convertToDp(val) * baseFontSize) / 16;
}
