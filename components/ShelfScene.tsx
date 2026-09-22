import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing, interpolate } from 'react-native-reanimated';
import PhysicalCards from './PhysicalCards';
import HexPlaque from './HexPlaque';

const { width, height } = Dimensions.get('window');

interface ShelfSceneProps {
  onBoxPress?: () => void;
  onVinylPlaquePress?: () => void;
  isLidOpen?: boolean;
}

export default function ShelfScene({ onBoxPress, onVinylPlaquePress, isLidOpen = false }: ShelfSceneProps) {
  const pulseScale = useSharedValue(1);

  const animatedBoxStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }]
  }));

  const lidProgress = useSharedValue(0);

  useEffect(() => {
    lidProgress.value = withTiming(isLidOpen ? 1 : 0, {
      duration: 600,
      easing: isLidOpen ? Easing.out(Easing.back(1.5)) : Easing.inOut(Easing.quad)
    });
  }, [isLidOpen]);

  const handlePress = (e: any) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    if (onBoxPress) onBoxPress();
  };

  const animatedLidStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: interpolate(lidProgress.value, [0, 1], [0, -40]) },
        { rotateZ: `${interpolate(lidProgress.value, [0, 1], [0, -15])}deg` }
      ],
      opacity: interpolate(lidProgress.value, [0, 0.8, 1], [1, 1, 0])
    };
  });

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.wall}>
        <Text style={styles.instructionText}>🎧 Installe-toi au calme...</Text>
      </View>

      {/* L'étagère Supérieure (Souvenirs) */}
      <View style={styles.topShelfTop} />
      <View style={styles.topShelfFront}>
        {/* On remplace la plaque par rien ou par la box elle-même, mais on met une déco */}
        <View style={styles.plaqueContainer}>
          <HexPlaque label="BOÎTE À MÉDIT" onPress={() => handlePress(null)} width={150} />
        </View>
      </View>

      {/* L'Écrin Précieux (Coquette Box) */}
      <Pressable
        onPress={handlePress}
        style={styles.boxClickArea}
      >
        <Animated.View style={[styles.boxWrapper, animatedBoxStyle]}>
          {/* Base de la boîte */}
          <View style={styles.boxBase}>
            <View style={styles.labelContainer}>
              <Text style={styles.boxText}>Pensées du coeur</Text>
            </View>
          </View>

          {/* Les Cartes Physiques (sortent de la boîte) */}
          <PhysicalCards isOpen={isLidOpen} />

          {/* Couvercle animé */}
          <Animated.View style={[styles.boxLid, animatedLidStyle]}>
            {/* Effet dentelle sur le couvercle */}
            <View style={styles.laceBorder} />
            {/* Sceau Cœur */}
            <View style={styles.heartSeal}>
              <Text style={styles.heartIcon}>❤</Text>
            </View>
          </Animated.View>

        </Animated.View>
      </Pressable>

      {/* L'étagère Principale (Disque) */}
      <View style={styles.shelfTop} />
      <View style={styles.shelfFront}>
        <View style={styles.plaqueContainer}>
          <HexPlaque label="PRIERE AUDIO" onPress={() => onVinylPlaquePress && onVinylPlaquePress()} width={160} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 50,
  },
  wall: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    zIndex: 2,
  },
  instructionText: {
    position: 'absolute',
    top: (height / 2) - 200,
    color: '#F7CAD0', // Rose clair lisible sur le mur velours bordeaux
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 1,
    opacity: 0.8,
    alignSelf: 'center',
  },
  shelfTop: {
    position: 'absolute',
    top: (height / 2) + 230, // Ajusté pour s'aligner avec la pochette (descendue de 50px)
    width: 320,
    height: 15,
    backgroundColor: '#520A14', // Bois/Velours rouge sombre
    borderTopWidth: 1,
    borderTopColor: '#6E0E1B', // Reflet rouge plus clair
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  shelfFront: {
    position: 'absolute',
    top: (height / 2) + 245, // 230 + 15
    width: 320,
    height: 35,
    backgroundColor: '#2E040A', // Tranche très sombre (presque noire)
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
  },
  topShelfTop: {
    position: 'absolute',
    top: (height / 2) - 140, // Descendue un peu plus
    width: 180,
    height: 15,
    backgroundColor: '#520A14',
    borderTopWidth: 1,
    borderTopColor: '#6E0E1B',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  topShelfFront: {
    position: 'absolute',
    top: (height / 2) - 125, // -140 + 15
    width: 180,
    height: 35,
    backgroundColor: '#2E040A',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  boxClickArea: {
    position: 'absolute',
    top: (height / 2) - 200, // Position on the top shelf
    width: 90,
    height: 60,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  boxBase: {
    width: 90,
    height: 45,
    backgroundColor: '#F8E3E5', // Rose Blush doux
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#E8D0D4',
    // Ombre interne / Épaisseur en bas comme pour le vinyle
    borderBottomWidth: 3,
    borderBottomColor: '#DCAFB6', // Ombre rosée plus foncée
    zIndex: 2, // Devant les cartes quand elles sortent
  },
  boxLid: {
    position: 'absolute',
    top: 0,
    width: 94,
    height: 20,
    backgroundColor: '#F8E3E5', // Rose Blush doux
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#E8D0D4',
    zIndex: 3, // Au dessus de la base
  },
  laceBorder: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 2,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.6)', // Or
    borderStyle: 'dashed', // Effet dentelle
    borderRadius: 2,
  },
  heartSeal: {
    position: 'absolute',
    bottom: -8, // Dépasse sur la base
    width: 20,
    height: 20,
    backgroundColor: '#4A1525', // Velours bordeaux
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  heartIcon: {
    color: '#D4AF37',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 12,
    marginTop: 2,
  },
  labelContainer: {
    backgroundColor: '#F8E3E5', // Rose Blush doux
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: '#D4AF37',
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  boxText: {
    fontSize: 12,
    color: '#5C2A33', // Bordeaux profond
    fontFamily: 'PinyonScript_400Regular',
    textAlign: 'center',
  },
  plaqueContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  }
});
