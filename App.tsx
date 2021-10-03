import * as PlayfairDisplay from '@expo-google-fonts/playfair-display';
import { StatusBar } from 'expo-status-bar';
import { extendTheme, ITheme, NativeBaseProvider, useTheme } from 'native-base';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CText } from './CText';
import { useExpoFonts, useExpoNativeBaseFontConfig } from './useExpoFonts';
function Tx() {

  const theme: ITheme = useTheme();
  console.log(theme.lineHeights);
  return null;
}
export default function App() {

  const [loaded] = useExpoFonts([PlayfairDisplay]);
  if (!loaded) {
    return null;
  }
  const theme = {
    fontConfig: useExpoNativeBaseFontConfig([PlayfairDisplay]),
    fonts: {
      body: "PlayfairDisplay"
    },
    letterSpacings: {
      "5xl": "1em"
    },
    components: {
      Text: {
        baseStyle: { fontSize: 'md' }
      }
    }
  }
  console.log(theme);
  return (
    <NativeBaseProvider theme={extendTheme(theme)}>
      <View style={styles.container}>
        <View>
          <CText italic>nyaa <CText>nested</CText> <CText bold>nested bold</CText> </CText>
          <CText fontSize="4xl" underline bold>FOO <CText fontSize="md" underline bold>FOO</CText></CText>
          <CText fontSize="4xl" fontFamily="body">
            <CText bold>Open up <CText italic>App.tsx</CText> to start <CText bold={false}>working</CText> on your <Text style={{ color: 'red' }}>interop! <CText bold color="blue.200" fontSize="5xl">REALLY!</CText></Text></CText>
          </CText>
          <CText fontSize="4xl" fontFamily="body" underline>
            <CText bold>Open up <CText italic>App.tsx</CText> to start <CText bold={false}>working</CText> on your <Text style={{ color: 'red' }}>interop! <CText bold color="blue.200" fontSize="5xl">REALLY!</CText></Text></CText>
          </CText>
        </View>
        <StatusBar style="auto" />
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
