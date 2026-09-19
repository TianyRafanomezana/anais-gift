import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Image, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface PlayerOverlayProps {
  isPlaying: boolean;
  progress: number;
  formattedCurrentTime: string;
  formattedDuration: string;
  isBuffering?: boolean;
  onPlayPausePress?: () => void;
  onSeekRatio?: (ratio: number) => void;
}

export const PlayerOverlay = React.memo(function PlayerOverlay({
  isPlaying,
  progress,
  formattedCurrentTime,
  formattedDuration,
  isBuffering,
  onPlayPausePress,
  onSeekRatio,
}: PlayerOverlayProps) {
  const percent = Math.min(100, Math.max(0, progress * 100));

  const trackWidthRef = useRef(1);

  const handleSeek = useCallback((evt: any) => {
    if (!onSeekRatio) return;
    const clickX = evt.nativeEvent.locationX;
    const ratio = Math.max(0, Math.min(1, clickX / trackWidthRef.current));
    onSeekRatio(ratio);
  }, [onSeekRatio]);

  // Animation de la lueur (shimmer)
  const shimmerAnim = useRef(new Animated.Value(-150)).current;

  // Animation d'apparition globale (délai)
  const mountAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fait apparaître les contrôles après 2 secondes (laissant le temps au vinyle de commencer)
    Animated.timing(mountAnim, {
      toValue: 1,
      duration: 1200,
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
    outputRange: [140, -300], // Un peu plus haut en preview
  });

  const coverScale = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2], // Grossit un peu
  });

  const globalTranslateX = mountAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0], // Arrive depuis la droite
  });

  const mountTranslateY = mountAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 0], // Remonte depuis le bas
  });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const runShimmer = () => {
      shimmerAnim.setValue(-150); // Départ à gauche
      Animated.timing(shimmerAnim, {
        toValue: 500, // Traverse toute la largeur
        duration: 1800,
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
          { opacity: mountAnim }
        ]}
        pointerEvents="box-none"
      >

        {/* La pochette interactive (en bas, dépassant de l'écran) */}
        <Animated.View
          style={[
            styles.floatingCoverContainer,
            { transform: [{ translateY: mountTranslateY }, { translateY: coverTranslateY }, { scale: coverScale }] }
          ]}
          pointerEvents="box-none"
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
        <Animated.View 
          style={[styles.cardContainer, { transform: [{ translateX: globalTranslateX }] }]} 
          pointerEvents="box-none"
        >
          <View style={styles.card}>
            <View style={styles.pillRow}>
              {/* Bouton Play à gauche (Rond or, icône bordeaux) */}
              <Pressable onPress={onPlayPausePress} style={[styles.playPauseIcon, { overflow: 'hidden' }]}>
                <Animated.View
                  style={[
                    styles.shimmer,
                    { transform: [{ translateX: shimmerAnim }, { rotate: '25deg' }] }
                  ]}
                />
                {isPlaying ? (
                  <Svg width={18} height={18} viewBox="0 0 24 24">
                    <Path d="M8 5h2v14H8zm6 0h2v14h-2z" fill="#3D0C18" />
                  </Svg>
                ) : (
                  <Svg width={18} height={18} viewBox="0 0 24 24" style={{ marginLeft: 3 }}>
                    <Path d="M8 5v14l11-7z" fill="#3D0C18" />
                  </Svg>
                )}
              </Pressable>

              {/* Barre de progression et temps à droite */}
              <Pressable 
                style={styles.progressContainer}
                onLayout={(e) => {
                  trackWidthRef.current = Math.max(1, e.nativeEvent.layout.width);
                }}
                onPress={handleSeek}
              >
                <View style={styles.progressTrack}>
                  <View style={[styles.progressBar, { width: `${percent}%`, overflow: 'hidden' }]}>
                    <Animated.View
                      style={[
                        styles.shimmer,
                        { transform: [{ translateX: shimmerAnim }, { rotate: '25deg' }] }
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.timeRow} pointerEvents="none">
                  <Text style={styles.timeText}>{formattedCurrentTime}</Text>
                  <Text style={styles.timeText}>{formattedDuration}</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </Animated.View>

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
    bottom: 190, // Remonté encore plus haut
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#3D0C18', // Bordeaux profond
    // @ts-ignore
    backgroundImage: 'linear-gradient(135deg, #5C162B 0%, #3D0C18 100%)', // Léger volume
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 12,
    overflow: 'hidden',
    zIndex: 10,
    borderWidth: 3,
    borderColor: '#D4AF37', // Bordure or massive et plus épaisse
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
    top: -100,
    bottom: -100,
    width: 80, // Faisceau un peu plus large mais très transparent
    backgroundColor: 'transparent',
    // @ts-ignore
    backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
    zIndex: 1,
  },
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D4AF37', // Rond en or
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 5,
  },
  progressContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 10, // Zone de clic beaucoup plus grande
    zIndex: 5,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Piste sombre (creusée)
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)', // Effet de profondeur
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#D4AF37', // Remplissage Or
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#D4AF37', // Texte Or
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
});

export default PlayerOverlay;
