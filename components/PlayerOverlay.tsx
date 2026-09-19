import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Image, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface PlayerOverlayProps {
  isPlaying: boolean;
  progress: number;
  formattedCurrentTime: string;
  formattedDuration: string;
  isBuffering?: boolean;
}

export const PlayerOverlay = React.memo(function PlayerOverlay({
  isPlaying,
  progress,
  formattedCurrentTime,
  formattedDuration,
  isBuffering,
}: PlayerOverlayProps) {
  const percent = Math.min(100, Math.max(0, progress * 100));

  // Animation de la lueur (shimmer)
  const shimmerAnim = useRef(new Animated.Value(-150)).current;

  // Animation d'apparition globale (délai)
  const mountAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fait apparaître les contrôles après 2 secondes (laissant le temps au vinyle de commencer)
    Animated.timing(mountAnim, {
      toValue: 1,
      duration: 800,
      delay: 2000,
      useNativeDriver: true,
    }).start();
  }, [mountAnim]);

  // État et animation de la pochette
  const [isExpanded, setIsExpanded] = useState(false);
  const expandAnim = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);
    Animated.spring(expandAnim, {
      toValue,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const coverTranslateY = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [120, -300], // Un peu plus haut en preview
  });

  const coverScale = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2], // Grossit un peu
  });

  const globalTranslateY = mountAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0], // Remonte depuis le bas
  });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const runShimmer = () => {
      shimmerAnim.setValue(-150); // Départ à gauche
      Animated.timing(shimmerAnim, {
        toValue: 500, // Traverse toute la largeur
        duration: 900,
        useNativeDriver: true,
      }).start(() => {
        // Déclenche le prochain reflet de manière aléatoire (entre 3 et 10 secondes)
        const nextDelay = Math.random() * 7000 + 3000;
        timeoutId = setTimeout(runShimmer, nextDelay);
      });
    };

    // Lance le premier reflet après un court délai aléatoire
    timeoutId = setTimeout(runShimmer, Math.random() * 2000 + 1000);

    return () => clearTimeout(timeoutId);
  }, [shimmerAnim]);

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 50 }]} pointerEvents="box-none">

      {/* Le conteneur principal gérant l'apparition différée */}
      <Animated.View
        style={[
          styles.overlay,
          { opacity: mountAnim, transform: [{ translateY: globalTranslateY }] }
        ]}
        pointerEvents="box-none"
      >

        {/* La pochette interactive (en bas, dépassant de l'écran) */}
        <Animated.View
          style={[
            styles.floatingCoverContainer,
            { transform: [{ translateY: coverTranslateY }, { scale: coverScale }] }
          ]}
        >
          <Pressable onPress={toggleExpand}>
            <View style={styles.coverArt}>
              <Image
                source={require('../assets/mini_cover.png')}
                style={styles.coverImage}
                resizeMode="cover"
              />
            </View>
          </Pressable>
        </Animated.View>

        {/* Le lecteur (Pillule dorée) positionné au-dessus de la pochette, sous le vinyle */}
        <View style={styles.cardContainer} pointerEvents="box-none">
          <View style={styles.card}>
            {/* Couche d'animation de la brillance */}
            <Animated.View
              style={[
                styles.shimmer,
                { transform: [{ translateX: shimmerAnim }, { rotate: '25deg' }] }
              ]}
            />

            <View style={styles.pillRow}>
              {/* Bouton Play à gauche */}
              <View style={styles.playPauseIcon}>
                {isPlaying ? (
                  <Svg width={20} height={20} viewBox="0 0 24 24">
                    <Path d="M8 5h2v14H8zm6 0h2v14h-2z" fill="#D4AF37" />
                  </Svg>
                ) : (
                  <Svg width={20} height={20} viewBox="0 0 24 24">
                    <Path d="M8 5v14l11-7z" fill="#D4AF37" />
                  </Svg>
                )}
              </View>

              {/* Barre de progression et temps à droite */}
              <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressBar, { width: `${percent}%` }]} />
                </View>
                <View style={styles.timeRow}>
                  <Text style={styles.timeText}>{formattedCurrentTime}</Text>
                  <Text style={styles.timeText}>{formattedDuration}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  cardContainer: {
    position: 'absolute',
    bottom: 160, // Remonté pour s'adapter à la nouvelle hauteur de la pochette
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#D4AF37',
    borderRadius: 50, // Forme de pilule géante
    paddingVertical: 8, // Très fin
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
    zIndex: 10, // Assure que la pilule est au-dessus du reste s'il y a superposition
  },
  floatingCoverContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  shimmer: {
    position: 'absolute',
    top: -50,
    bottom: -50,
    width: 120,
    backgroundColor: 'transparent',
    // @ts-ignore
    backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%)',
    zIndex: 1,
  },
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  progressContainer: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
    justifyContent: 'center',
  },
  coverArt: {
    width: 280, // Immense pochette
    height: 280,
    backgroundColor: '#FDFBF7',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  playPauseIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)', // Fond blanc un peu plus opaque
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  timeText: {
    color: 'rgba(247, 202, 208, 0.65)',
    fontSize: 11,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
});

export default PlayerOverlay;
