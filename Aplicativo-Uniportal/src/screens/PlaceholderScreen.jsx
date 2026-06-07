import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { sharedStyles } from '../styles/styles';

export default function PlaceholderScreen() {
  return (
    <View style={styles.centerContent}>
      <Text>Tela em Construção</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ...sharedStyles,
});
