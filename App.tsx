import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, SafeAreaView, Pressable, Text, View, Image } from 'react-native';
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
import WallPattern from './components/WallPattern';
import { useVinylAudio } from './hooks/useVinylAudio';
import { useFonts, PinyonScript_400Regular } from '@expo-google-fonts/pinyon-script';

const { height, width } = Dimensions.get('window');

export default function App() {
  const [fontsLoaded] = useFonts({
    PinyonScript_400Regular,
  });

  const [animationStep, setAnimationStep] = useState(-1);
  const [isCardsModalOpen, setIsCardsModalOpen] = useState(false);
  const [isLidOpen, setIsLidOpen] = useState(false);
  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blockNextPress = useRef(false);

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
    seekToRatio,
  } = useVinylAudio();

  // On centre le vinyle et la pochette légèrement au-dessus du milieu de l'écran
  const INITIAL_Y = (height / 2) - 10;

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

  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(10);

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
      // Lance l'apparition du texte juste avant la fin du dessin du coeur (à 3s)
      textOpacity.value = withDelay(3000, withTiming(1, { duration: 1500, easing: Easing.out(Easing.ease) }));
      textTranslateY.value = withDelay(3000, withTiming(0, { duration: 1500, easing: Easing.out(Easing.ease) }));

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
        textOpacity.value = withTiming(0, { duration: 300 });
        textTranslateY.value = withTiming(10, { duration: 300 });
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
        globalTranslateY.value = withTiming(0, { duration: 300 }); // Laisse la table basse
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
        globalTranslateY.value = withTiming(0, { duration: 300 }); // Laisse la table basse
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
    if (blockNextPress.current) return;
    if (isCardsModalOpen || isLidOpen) return;

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
        // On ne remonte plus la caméra globale (0), ce qui laisse la table bien basse pour voir le mur
        globalTranslateY.value = withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.quad) });

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

  const handleBoxPress = () => {
    blockNextPress.current = true;
    setTimeout(() => { blockNextPress.current = false; }, 200);

    // 1. Zoom sur la boite, mais en la plaçant en BAS de l'écran
    // La boite est à -200 du centre. Pour la mettre en bas (ex: +150 du centre avant scale),
    // on doit translater d'environ +350. (150 * 2.5 = 375, proche du bas de l'écran).
    globalScale.value = withTiming(2.5, { duration: 1000, easing: Easing.inOut(Easing.cubic) });
    globalTranslateY.value = withTiming(600, { duration: 1000, easing: Easing.inOut(Easing.cubic) });

    // 2. Ouvrir le couvercle après le zoom
    setTimeout(() => {
      setIsLidOpen(true);

      // 3. Afficher les cartes après l'ouverture
      setTimeout(() => {
        setIsCardsModalOpen(true);
      }, 600);
    }, 1000);
  };

  const handleCloseCards = () => {
    setIsCardsModalOpen(false);
    setIsLidOpen(false);

    if (animationStep === 0) {
      globalScale.value = withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.cubic) });
      globalTranslateY.value = withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.cubic) });
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
    const translatedFloor = interpolate(
      floorY.value,
      [0, -height],
      [0, -height + 150], // Le sol s'arrête 150px avant le haut
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateY: translatedFloor }],
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

  const animatedHeartStyle = useAnimatedStyle(() => {
    // Effet "Dolly Zoom" (Vertigo) : le coeur compense le zoom global
    // À globalScale = 1 (sur l'étagère), le coeur est à taille normale (1)
    // À globalScale = 4.5 (intro), le coeur est réduit (0.64) pour ne pas être trop gros à l'écran
    const heartScale = interpolate(
      globalScale.value,
      [1, 4.5],
      [1, 0.64],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ scale: heartScale }]
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

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      transform: [{ translateY: textTranslateY.value }],
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

  if (!fontsLoaded) {
    return null; // Affiche un écran vide en attendant le chargement de la typo
  }

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

      {/* SCÈNE PRINCIPALE UNIQUE */}
      <View style={styles.fullScreenTouch} pointerEvents="box-none">
        <View style={styles.fullScreenTouch} pointerEvents="box-none">
          {/* CAMERA GLOBALE POUR LE ZOOM INTRODUCTIF */}
          <Animated.View style={[styles.fullScreenTouch, animatedGlobalStyle]} pointerEvents="box-none">
            {/* COUCHE 0 : LE MUR AU FOND (Papier peint qui bascule) */}
            <Animated.View style={[styles.wallPerspectiveWrapper, animatedWallPerspectiveStyle]} pointerEvents="none">
              <Animated.View style={[styles.wallScrollingContent, animatedWallScrollStyle]}>
                <WallPattern />
              </Animated.View>
            </Animated.View>

            {/* COUCHE 1 : DÉCOR ARRIÈRE (Étagères) */}
            <Animated.View style={[styles.layer, animatedShelfStyle]} pointerEvents="box-none">
              <ShelfScene onBoxPress={handleBoxPress} isLidOpen={isLidOpen} />
            </Animated.View>

            {/* COUCHE 1.2 : LE SOL ET LA TABLE (Qui montent ensemble) */}
            <Animated.View style={[styles.floorLayer, animatedFloorStyle]} pointerEvents="none">
              {/* La table plate 2D, ancrée en haut du sol */}
              <View style={[styles.flatTable, { overflow: 'hidden' }]}>
                <Image source={require('./assets/marble.jpg')} style={StyleSheet.absoluteFill} resizeMode="cover" />
              </View>
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
                {/* Cadre intérieur délicat (style carte d'invitation de luxe) */}
                <View style={styles.sleeveInnerFrame} />

                {/* Le texte central compensant le dézoom global */}
                <Animated.View style={[animatedHeartStyle, styles.sleeveGraphic]}>
                  <Animated.Text style={[styles.sleeveTopText, animatedTextStyle]}>
                    A gift for you
                  </Animated.Text>
                  <Animated.Text style={[styles.sleeveTitle, animatedTextStyle]}>
                    My Prayer{'\n'}for your heart
                  </Animated.Text>
                  <Animated.Text style={[styles.sleeveSubtitle, animatedTextStyle]}>
                    Anaïs's 20th
                  </Animated.Text>
                </Animated.View>
              </View>
            </Animated.View>
          </Animated.View>
        </View>
      </View>

      {/* OVERLAY LECTEUR AUDIO (Étape 4) */}
      {animationStep === 4 && (
        <PlayerOverlay
          isPlaying={isPlaying}
          progress={progress}
          formattedCurrentTime={formattedCurrentTime}
          formattedDuration={formattedDuration}
          isBuffering={isBuffering}
          onPlayPausePress={handlePress}
          onSeekRatio={seekToRatio}
        />
      )}

      {/* BOUTON FERMER LES CARTES */}
      {isCardsModalOpen && (
        <View style={styles.closeCardsContainer}>
          <Pressable style={styles.closeCardsBtn} onPress={handleCloseCards}>
            <Text style={styles.closeCardsText}>✕ Ranger</Text>
          </Pressable>
        </View>
      )}

      {/* BOUTONS D'ACTIONS (Étagère Principale) */}
      {animationStep === 0 && !isLidOpen && !isCardsModalOpen && (
        <View style={styles.actionButtonsRow}>
          <Pressable style={styles.primaryBtn} onPress={handleBoxPress}>
            <Text style={styles.primaryBtnText}>Ouvrir la Boîte 💌</Text>
          </Pressable>
          <Pressable style={styles.primaryBtn} onPress={handlePress}>
            <Text style={styles.primaryBtnText}>Écouter le Vinyle 🎵</Text>
          </Pressable>
        </View>
      )}

      {/* BOUTON SUIVANT POUR L'ANIMATION DU VINYLE */}
      {(animationStep === -1 || (animationStep > 0 && animationStep < 4)) && !isLidOpen && !isCardsModalOpen && (
        <View style={styles.nextButtonContainer}>
          <Pressable style={styles.nextButton} onPress={handlePress}>
            <Text style={styles.nextButtonText}>
              {animationStep === -1 ? 'Commencer 🤍' : 'Continuer 🎵'}
            </Text>
          </Pressable>
        </View>
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
    backgroundColor: '#FCFAFA', // Marbre Blanc
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
    top: (height / 2) - 10,
    alignSelf: 'center',
    width: 240,
    height: 240,
    backgroundColor: '#F8E3E5', // Rose Blush très doux et élégant
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    // Ombre interne / Épaisseur en bas pour simuler l'inclinaison (le bas repose, le haut est penché)
    borderBottomWidth: 4,
    borderBottomColor: '#E8D0D4', // Un blush légèrement ombré
    // Ombre de la pochette sur l'étagère
    shadowColor: '#4A252A', // Ombre légèrement teintée pour plus de chaleur
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 10,
    overflow: 'hidden',
  },
  shelfPlank: {
    position: 'absolute',
    top: (height / 2) + 230,
    width: width,
    height: 20,
    backgroundColor: '#2A0812',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 15,
  },
  sleeveRingWear: {
    position: 'absolute',
    width: 232,
    height: 232,
    borderRadius: 116,
    borderWidth: 1,
    borderColor: 'rgba(92, 42, 51, 0.05)', // Empreinte circulaire bordeaux très subtile
  },
  sleeveInnerFrame: {
    position: 'absolute',
    top: 12,
    bottom: 12,
    left: 12,
    right: 12,
    borderWidth: 1,
    borderColor: 'rgba(92, 42, 51, 0.15)', // Ligne bordeaux très fine et subtile
  },
  sleeveGraphic: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  sleeveTopText: {
    position: 'absolute',
    top: -40, // Symétrie parfaite avec le texte du bas
    fontSize: 9,
    color: '#9E6C75', // Bordeaux adouci (rose poudré sombre)
    letterSpacing: 3,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  sleeveTitle: {
    fontFamily: 'PinyonScript_400Regular',
    fontSize: 38, // Légèrement plus petit pour plus de délicatesse
    color: '#5C2A33', // Bordeaux profond et romantique (classy)
    textAlign: 'center',
    lineHeight: 40,
  },
  sleeveSubtitle: {
    position: 'absolute',
    bottom: -40, // Symétrie parfaite avec le texte du haut
    fontSize: 9,
    color: '#9E6C75',
    letterSpacing: 3,
    textTransform: 'uppercase',
    textAlign: 'center',
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
  closeCardsContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    zIndex: 10000,
  },
  closeCardsBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(253, 251, 247, 0.15)',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  closeCardsText: {
    color: '#FDFBF7',
    fontFamily: 'PinyonScript_400Regular',
    fontSize: 22,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  actionButtonsRow: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 20,
    zIndex: 100,
  },
  primaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(253, 251, 247, 0.2)',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    backdropFilter: 'blur(4px)',
  },
  primaryBtnText: {
    color: '#FDFBF7',
    fontFamily: 'PinyonScript_400Regular',
    fontSize: 22,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    zIndex: 100,
  },
  nextButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(253, 251, 247, 0.2)',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    backdropFilter: 'blur(4px)',
  },
  nextButtonText: {
    color: '#FDFBF7',
    fontFamily: 'PinyonScript_400Regular',
    fontSize: 24,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
