import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image, Pressable, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { height } = Dimensions.get('window');

interface PlayerOverlayProps {
  isPlaying: boolean;
  progress: number;
  formattedCurrentTime: string;
  formattedDuration: string;
  isBuffering?: boolean;
  onPlayPausePress?: () => void;
  onSeekRatio?: (ratio: number) => void;
  onNextTrack?: () => void;
  onPrevTrack?: () => void;
  currentTrackIndex?: number;
  totalTracks?: number;
  currentTrackTitle?: string;
}

export const PlayerOverlay = React.memo(function PlayerOverlay({
  isPlaying,
  progress,
  formattedCurrentTime,
  formattedDuration,
  isBuffering,
  onPlayPausePress,
  onSeekRatio,
  onNextTrack,
  onPrevTrack,
  currentTrackIndex = 0,
  totalTracks = 1,
  currentTrackTitle = '',
}: PlayerOverlayProps) {
  const percent = Math.min(100, Math.max(0, progress * 100));

  const trackWidthRef = useRef(1);

  const handleSeek = useCallback((evt: any) => {
    if (!onSeekRatio) return;
    const nativeEvent = evt.nativeEvent;
    const clickX = nativeEvent.locationX ?? nativeEvent.offsetX ?? 0;
    if (typeof clickX !== 'number' || isNaN(clickX)) return;
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

  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);
    Animated.timing(expandAnim, {
      toValue,
      duration: 1200,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      useNativeDriver: true,
    }).start();
  };

  const toggleFlip = () => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    Animated.timing(flipAnim, {
      toValue: nextFlipped ? 1 : 0,
      duration: 1200,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      useNativeDriver: true,
    }).start();
  };

  const coverTranslateY = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [140, -300], // La pochette est coupée en bas comme souhaité
  });

  const coverScale = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2], // Grossit un peu
  });

  const frontRotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backRotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });
  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
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

        {/* Backdrop (Assombrissement) */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'black', opacity: expandAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.85] }), zIndex: 25 }
          ]}
          pointerEvents={isExpanded ? 'auto' : 'none'}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={() => {
            if (isExpanded) {
              toggleExpand();
              if (isFlipped) {
                setIsFlipped(false);
                Animated.timing(flipAnim, {
                  toValue: 0,
                  duration: 1200,
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                  useNativeDriver: true,
                }).start();
              }
            }
          }} />
        </Animated.View>

        {/* La pochette interactive (en bas, dépassant de l'écran) */}
        <Animated.View
          style={[
            styles.floatingCoverContainer,
            { transform: [{ translateY: mountTranslateY }, { translateY: coverTranslateY }, { scale: coverScale }] }
          ]}
          pointerEvents="box-none"
        >
          <Pressable onPress={() => {
            if (!isExpanded) toggleExpand();
            else toggleFlip();
          }}>
            <Animated.View style={[styles.coverArt, { transform: [{ perspective: 1000 }, { rotateY: frontRotateY }], opacity: frontOpacity }]}>
              <Image
                source={require('../assets/mini_cover.png')}
                style={styles.coverImage}
                resizeMode="cover"
              />
            </Animated.View>
            <Animated.View style={[styles.coverArt, styles.coverBack, { transform: [{ perspective: 1000 }, { rotateY: backRotateY }], opacity: backOpacity, position: 'absolute' }]}>
              <View style={styles.coverBackInner}>
                <Text style={styles.trackListTitle}>Tracklist</Text>
                <View style={styles.trackItem}>
                  <Text style={styles.trackName}> 1. Prayer for your heart</Text>
                </View>
                <View style={styles.trackItem}>
                  <Text style={styles.trackName}> 2. Memories of your inspiration</Text>
                </View>
                <Text style={styles.coverMessage}>LIMITED EDITION</Text>
              </View>
            </Animated.View>
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

              {/* Section Droite : Barre de progression + Temps + Track Switcher */}
              <View style={styles.rightSection}>
                {/* Barre cliquable */}
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
                </Pressable>

                {/* Temps et boutons Next/Prev */}
                <View style={styles.timeRow} pointerEvents="box-none">
                  <Text style={styles.timeText}>{formattedCurrentTime}</Text>

                  {/* Track switcher */}
                  <View style={styles.trackSwitcher}>
                    <Pressable onPress={onPrevTrack} style={styles.arrowBtn} hitSlop={15}>
                      <Svg width={12} height={12} viewBox="0 0 24 24">
                        <Path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" fill="#D4AF37" />
                      </Svg>
                    </Pressable>

                    <View style={styles.trackInfo}>
                      <Text style={styles.trackCounter} numberOfLines={1} ellipsizeMode="tail">
                        {currentTrackTitle} <Text style={styles.trackIndex}></Text>
                      </Text>
                    </View>

                    <Pressable onPress={onNextTrack} style={styles.arrowBtn} hitSlop={15}>
                      <Svg width={12} height={12} viewBox="0 0 24 24">
                        <Path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" fill="#D4AF37" />
                      </Svg>
                    </Pressable>
                  </View>

                  <Text style={styles.timeText}>{formattedDuration}</Text>
                </View>
              </View>
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
    top: (height / 2) + 180, // Se positionne exactement sous la platine qui est maintenant centrée
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
    zIndex: 30, // Doit passer au-dessus du backdrop (25)
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
  coverBack: {
    backgroundColor: '#F8E3E5', // Rose Blush
    borderWidth: 2,
    borderColor: '#E8D0D4',
  },
  coverBackInner: {
    flex: 1,
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(92, 42, 51, 0.1)',
    margin: 5,
  },
  trackListTitle: {
    fontFamily: 'PinyonScript_400Regular',
    fontSize: 28,
    color: '#5C2A33',
    marginBottom: 20,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  trackNumber: {
    fontSize: 12,
    color: '#D4AF37', // Or
    fontWeight: 'bold',
    marginRight: 10,
  },
  trackName: {
    fontSize: 16,
    color: '#4A1525',
    fontStyle: 'italic',
  },
  coverMessage: {
    marginTop: 30,
    fontSize: 12,
    color: '#9E6C75',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
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
  rightSection: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 12,
    justifyContent: 'center',
  },
  progressContainer: {
    height: 20, // Zone de clic pour la barre
    justifyContent: 'center',
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Piste sombre (creusée)
    borderRadius: 2,
    overflow: 'hidden',
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -2, // Remonte légèrement le bloc de texte vers la barre
  },
  timeText: {
    color: '#D4AF37', // Texte Or
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
  trackSwitcher: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  trackInfo: {
    flexShrink: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  arrowBtn: {
    padding: 4,
  },
  trackCounter: {
    color: '#D4AF37',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  trackIndex: {
    color: 'rgba(212, 175, 55, 0.5)',
    fontWeight: '500',
  },
});

export default PlayerOverlay;
