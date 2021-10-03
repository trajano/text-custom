import { ITextProps, themeTools, useTheme, useThemeProps } from "native-base";
import React, { createContext, PropsWithChildren, useContext } from "react";
import { Text, TextProps, TextStyle } from "react-native";
import { FontWeight, ITheme, Size } from "./NativeBaseTheme";

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
    fontFamily?: TextStyle['fontFamily'];
    fontWeight?: TextStyle['fontWeight'];
    fontStyle?: TextStyle['fontStyle'];

    underline?: boolean;
    strikeThrough?: boolean;

}

/**
 * These are NativeBase utility props shortcuts that override one or more
 * React Native Text style props.
 */
type NativeBaseTextUtilityProps = {
    /**
     * Shortcut for fontStyle: italic or normal.  This is overriden by fontStyle.
     */
    italic?: boolean;
    /**
     * Shortcut for weight 700 or 400. This is overriden by fontWeight.
     */
    bold?: boolean;
    /**
     * Shortcut for text decoration line underline
     */
    underline?: boolean;
    /**
     * Shortcut for text decoration line line-through
     */
    strikeThrough?: boolean;
    fontWeight?: FontWeight | TextStyle['fontWeight'];
    /**
     * The font size.  If the NativeBase font size is specified, it will automatically
     * set the letter spacing as well.
     */
    fontSize?: Size | TextStyle['fontSize'];
}

type CTextProps = PropsWithChildren<
    Omit<CTextStyle, "fontWeight" | "fontSize" | "color"> & NativeBaseTextUtilityProps & TextProps>

const TextStyleContext = createContext<CTextStyle>({})
export function CText({
    children,
    // fontFamily: newFontFamily,
    // fontSize: newFontSize,
    // color: newColor,
    // lineHeight: newLineHeight,
    // letterSpacing: newLetterSpacing,
    underline,
    strikeThrough,
    style,
    ...props }: ITextProps): JSX.Element {
    const theme: ITheme = useTheme();

    // obtain parent context
    const parentContext = useContext(TextStyleContext);


    /**
     * Props for the text of NativeBase.
     */
    let { fontFamily,
        fontSize: tFontSize,
        fontWeight: tFontWeight,
        fontStyle: tFontStyle,
        letterSpacing: tLetterSpacing,
        color: newColor } = useThemeProps('Text', { ...parentContext, ...props });

    const fontWeight = recomputeFontWeightWithProps(tFontWeight, theme, props);
    const fontStyle = recomputeFontStyleWithProps(tFontStyle, props);
    const fontSize = recomputeValueWithProps<TextStyle['fontSize']>(tFontSize, theme.fontSizes, 'sm');
    const letterSpacing = recomputeValueWithProps<TextStyle['letterSpacing']>(tLetterSpacing, theme.letterSpacings, 'md');
    const color = themeTools.getColor(theme, newColor, newColor);

    const textDecorationLine = computeTextDecorationLine({ underline, strikeThrough }, parentContext);

    const contextProps: CTextStyle = {
        fontFamily,
        fontStyle,
        fontWeight,
        underline,
        strikeThrough
    };

    const textProps = {
        ...resolveNativeFontStyle(theme, fontFamily, fontWeight, fontStyle),
        fontSize,
        letterSpacing,
        color,
        textDecorationLine
    }
    return (<TextStyleContext.Provider value={contextProps} >
        <Text {...props} style={[style, textProps]}>{children}</Text>
    </TextStyleContext.Provider>);
}

/**
 * Using the NativeBase theme, recompute the fontFamily value to
 * use one that is compatible with React Native Text.
 * @param theme NativeBase theme
 * @param fontFamily font family to look for.
 */
function resolveNativeFontStyle(theme: ITheme, fontFamily: string | undefined, fontWeight: TextStyle['fontWeight'] = "normal", fontStyle: TextStyle['fontStyle'] = "normal"): Pick<TextStyle, "fontFamily" | "fontWeight" | "fontStyle"> {

    if (fontFamily) {
        // at this point font family is defined, so check if it is an alias first

        if (fontFamily in theme.fonts) {
            const themeFontFamily = theme.fonts[fontFamily];
            if (typeof themeFontFamily !== "string" && themeFontFamily !== undefined) {
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
                fontFamily: theme.fontConfig[fontFamily][parseInt(fontWeight)][fontStyle]
            }
        }
    }
    // at this point fontFamily should be a system font or undefined
    return { fontFamily, fontWeight, fontStyle };

}

function recomputeFontWeightWithProps(newFontWeight: TextStyle['fontWeight'] | FontWeight, { fontWeights }: ITheme, { bold }: Pick<CTextProps, "bold">): TextStyle['fontWeight'] {

    let desiredFontWeightFromProps: "bold" | "normal" | undefined = undefined;
    // Apply prop modifications first

    if (bold === true) {
        desiredFontWeightFromProps = "bold";
    } else if (bold === false) {
        desiredFontWeightFromProps = "normal";
    }

    console.log({
        newFontWeight,
        desiredFontWeightFromProps,
    })

    // font weight can be from native base or from RN
    let desiredFontWeight = desiredFontWeightFromProps ?? newFontWeight;
    if (desiredFontWeight !== undefined) {

        let nbFontWeight: number = fontWeights[desiredFontWeight];
        if (nbFontWeight !== undefined) {
            desiredFontWeight = nbFontWeight.toString();
        }

    }

    return desiredFontWeight as TextStyle['fontWeight'];
}


function recomputeValueWithProps<T, X extends Record<string, T | undefined> = Record<string, T | undefined>>(val: string | T, map: X, fallback: keyof X): T | undefined {
    if (typeof val === "string") {
        return map[val] ?? map[fallback];
    } else {
        return val;
    }
}


function recomputeFontStyleWithProps(fontStyle: TextStyle['fontStyle'], { italic }: Pick<CTextProps, "italic">): TextStyle['fontStyle'] {
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
    { underline: newUnderline, strikeThrough: newStrikeThrough }: Pick<CTextStyle, "underline" | "strikeThrough">,
    { underline: parentUnderline, strikeThrough: parentStrikeThrough }: Pick<CTextStyle, "underline" | "strikeThrough">): TextStyle['textDecorationLine'] {

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
