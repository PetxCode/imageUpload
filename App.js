import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ImagePickerFile } from './component/ImagePicker';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>We are ready now!!!</Text>
      <ImagePickerFile/>
      <StatusBar style="auto" />
    </View>
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
