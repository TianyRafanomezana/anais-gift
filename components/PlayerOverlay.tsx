import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
        {/* En-tête : Titre & Badge d'état */}
        <View style={styles.header}>
          <Text style={styles.title}>Le Vinyle d'Anaïs</Text>
          <View style={[styles.badge, isPlaying ? styles.badgePlaying : styles.badgePaused]}>
            <Text style={styles.badgeText}>
              {isBuffering ? 'CHARGEMENT...' : isPlaying ? '▶ EN LECTURE' : '⏸ EN PAUSE'}
            </Text>
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

        {/* Invitation discrète */}
        <Text style={styles.hintText}>
          {isPlaying ? 'Touche l\'écran pour mettre en pause' : 'Touche l\'écran pour reprendre l\'écoute'}
        </Text>
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
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  badgePlaying: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderColor: '#D4AF37',
  },
  badgePaused: {
    backgroundColor: 'rgba(247, 202, 208, 0.1)',
    borderColor: 'rgba(247, 202, 208, 0.4)',
  },
  badgeText: {
    color: '#F7CAD0',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.2,
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
  hintText: {
    marginTop: 8,
    color: 'rgba(212, 175, 55, 0.75)',
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default PlayerOverlay;
