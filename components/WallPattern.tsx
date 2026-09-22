import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Pattern, Rect, Path, Circle, RadialGradient, Stop } from 'react-native-svg';

export default function WallPattern() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%">
        <Defs>
          {/* Motif capitonné (velours bordeaux avec boutons or) */}
          <Pattern id="quilted" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <Rect width="80" height="80" fill="#38040C" /> {/* Fond velours sombre */}
            {/* Lignes du capitonnage plus claires (vibrant) */}
            <Path d="M0,0 L80,0 L80,80 L0,80 Z" fill="none" stroke="#821525" strokeWidth="4" />
            {/* Boutons Or (Clous dorés) à chaque intersection */}
            <Circle cx="0" cy="0" r="3" fill="#D4AF37" />
            <Circle cx="80" cy="0" r="3" fill="#D4AF37" />
            <Circle cx="0" cy="80" r="3" fill="#D4AF37" />
            <Circle cx="80" cy="80" r="3" fill="#D4AF37" />
          </Pattern>
        </Defs>
        {/* Couche 1 : Motif texturé */}
        <Rect width="100%" height="100%" fill="url(#quilted)" />
      </Svg>
    </View>
  );
}
