import React, { createContext, PropsWithChildren, useContext } from "react";
import { Text, TextProps, TextStyle } from "react-native";

type CTextStyle = {
    fontFamily?: TextStyle['fontFamily'];
    fontWeight?: TextStyle['fontWeight'];
    fontSize?: TextStyle['fontSize'];
    fontStyle?: TextStyle['fontStyle'];
    color?: TextStyle['color'];
    lineHeight?: TextStyle['lineHeight'];
    letterSpacing?: TextStyle['letterSpacing'];
}

type CTextProps = PropsWithChildren<CTextStyle & {
    /**
     * Shortcut for fontStyle: italic or normal.  This is overriden by fontStyle.
     */
    italic?: boolean;
    /**
     * Shortcut for weight 700 or 400. This is overriden by fontWeight.
     */
    bold?: boolean;
} & TextProps>

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

    // obtain parent context
    const { fontFamily: parentFontFamily, fontWeight: parentFontWeight, fontSize: parentFontSize, fontStyle: parentFontStyle, color: parentColor,
        lineHeight: parentLineHeight,
        letterSpacing: parentLetterSpacing,

    } = useContext(TextStyleContext);

    const fontFamily = newFontFamily ?? parentFontFamily;

    let fontWeight = newFontWeight;
    if (fontWeight === undefined && bold === true) {
        fontWeight = "700";
    } else if (fontWeight === undefined && bold === false) {
        fontWeight = "400";
    }
    fontWeight ??= parentFontWeight;

    let fontStyle = newFontStyle;
    if (fontStyle === undefined && italic === true) {
        fontStyle = "italic";
    } else if (fontStyle === undefined && italic === false) {
        fontStyle = "normal";
    }
    fontStyle ??= parentFontStyle;

    const fontSize = newFontSize ?? parentFontSize;

    const color = newColor ?? parentColor;

    const lineHeight = newLineHeight ?? parentLineHeight;
    const letterSpacing = newLetterSpacing ?? parentLetterSpacing;


    const textProps = {
        fontFamily,
        fontSize,
        fontStyle,
        fontWeight,
        color,
        lineHeight,
        letterSpacing
    };
    return (<TextStyleContext.Provider value={textProps}>
        <Text {...props} style={[style, textProps]}>{children}</Text>
    </TextStyleContext.Provider >);
}
