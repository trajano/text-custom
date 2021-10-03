import { themeTools, useTheme } from "native-base";
import React, { createContext, PropsWithChildren, useContext } from "react";
import { Text, TextProps, TextStyle } from "react-native";
import { Size, FontWeight, ITheme } from "./NativeBaseTheme";

/**
 * Context props.  These are values that are tracked in the context as they
 * are not nestable in React Native text properly primarily due toe font.
 */
type CTextStyle = {
    /**
     * The **NativeBase** font-family.  So this is not the system font with a 
     * specifc styling unless it is itself a system font that is not defined
     * in the NativeBase theme.
     */
    fontFamily?: TextStyle['fontFamily'];
    fontWeight?: TextStyle['fontWeight'];
    fontSize?: TextStyle['fontSize'];
    fontStyle?: TextStyle['fontStyle'];
    color?: TextStyle['color'];
    lineHeight?: TextStyle['lineHeight'];
    letterSpacing?: TextStyle['letterSpacing'];
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
     * Shortcut for text decoration underline
     */
    underline?: boolean;
    fontWeight?: FontWeight | TextStyle['fontWeight'];
    /**
     * The font size.  If the NativeBase font size is specified, it will automatically
     * set the letter spacing as well.
     */
    fontSize?: Size | TextStyle['fontSize'];
}

type CTextProps = PropsWithChildren<
    Omit<CTextStyle, "fontWeight" | "fontSize"> & NativeBaseTextUtilityProps & TextProps>

const TextStyleContext = createContext<CTextStyle>({})
export function CText({
    children,
    bold,
    italic,
    fontFamily: newFontFamily,
    fontWeight: newFontWeight,
    fontSize: newFontSize,
    fontStyle: newFontStyle,
    color: newColor,
    lineHeight: newLineHeight,
    letterSpacing: newLetterSpacing,
    style,
    ...props }: CTextProps): JSX.Element {
    const theme: ITheme = useTheme();

    // obtain parent context
    const { fontFamily: parentFontFamily, fontWeight: parentFontWeight, fontSize: parentFontSize, fontStyle: parentFontStyle, color: parentColor,
        lineHeight: parentLineHeight,
        letterSpacing: parentLetterSpacing,

    } = useContext(TextStyleContext);

    const fontFamily = newFontFamily ?? parentFontFamily;

    const fontWeight = computeFontWeight(theme.fontWeights, bold, newFontWeight, parentFontWeight);

    let fontStyle = newFontStyle;
    if (fontStyle === undefined && italic === true) {
        fontStyle = "italic";
    } else if (fontStyle === undefined && italic === false) {
        fontStyle = "normal";
    }
    fontStyle = fontStyle ?? parentFontStyle;

    let fontSize: TextStyle['fontSize'];
    let letterSpacing: TextStyle['letterSpacing'];
    if (typeof newFontSize === "string") {
        fontSize = theme.fontSizes[newFontSize];
        letterSpacing = theme.letterSpacings[newFontSize];
    } else {
        fontSize = fontSize ?? newFontSize ?? parentFontSize;
        letterSpacing = letterSpacing ?? newLetterSpacing ?? parentLetterSpacing;
    }

    let color;
    if (typeof newColor === "string") {
        color = themeTools.getColor(theme, newColor);
    }
    color = color ?? parentColor;

    const lineHeight = newLineHeight ?? parentLineHeight;

    const contextProps: CTextStyle = {
        fontFamily,
        fontSize,
        fontStyle,
        fontWeight,
        color,
        lineHeight,
        letterSpacing
    };

    const textProps = computeTextProps(theme, contextProps);
    return (<TextStyleContext.Provider value={contextProps}>
        <Text {...props} style={[style, textProps]}>{children}</Text>
    </TextStyleContext.Provider >);
}
function computeFontWeight(fontWeights: ITheme['fontWeights'], bold?: boolean, newFontWeight?: FontWeight | TextStyle['fontWeight'], parentFontWeight?: TextStyle['fontWeight']): TextStyle['fontWeight'] {
    let fontWeight = ((newFontWeight && (fontWeights[newFontWeight] as number).toString()) ?? (newFontWeight)) as TextStyle['fontWeight'];
    if (fontWeight === undefined && bold === true) {
        fontWeight = "bold";
    } else if (fontWeight === undefined && bold === false) {
        fontWeight = "normal";
    }
    fontWeight = fontWeight ?? parentFontWeight;
    return fontWeight;
}
/**
 * Using the NativeBase theme, recompute the fontFamily value to
 * use one that is compatible with React Native Text.
 * @param theme NativeBase theme
 * @param contextProps context props.
 */
function computeTextProps(theme: ITheme, contextProps: CTextStyle): TextStyle {

    /**
     * Font family so far;
     */
    let fontFamily = contextProps.fontFamily;

    if (fontFamily) {
        // at this point font family is defined, so check if it is an alias first

        if (fontFamily in theme.fonts) {
            fontFamily = theme.fonts[fontFamily];
        }

    }

    // fontFamily can become undefined at this point due to `theme.fonts`
    if (fontFamily) {
        // at this point fontFamily should be resolved to a font that could be a
        // thene font or a system font.  So check if it is a theme font

        if (fontFamily in theme.fontConfig) {
            // Cast is needed to avoid rebuilding context props as fontFamily should already be present at this point.
            console.log({ fontFamily })
            fontFamily = resolveThemeFont(theme, fontFamily, contextProps);
        }
    }
    // at this point fontFamily should be a system font or undefined
    return { ...contextProps, fontFamily };

}
/**
 * Resolve the theme font.  
 * @param fontFamilyConfig font family config
 * @param props text props, this assumes a font is managed already 
 */
function resolveThemeFont({ fontConfig, fontWeights }: ITheme, fontFamily: string, { fontWeight = "normal", fontStyle = "normal" }: CTextStyle): TextStyle['fontFamily'] {
    const fontFamilyConfig = fontConfig[fontFamily];

    // No need for guard on font weight nor font style as `normal` are guaranteed to be there
    return fontFamilyConfig[fontWeights[fontWeight]][fontStyle];
}