import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface TurntableSceneProps {
  armRotation: SharedValue<number>;
}

export default function TurntableScene() {
  


  return (
    <View style={styles.container}>
      {/* Turntable Base */}
      <View style={styles.turntableBase}>
        {/* Platter Rim (Tranche du plateau pour l'épaisseur 3D) */}
        <View style={styles.platterRim} />
        {/* Platter (Le plateau où le vinyle va atterrir) */}
        <View style={styles.platter} />
        
      </View>
    </View>
  );
}

export function TurntableArmScene({ armRotation }: TurntableSceneProps) {
  const animatedArmStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: -90 },
        { rotate: `${armRotation.value}deg` },
        { translateY: 90 },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <View style={[styles.turntableBase, styles.transparentBase]}>
        {/* Tonearm Base (Pivot) */}
        <View style={styles.tonearmBase} />
        
        {/* Tonearm (Le bras articulé animé) */}
        <Animated.View style={[styles.tonearmWrapper, animatedArmStyle]}>
          <View style={styles.tonearmLine} />
          <View style={styles.tonearmHead} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  turntableBase: {
    width: 320,
    height: 380,
    backgroundColor: '#2A1A24',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3f2736',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transparentBase: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  platterRim: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#333',
    position: 'absolute',
    top: 36,
  },
  platter: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#111',
    borderWidth: 4,
    borderColor: '#222',
    position: 'absolute',
    top: 30,
  },
  tonearmBase: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D4AF37',
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  tonearmWrapper: {
    position: 'absolute',
    top: 60,
    right: 35,
    width: 10,
    height: 200,
    zIndex: 11,
    alignItems: 'center',
  },
  tonearmLine: {
    width: 6,
    height: 180,
    backgroundColor: '#D4AF37',
    borderRadius: 3,
  },
  tonearmHead: {
    width: 15,
    height: 30,
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 2,
    marginTop: -5,
  }
});
