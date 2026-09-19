import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, SafeAreaView, Pressable, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  cancelAnimation,
  Easing,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';

import ShelfScene from './components/ShelfScene';
import TurntableScene, { TurntableArmScene } from './components/TurntableScene';
import VinylRecord from './components/VinylRecord';
import PlayerOverlay from './components/PlayerOverlay';
import YarnHeart from './components/YarnHeart';
import WallPattern from './components/WallPattern';
import { useVinylAudio } from './hooks/useVinylAudio';

const { height, width } = Dimensions.get('window');

export default function App() {
  const [animationStep, setAnimationStep] = useState(-1);
  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hook audio optimisé
  const {
    isPlaying,
    isBuffering,
    isFinished,
    play,
    pause,
    progress,
    formattedCurrentTime,
    formattedDuration,
  } = useVinylAudio();

  // On centre le vinyle et la pochette légèrement au-dessus du milieu de l'écran
  const INITIAL_Y = (height / 2) - 160;

  // 🎯 Position personnalisable du vinyle lorsqu'il est sur la platine
  const TURNTABLE_VINYL_X = -29; // Modifie cette valeur pour décaler horizontalement
  const TURNTABLE_VINYL_Y_OFFSET = 1.5; // Modifie cette valeur pour décaler verticalement (+ vers le bas, - vers le haut)

  // Valeurs partagées pour la nouvelle chorégraphie
  const vinylScale = useSharedValue(1);
  const vinylZIndex = useSharedValue(10); // Le vinyle démarre au-dessus de tout
  const vinylX = useSharedValue(60); // Décalage de 60px pour être semi-sorti
  const shelfOpacity = useSharedValue(1);
  const shelfX = useSharedValue(0); // Mouvement de travelling
  const turntableOpacity = useSharedValue(0);
  const floorY = useSharedValue(0); // On commence à 0 (le top sera à 100%)
  const globalScale = useSharedValue(4.5); // Zoom global suffisant pour cacher les bords
  const globalTranslateY = useSharedValue(180); // Pour recentrer la pochette (40 * 4.5 = 180)

  // Position initiale du vinyle (centré pile derrière la pochette)
  const vinylY = useSharedValue(INITIAL_Y);
  const vinylRotation = useSharedValue(0);
  const vinylRotateX = useSharedValue(0); // Bascule 3D
  const armRotation = useSharedValue(15); // Repos: légèrement incliné vers la gauche
  const armLift = useSharedValue(0);

  // Nettoyage du timer à la destruction
  useEffect(() => {
    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, []);

  // Gestion de la fin naturelle de l'audio : arrêt vinyle et relèvement du bras
  useEffect(() => {
    if (isFinished && animationStep === 4) {
      cancelAnimation(vinylRotation);
      armRotation.value = withTiming(15, { duration: 800, easing: Easing.inOut(Easing.quad) });
    }
  }, [isFinished, animationStep]);

  // Transition automatique de l'écran de chargement (-1) à l'étagère (0)
  useEffect(() => {
    if (animationStep === -1) {
      // L'animation du coeur prend environ 3.5s (500ms délai + 3000ms tracé)
      const timer = setTimeout(() => {
        goToStep(0);
      }, 3800);
      return () => clearTimeout(timer);
    }
  }, [animationStep]);

  const goToStep = (targetStep: number) => {
    if (playTimerRef.current) {
      clearTimeout(playTimerRef.current);
      playTimerRef.current = null;
    }
    cancelAnimation(vinylRotation);

    const platterCenterY = height / 2;

    switch (targetStep) {
      case -1:
        pause();
        shelfOpacity.value = withTiming(1, { duration: 300 });
        shelfX.value = withTiming(0, { duration: 300 });
        vinylX.value = withTiming(60, { duration: 300 });
        vinylY.value = withTiming(INITIAL_Y, { duration: 300 });
        vinylScale.value = withTiming(1, { duration: 300 });
        vinylRotation.value = withTiming(0, { duration: 300 });
        vinylRotateX.value = withTiming(0, { duration: 300 });
        vinylZIndex.value = 10;
        floorY.value = withTiming(0, { duration: 300 });
        turntableOpacity.value = withTiming(0, { duration: 300 });
        armRotation.value = withTiming(15, { duration: 300 });
        armLift.value = withTiming(0, { duration: 300 });
        globalScale.value = withTiming(4.5, { duration: 300 }); // Repasse en plein écran
        globalTranslateY.value = withTiming(180, { duration: 300 });
        setAnimationStep(-1);
        break;

      case 0:
        pause();
        shelfOpacity.value = withTiming(1, { duration: 300 });
        shelfX.value = withTiming(0, { duration: 300 });
        vinylX.value = withTiming(60, { duration: 300 });
        vinylY.value = withTiming(INITIAL_Y, { duration: 300 });
        vinylScale.value = withTiming(1, { duration: 300 });
        vinylRotation.value = withTiming(0, { duration: 300 });
        vinylRotateX.value = withTiming(0, { duration: 300 });
        vinylZIndex.value = 10;
        floorY.value = withTiming(0, { duration: 300 });
        turntableOpacity.value = withTiming(0, { duration: 300 });
        armRotation.value = withTiming(15, { duration: 300 });
        armLift.value = withTiming(0, { duration: 300 });
        // C'est ici qu'on fait le dézoom majestueux DE TOUTE LA PIÈCE
        globalScale.value = withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.cubic) });
        globalTranslateY.value = withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.cubic) });
        setAnimationStep(0);
        break;

      case 1:
        pause();
        shelfOpacity.value = withTiming(1, { duration: 300 });
        shelfX.value = withTiming(-width, { duration: 300 });
        vinylX.value = withTiming(0, { duration: 300 });
        vinylY.value = withTiming(INITIAL_Y, { duration: 300 });
        vinylScale.value = withTiming(1, { duration: 300 });
        vinylRotation.value = withTiming(360, { duration: 300 });
        vinylRotateX.value = withTiming(0, { duration: 300 });
        vinylZIndex.value = 10;
        floorY.value = withTiming(0, { duration: 300 });
        turntableOpacity.value = withTiming(0, { duration: 300 });
        armRotation.value = withTiming(15, { duration: 300 });
        armLift.value = withTiming(0, { duration: 300 });
        globalScale.value = withTiming(1, { duration: 300 });
        globalTranslateY.value = withTiming(0, { duration: 300 });
        setAnimationStep(1);
        break;

      case 2:
        pause();
        shelfOpacity.value = withTiming(1, { duration: 300 });
        shelfX.value = withTiming(-width, { duration: 300 });
        vinylX.value = withTiming(0, { duration: 300 });
        vinylY.value = withTiming(INITIAL_Y, { duration: 300 });
        vinylScale.value = withTiming(1, { duration: 300 });
        vinylRotation.value = withTiming(360, { duration: 300 });
        vinylRotateX.value = withTiming(88.5, { duration: 300 });
        vinylZIndex.value = 10;
        floorY.value = withTiming(0, { duration: 300 });
        turntableOpacity.value = withTiming(0, { duration: 300 });
        armRotation.value = withTiming(15, { duration: 300 });
        armLift.value = withTiming(0, { duration: 300 });
        globalScale.value = withTiming(1, { duration: 300 });
        globalTranslateY.value = withTiming(0, { duration: 300 });
        setAnimationStep(2);
        break;

      case 3:
        pause();
        shelfOpacity.value = withTiming(1, { duration: 300 });
        shelfX.value = withTiming(-width, { duration: 300 });
        vinylX.value = withTiming(TURNTABLE_VINYL_X, { duration: 300 });
        vinylY.value = withTiming(platterCenterY - 120 + TURNTABLE_VINYL_Y_OFFSET, { duration: 300 });
        vinylScale.value = withTiming(3, { duration: 300 });
        vinylRotation.value = withTiming(360, { duration: 300 });
        vinylRotateX.value = withTiming(0, { duration: 300 });
        vinylZIndex.value = 10;
        floorY.value = withTiming(-height, { duration: 300 });
        turntableOpacity.value = withTiming(1, { duration: 300 });
        armRotation.value = withTiming(15, { duration: 300 });
        armLift.value = withTiming(0, { duration: 300 });
        globalScale.value = withTiming(1, { duration: 300 });
        globalTranslateY.value = withTiming(0, { duration: 300 });
        setAnimationStep(3);
        break;

      case 4:
        shelfOpacity.value = withTiming(1, { duration: 300 });
        shelfX.value = withTiming(-width, { duration: 300 });
        vinylX.value = withTiming(TURNTABLE_VINYL_X, { duration: 300 });
        vinylY.value = withTiming(platterCenterY - 120 + TURNTABLE_VINYL_Y_OFFSET, { duration: 300 });
        vinylScale.value = withTiming(1, { duration: 300 });
        vinylRotateX.value = withTiming(0, { duration: 300 });
        vinylZIndex.value = 5;
        floorY.value = withTiming(-height, { duration: 300 });
        turntableOpacity.value = withTiming(1, { duration: 300 });
        armRotation.value = withTiming(38, { duration: 300 });
        armLift.value = withTiming(0, { duration: 300 });
        globalScale.value = withTiming(1, { duration: 300 });
        globalTranslateY.value = withTiming(0, { duration: 300 });
        vinylRotation.value = withRepeat(
          withTiming(720, { duration: 3000, easing: Easing.linear }),
          -1,
          false
        );
        play();
        setAnimationStep(4);
        break;
    }
  };

  const handlePress = () => {
    // Nouvelle position du plateau en vue de dessus pur (sans rotateX: 65deg)
    // turntableBase height = 380, centrée. Top de la base = height/2 - 190.
    // platter center = 30 (top) + 140 (half height) = 170 depuis le top de la base.
    // Donc platterCenterY    // Le centre du plateau dans l'espace de la page (le plateau est maintenant parfaitement centré verticalement dans la valise)
    const platterCenterY = height / 2;

    switch (animationStep) {
      case -1:
        // Clic pendant l'écran de chargement : passe directement à l'étagère
        goToStep(0);
        break;

      case 0:
        // PHASE 1 : LE TRAVELLING HORIZONTAL
        // L'étagère et la pochette glissent physiquement hors de l'écran vers la gauche
        shelfX.value = withTiming(-width, { duration: 1200, easing: Easing.inOut(Easing.quad) });
        // Le vinyle se recentre doucement au milieu de l'écran
        vinylX.value = withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.quad) });

        // Le vinyle tourne (1 tour) pendant qu'il sort de la pochette
        vinylRotation.value = withTiming(360, { duration: 1200, easing: Easing.out(Easing.quad) });

        setAnimationStep(1);
        break;

      case 1:
        // PHASE 2 : TOURNE PRESQUE À PLAT (88.5 DEG)
        // L'astuce : 90° rend le vinyle 2D invisible. 88.5° laisse une fine ligne visible (la tranche).
        vinylRotateX.value = withTiming(88.5, { duration: 1000, easing: Easing.inOut(Easing.quad) });
        setAnimationStep(2);
        break;

      case 2:
        // PHASE 3 : LA CAMÉRA PASSE AU-DESSUS
        // Le vinyle se met EXACTEMENT au-dessus du plateau (Top: platterCenterY - rayon du vinyle de 120)
        vinylY.value = withTiming(platterCenterY - 120 + TURNTABLE_VINYL_Y_OFFSET, { duration: 1200, easing: Easing.inOut(Easing.quad) });
        // On décale le vinyle horizontalement pour qu'il s'aligne sur le plateau (décalé à gauche)
        vinylX.value = withTiming(TURNTABLE_VINYL_X, { duration: 1200, easing: Easing.inOut(Easing.quad) });
        // Seul le VINYLE grossit (simulant qu'il s'approche de la caméra)
        vinylScale.value = withTiming(3, { duration: 1200, easing: Easing.inOut(Easing.quad) });
        // Le vinyle redevient plat de notre point de vue
        vinylRotateX.value = withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.quad) });

        // Le sol (Floor) monte depuis le bas pour remplacer le mur
        floorY.value = withTiming(-height, { duration: 1200, easing: Easing.inOut(Easing.quad) });

        // La platine monte en même temps que le sol
        turntableOpacity.value = 1;

        setAnimationStep(3);
        break;

      case 3:
        // PHASE 4 : LE DISQUE SE POSE
        // Le vinyle rétrécit pour atterrir sur le lecteur (le lecteur ne bouge pas)
        vinylScale.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.quad) });

        // Le vinyle passe "physiquement" sous le bras de lecture juste avant l'atterrissage
        vinylZIndex.value = withDelay(800, withTiming(5, { duration: 0 }));

        // BRAS DE LECTURE & ROTATION
        armRotation.value = withDelay(1200, withTiming(38, { duration: 800, easing: Easing.out(Easing.quad) }));
        // Reprise de la rotation pour la lecture audio (de 360 à 720 = 1 tour complet)
        vinylRotation.value = withDelay(2000, withRepeat(
          withTiming(720, { duration: 3000, easing: Easing.linear }),
          -1,
          false
        ));

        // Démarrage automatique de l'audio à l'atterrissage du bras (à 2000ms)
        playTimerRef.current = setTimeout(() => {
          play();
        }, 2000);

        setAnimationStep(4);
        break;

      case 4:
        // PHASE 4 ACTIVE : MISE EN PAUSE / REPRISE DE LA LECTURE
        if (isPlaying) {
          // 1. Pause de l'audio
          pause();
          // 2. Le bras reste sur le disque, on anime juste un effet de levage
          armLift.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) });
          // 3. Le vinyle s'arrête de tourner
          cancelAnimation(vinylRotation);
        } else {
          // 1. Le bras se repose
          armLift.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.quad) });
          // 2. Le vinyle reprend sa rotation depuis son angle actuel
          const currentAngle = vinylRotation.value % 360;
          vinylRotation.value = currentAngle;
          vinylRotation.value = withRepeat(
            withTiming(currentAngle + 360, { duration: 3000, easing: Easing.linear }),
            -1,
            false
          );
          // 3. Reprise du son immédiate
          play();
        }
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

  const animatedTurntableStyle = useAnimatedStyle(() => {
    const rotateX = interpolate(
      floorY.value,
      [0, -height],
      [65, 0], // Start tilted at 65 degrees, end flat at 0 degrees
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      floorY.value,
      [0, -height],
      [0.75, 1], // Start slightly smaller (zoomed out) and grow to normal size
      Extrapolation.CLAMP
    );

    return {
      opacity: turntableOpacity.value,
      transform: [
        { translateY: height + floorY.value },
        { perspective: 1000 },
        { rotateX: `${rotateX}deg` },
        { scale: scale }
      ],
    };
  });

  const animatedFloorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: floorY.value }],
    };
  });

  const animatedGlobalStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: globalTranslateY.value },
        { scale: globalScale.value }
      ],
    };
  });

  const animatedWallPerspectiveStyle = useAnimatedStyle(() => {
    const rotateX = interpolate(
      floorY.value,
      [0, -height],
      [0, -65],
      Extrapolation.CLAMP
    );
    return {
      transform: [
        { perspective: 1000 },
        { rotateX: `${rotateX}deg` }
      ],
    };
  });

  const animatedWallScrollStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: shelfX.value }, // Mouvement synchronisé avec l'étagère
      ],
    };
  });

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

      {/* SÉLECTEUR DE NAVIGATION DEBUG (caché en étape -1) */}
      {animationStep !== -1 && (
        <View style={styles.debugBarContainer}>
          <View style={styles.debugBar}>
            <Text style={styles.debugTitle}>DEBUG</Text>
            <View style={styles.debugPills}>
              {[
                { step: -1, label: '-1: Intro' },
                { step: 0, label: '0: Étagère' },
                { step: 1, label: '1: Sorti' },
                { step: 2, label: '2: Tranche' },
                { step: 3, label: '3: Zoom' },
                { step: 4, label: '4: Platine' },
              ].map((item) => (
                <Pressable
                  key={item.step}
                  onPress={() => goToStep(item.step)}
                  style={[
                    styles.debugPill,
                    animationStep === item.step && styles.debugPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.debugPillText,
                      animationStep === item.step && styles.debugPillTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      )}

      <Pressable style={styles.fullScreenTouch} onPress={handlePress}>
        <View style={styles.fullScreenTouch} pointerEvents="none">
          {/* CAMERA GLOBALE POUR LE ZOOM INTRODUCTIF */}
          <Animated.View style={[styles.fullScreenTouch, animatedGlobalStyle]} pointerEvents="none">
            {/* COUCHE 0 : LE MUR AU FOND (Papier peint qui bascule) */}
            <Animated.View style={[styles.wallPerspectiveWrapper, animatedWallPerspectiveStyle]} pointerEvents="none">
              <Animated.View style={[styles.wallScrollingContent, animatedWallScrollStyle]}>
                <WallPattern />
              </Animated.View>
            </Animated.View>

          {/* COUCHE 1 : DÉCOR ARRIÈRE (Étagère) */}
          <Animated.View style={[styles.layer, animatedShelfStyle]}>
            <ShelfScene />
          </Animated.View>

          {/* COUCHE 1.2 : LE SOL ET LA TABLE (Qui montent ensemble) */}
          <Animated.View style={[styles.floorLayer, animatedFloorStyle]} pointerEvents="none">
            {/* La table plate 2D, ancrée en haut du sol */}
            <View style={styles.flatTable} />
          </Animated.View>

          {/* COUCHE 1.5 : DÉCOR ARRIÈRE (Platine) */}
          <Animated.View style={[styles.layer, animatedTurntableStyle, { zIndex: 3 }]} pointerEvents="none">
            <TurntableScene isPlaying={isPlaying} />
          </Animated.View>

          {/* COUCHE 2 : L'ACTEUR PRINCIPAL (Le Vinyle) */}
          <Animated.View style={[styles.vinylLayer, animatedVinylStyle]} pointerEvents="none">
            <VinylRecord size={240} />
          </Animated.View>

          {/* COUCHE 2.5 : LE BRAS DE LA PLATINE (Au-dessus du vinyle une fois posé) */}
          <Animated.View style={[styles.layer, animatedTurntableStyle, { zIndex: 6 }]} pointerEvents="none">
            <TurntableArmScene armRotation={armRotation} armLift={armLift} />
          </Animated.View>

            {/* COUCHE 3 : DÉCOR AVANT (La Pochette) */}
            <Animated.View style={[styles.layer, animatedShelfStyle, { zIndex: 20 }]} pointerEvents="box-none">
              <View style={styles.sleeveFront}>
                {/* Le coeur en fil de laine rouge - plus petit pour compenser le gros zoom */}
              <YarnHeart size={90} />
              </View>
            </Animated.View>
          </Animated.View>
        </View>
      </Pressable>

      {/* OVERLAY LECTEUR AUDIO (Étape 4) */}
      {animationStep === 4 && (
        <PlayerOverlay
          isPlaying={isPlaying}
          progress={progress}
          formattedCurrentTime={formattedCurrentTime}
          formattedDuration={formattedDuration}
          isBuffering={isBuffering}
        />
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E1119', // Fond nuit étoilée sombre
    overflow: 'hidden',
  },
  fullScreenTouch: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  layer: {
    position: 'absolute',
    width: '100%',
    height: height,
    zIndex: 1,
  },
  wallPerspectiveWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width, // Fixé à l'écran pour garder le point de fuite central
    height: height,
    zIndex: 0,
  },
  wallScrollingContent: {
    position: 'absolute',
    top: -height,
    left: -width,
    width: width * 3,
    height: height * 3,
  },
  floorLayer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#150A0F', // Le vrai sol sombre
    zIndex: 2, // Sous la platine
    alignItems: 'center', // Centre la table horizontalement
  },
  flatTable: {
    position: 'absolute',
    top: 0, // Collé parfaitement à la ligne d'horizon !
    width: 600, // Largeur du bureau
    height: height - 300, // S'arrête avant le bas de l'écran pour voir le sol
    backgroundColor: '#6B4226', // Bois
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 40 },
    shadowOpacity: 0.5,
    shadowRadius: 50,
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
  debugBarContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  debugBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(25, 18, 22, 0.88)',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    gap: 6,
  },
  debugTitle: {
    color: '#D4AF37',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    paddingHorizontal: 6,
  },
  debugPills: {
    flexDirection: 'row',
    gap: 4,
  },
  debugPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  debugPillActive: {
    backgroundColor: '#D4AF37',
  },
  debugPillText: {
    color: '#D8C8B8',
    fontSize: 11,
    fontWeight: '600',
  },
  debugPillTextActive: {
    color: '#1a1016',
    fontWeight: '700',
  },
});
