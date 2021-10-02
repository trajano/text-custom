import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CText } from './CText';

export default function App() {
  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <CText bold>Open up <CText italic>App.tsx</CText> to start <CText bold={false}>working</CText> on your <Text style={{ color: 'red' }}>interop!</Text></CText>
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
