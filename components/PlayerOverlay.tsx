import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.card}>
        {/* En-tête : Titre & Icône d'état */}
        <View style={styles.header}>
          <Text style={styles.title}>Le Vinyle d'Anaïs</Text>
          <View style={styles.playPauseIcon}>
            {isPlaying ? (
              // Icône Pause (élégante et fine)
              <Svg width={22} height={22} viewBox="0 0 24 24">
                <Path d="M8 5h2v14H8zm6 0h2v14h-2z" fill="#D4AF37" />
              </Svg>
            ) : (
              // Icône Play
              <Svg width={22} height={22} viewBox="0 0 24 24">
                <Path d="M8 5v14l11-7z" fill="#D4AF37" />
              </Svg>
            )}
          </View>
        </View>

        {/* Barre de progression fine dorée */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { width: `${percent}%` }]} />
        </View>

        {/* Horodatage */}
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formattedCurrentTime}</Text>
          <Text style={styles.timeText}>{formattedDuration}</Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 35,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 50,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: 'rgba(28, 15, 25, 0.90)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.45)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    color: '#D4AF37',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  playPauseIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 2,
    overflow: 'hidden',
    marginVertical: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#D4AF37',
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    color: 'rgba(247, 202, 208, 0.65)',
    fontSize: 11,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
});

export default PlayerOverlay;
