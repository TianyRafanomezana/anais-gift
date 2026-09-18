import React, { useState } from 'react';
import { StyleSheet, Dimensions, SafeAreaView, Pressable, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  withRepeat,
  Easing 
} from 'react-native-reanimated';

import ShelfScene from './components/ShelfScene';
import TurntableScene, { TurntableArmScene } from './components/TurntableScene';
import VinylRecord from './components/VinylRecord';

const { height, width } = Dimensions.get('window');

export default function App() {
  const [animationStep, setAnimationStep] = useState(0);

  // On centre le vinyle et la pochette légèrement au-dessus du milieu de l'écran
  const INITIAL_Y = (height / 2) - 160; 

  // Valeurs partagées pour la nouvelle chorégraphie
  const vinylScale = useSharedValue(1);
  const vinylZIndex = useSharedValue(10); // Le vinyle démarre au-dessus de tout
  const vinylX = useSharedValue(60); // Décalage de 60px pour être semi-sorti
  const shelfOpacity = useSharedValue(1);
  const shelfX = useSharedValue(0); // Mouvement de travelling
  const turntableOpacity = useSharedValue(0);
  
  // Position initiale du vinyle (centré pile derrière la pochette)
  const vinylY = useSharedValue(INITIAL_Y); 
  const vinylRotation = useSharedValue(0);
  const vinylRotateX = useSharedValue(0); // Bascule 3D
  const armRotation = useSharedValue(0);

  const handlePress = () => {
    // Nouvelle position du plateau en vue de dessus pur (sans rotateX: 65deg)
    // turntableBase height = 380, centrée. Top de la base = height/2 - 190.
    // platter center = 30 (top) + 140 (half height) = 170 depuis le top de la base.
    // Donc platterCenterY = (height/2 - 190) + 170 = height/2 - 20.
    const platterCenterY = (height / 2) - 20;

    switch (animationStep) {
      case 0:
        // PHASE 1 : LE TRAVELLING HORIZONTAL
        // L'étagère et la pochette glissent physiquement hors de l'écran vers la gauche
        shelfX.value = withTiming(-width, { duration: 1200, easing: Easing.inOut(Easing.quad) });
        // Le vinyle, lui, ne bouge pas. Visuellement, il est "extrait" par la droite !
        setAnimationStep(1);
        break;

      case 1:
        // PHASE 2 : TOURNE À 90 DEG
        vinylRotateX.value = withTiming(90, { duration: 1000, easing: Easing.inOut(Easing.quad) });
        setAnimationStep(2);
        break;

      case 2:
        // PHASE 3 : LA CAMÉRA PASSE AU-DESSUS
        // Le vinyle se met EXACTEMENT au-dessus du plateau (Top: platterCenterY - rayon du vinyle de 120)
        vinylY.value = withTiming(platterCenterY - 120, { duration: 1200, easing: Easing.inOut(Easing.quad) });
        // On recentre le vinyle horizontalement sur le plateau
        vinylX.value = withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.quad) });
        // Seul le VINYLE grossit (simulant qu'il s'approche de la caméra)
        vinylScale.value = withTiming(3, { duration: 1200, easing: Easing.inOut(Easing.quad) });
        // Le vinyle redevient plat de notre point de vue
        vinylRotateX.value = withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.quad) });
        
        // Le lecteur (qui est fixe) apparaît en fond
        turntableOpacity.value = withDelay(1000, withTiming(1, { duration: 200 }));
        
        setAnimationStep(3);
        break;

      case 3:
        // PHASE 4 : LE DISQUE SE POSE
        // Le vinyle rétrécit pour atterrir sur le lecteur (le lecteur ne bouge pas)
        vinylScale.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.quad) });

        // Le vinyle passe "physiquement" sous le bras de lecture juste avant l'atterrissage
        vinylZIndex.value = withDelay(800, withTiming(5, { duration: 0 }));

        // BRAS DE LECTURE & ROTATION
        armRotation.value = withDelay(1200, withTiming(25, { duration: 800, easing: Easing.out(Easing.quad) }));
        vinylRotation.value = withDelay(2000, withRepeat(
          withTiming(360, { duration: 3000, easing: Easing.linear }), 
          -1, 
          false
        ));
        
        setAnimationStep(4);
        break;
        
      default:
        break;
    }
  };

  // Styles animés
  const animatedShelfStyle = useAnimatedStyle(() => ({
    opacity: shelfOpacity.value,
    transform: [{ translateX: shelfX.value }]
  }));

  const animatedTurntableStyle = useAnimatedStyle(() => ({
    opacity: turntableOpacity.value,
  }));

  const animatedVinylStyle = useAnimatedStyle(() => ({
    zIndex: vinylZIndex.value,
    transform: [
      { translateX: vinylX.value },
      { translateY: vinylY.value },
      { perspective: 1000 },
      { rotateX: `${vinylRotateX.value}deg` },
      { rotate: `${vinylRotation.value}deg` },
      { scale: vinylScale.value }
    ],
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      
      <Pressable style={styles.fullScreenTouch} onPress={handlePress}>
        <View style={styles.fullScreenTouch} pointerEvents="none">
          {/* COUCHE 1 : DÉCOR ARRIÈRE (Étagère) */}
          <Animated.View style={[styles.layer, animatedShelfStyle]}>
            <ShelfScene />
          </Animated.View>

          {/* COUCHE 1.5 : DÉCOR ARRIÈRE (Platine) */}
          <Animated.View style={[styles.layer, animatedTurntableStyle]} pointerEvents="none">
            <TurntableScene />
          </Animated.View>

          {/* COUCHE 2 : L'ACTEUR PRINCIPAL (Le Vinyle) */}
          <Animated.View style={[styles.vinylLayer, animatedVinylStyle]} pointerEvents="none">
            <VinylRecord size={240} />
          </Animated.View>

          {/* COUCHE 2.5 : LE BRAS DE LA PLATINE (Au-dessus du vinyle une fois posé) */}
          <Animated.View style={[styles.layer, animatedTurntableStyle, { zIndex: 6 }]} pointerEvents="none">
            <TurntableArmScene armRotation={armRotation} />
          </Animated.View>

          {/* COUCHE 3 : DÉCOR AVANT (La Pochette) */}
          <Animated.View style={[styles.layer, animatedShelfStyle, { zIndex: 20 }]} pointerEvents="box-none">
            <View style={styles.sleeveFront}>
              <Text style={styles.sleeveText}>Mode Debug</Text>
              <Text style={styles.sleeveSubtext}>Étape {animationStep}/4 (Clique pour avancer)</Text>
            </View>
          </Animated.View>
        </View>
      </Pressable>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E1119', // Fond nuit étoilée sombre
  },
  fullScreenTouch: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  layer: {
    position: 'absolute',
    width: '100%',
    height: height,
    zIndex: 1,
  },
  vinylLayer: {
    position: 'absolute',
    top: 0, // La position Y est gérée par translateY via INITIAL_Y
    alignSelf: 'center',
    zIndex: 5, // Au-dessus du décor arrière, mais en-dessous de la pochette avant
  },
  sleeveFront: {
    position: 'absolute',
    // La pochette est fixée à INITIAL_Y
    top: (height / 2) - 160, 
    alignSelf: 'center',
    width: 240,
    height: 240,
    backgroundColor: '#F7CAD0', // Rose poudré satiné
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D4AF37', // Dorure fine
    zIndex: 10, // Toujours au-dessus du vinyle
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
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
  },
});
