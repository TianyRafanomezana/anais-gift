import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface HexPlaqueProps {
  label: string;
  onPress: () => void;
  width?: number;
}

export default function HexPlaque({ label, onPress, width = 140 }: HexPlaqueProps) {
  const scale = useSharedValue(1);
  const height = 24;
  const pointWidth = 12;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 10, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 300 });
  };

  const pathData = `
    M ${pointWidth} 0 
    L ${width - pointWidth} 0 
    L ${width} ${height / 2} 
    L ${width - pointWidth} ${height} 
    L ${pointWidth} ${height} 
    L 0 ${height / 2} 
    Z
  `;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.container}
    >
      <Animated.View style={[styles.plaqueWrapper, animatedStyle]}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <LinearGradient id="goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#F5D76E" />
              <Stop offset="50%" stopColor="#D4AF37" />
              <Stop offset="100%" stopColor="#AA8222" />
            </LinearGradient>
            
            <LinearGradient id="borderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FFF2B2" />
              <Stop offset="100%" stopColor="#8A6310" />
            </LinearGradient>
          </Defs>

          {/* Ombre externe */}
          <Path
            d={pathData}
            fill="#000000"
            opacity={0.3}
            transform="translate(0, 2)"
          />

          {/* Base de la plaque */}
          <Path
            d={pathData}
            fill="url(#goldGrad)"
            stroke="url(#borderGrad)"
            strokeWidth={1}
          />
          
          {/* Petits "clous" de fixation */}
          <Path d={`M ${pointWidth / 2} ${height / 2} A 1.5 1.5 0 1 0 ${pointWidth / 2 + 0.1} ${height / 2}`} fill="#5C2A33" />
          <Path d={`M ${width - (pointWidth / 2)} ${height / 2} A 1.5 1.5 0 1 0 ${width - (pointWidth / 2) + 0.1} ${height / 2}`} fill="#5C2A33" />
        </Svg>
        
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View style={styles.textContainer}>
            <Text style={styles.text}>{label}</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  plaqueWrapper: {
    // Les ombres rectangulaires natives posent problème sur web avec des SVG.
    // L'ombre est gérée directement à l'intérieur du SVG.
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    color: '#4A1525', // Bordeaux profond pour contraster avec l'or
    textAlign: 'center',
  }
});
