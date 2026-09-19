import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Pattern, Rect, Path } from 'react-native-svg';

export default function WallPattern() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern id="stripes" width="60" height="60" patternUnits="userSpaceOnUse">
            {/* Couleur de fond du mur (identique à l'ancien safeArea) */}
            <Rect width="60" height="60" fill="#1E1119" />
            {/* Rayure verticale plus sombre et épaisse */}
            <Path d="M0,0 L0,60" stroke="#2A1A24" strokeWidth="20" />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#stripes)" />
      </Svg>
    </View>
  );
}
