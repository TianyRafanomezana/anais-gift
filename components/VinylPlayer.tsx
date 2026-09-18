import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  cancelAnimation
} from 'react-native-reanimated';
import VinylRecord from './VinylRecord';

export default function VinylPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExtracted, setIsExtracted] = useState(false);

  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);

  // Style animé pour le vinyle
  const animatedVinylStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { rotate: `${rotation.value}deg` }
      ],
    };
  });

  const handlePress = () => {
    if (!isExtracted) {
      // 1. Sortir le vinyle
      translateY.value = withTiming(-180, {
        duration: 1000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1) // Sortie fluide
      }, (finished) => {
        if (finished) {
          // 2. Lancer la rotation une fois sorti
          rotation.value = withRepeat(
            withTiming(360, { duration: 3000, easing: Easing.linear }),
            -1, // Répétition infinie
            false // Ne pas faire d'aller-retour
          );
        }
      });
      setIsExtracted(true);
      setIsPlaying(true);
    } else {
      if (isPlaying) {
        // Pause de la rotation
        cancelAnimation(rotation);
        setIsPlaying(false);
      } else {
        // Reprise de la rotation depuis l'angle actuel
        rotation.value = withRepeat(
          withTiming(rotation.value + 360, { duration: 3000, easing: Easing.linear }),
          -1,
          false
        );
        setIsPlaying(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handlePress} style={styles.interactiveArea}>

        {/* Le Vinyle Animé (Z-index: 1) */}
        <Animated.View style={[styles.vinylWrapper, animatedVinylStyle]}>
          <VinylRecord size={260} />
        </Animated.View>

        {/* La Pochette Avant (Z-index: 2, par-dessus le vinyle) */}
        <View style={styles.sleeveFront}>
          <Text style={styles.sleeveText}>Pour Anaïs</Text>
          <Text style={styles.sleeveSubtext}>
            {isExtracted ? (isPlaying ? "Appuie pour pauser" : "Appuie pour jouer") : "Appuie pour ouvrir"}
          </Text>
        </View>

      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 500,
  },
  interactiveArea: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 400,
    width: 300,
  },
  vinylWrapper: {
    position: 'absolute',
    bottom: 20, // Position initiale (bien caché au fond de la pochette)
    zIndex: 1,
  },
  sleeveFront: {
    width: 280,
    height: 280,
    backgroundColor: '#F7CAD0', // Rose poudré satiné
    borderRadius: 4,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D4AF37', // Dorure fine
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 20,
  },
  sleeveText: {
    color: '#D4AF37',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 4,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sleeveSubtext: {
    marginTop: 20,
    color: '#8c5a61',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
  }
});
