import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

interface TopNavigationProps {
  onBackPress: () => void;
  isVisible: boolean;
}

export default function TopNavigation({ onBackPress, isVisible }: TopNavigationProps) {
  if (!isVisible) return null;

  return (
    <Animated.View 
      entering={FadeInUp.duration(600).delay(300)}
      exiting={FadeOutUp.duration(400)}
      style={styles.container}
      pointerEvents="box-none"
    >
      <View style={styles.content}>
        <Pressable onPress={onBackPress} style={styles.pressableContainer}>
          <Text style={styles.title}>Brand New Heart</Text>
          <Text style={styles.subtitle}>for Anais</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50, // Poussé vers le bas pour ne pas coller au bord haut de l'écran
    left: 0,
    right: 0,
    height: 60,
    zIndex: 999,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Centrage parfait
  },
  title: {
    fontFamily: 'PinyonScript_400Regular',
    fontSize: 44, // Légèrement plus grand
    color: '#F8E3E5', // Rose très clair
    textShadowColor: 'rgba(0, 0, 0, 0.4)', // Ombre pour détacher le texte de la grille
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  pressableContainer: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#D4AF37', // Or
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginTop: -2,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  }
});
