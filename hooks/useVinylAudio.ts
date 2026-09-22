import { useEffect, useCallback, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import {
  useAudioPlayer,
  useAudioPlayerStatus,
  setAudioModeAsync,
  AudioSource
} from 'expo-audio';

export const VINYL_TRACKS = [
  { id: 1, title: 'Prayer to you', source: require('../assets/audio/audio-anais.mp4') },
  { id: 2, title: 'Inspiration memories', source: require('../assets/audio/audio-discuss.mp4') },
];

export interface VinylAudioOptions {
  updateInterval?: number; // en millisecondes, ex: 250
}

export function formatTime(seconds: number = 0): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Hook optimisé pour l'écoute audio du Vinyle d'Anaïs (Expo SDK 57 / expo-audio).
 * Gère l'isolation des états, les contrôles Play/Pause, la progression,
 * et le support des métadonnées écran verrouillé (MediaSession / Lockscreen).
 */
export function useVinylAudio(options: VinylAudioOptions = {}) {
  const {
    updateInterval = 250,
  } = options;

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // Initialisation du player expo-audio avec intervalle de mise à jour optimisé
  const player = useAudioPlayer(VINYL_TRACKS[0].source, { updateInterval });
  const status = useAudioPlayerStatus(player);

  // Configuration du mode audio (mode silencieux supporté sur iOS)
  useEffect(() => {
    async function configureAudio() {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
        });
      } catch (err) {
        console.warn('[useVinylAudio] Impossible de configurer le mode audio:', err);
      }
    }
    configureAudio();
  }, []);

  // Contrôles de lecture
  const play = useCallback(() => {
    try {
      player.play();
    } catch (err) {
      console.warn('[useVinylAudio] Erreur lors de la lecture:', err);
    }
  }, [player]);

  const pause = useCallback(() => {
    try {
      player.pause();
    } catch (err) {
      console.warn('[useVinylAudio] Erreur lors de la pause:', err);
    }
  }, [player]);

  const togglePlay = useCallback(() => {
    if (status.playing) {
      pause();
    } else {
      play();
    }
  }, [status.playing, play, pause]);

  const seekTo = useCallback((seconds: number) => {
    try {
      player.seekTo(Math.max(0, Math.min(seconds, status.duration || 0)));
    } catch (err) {
      console.warn('[useVinylAudio] Erreur seekTo:', err);
    }
  }, [player, status.duration]);

  const seekToRatio = useCallback((ratio: number) => {
    if (status.duration > 0) {
      const target = Math.max(0, Math.min(1, ratio)) * status.duration;
      seekTo(target);
    }
  }, [status.duration, seekTo]);

  const replay = useCallback(() => {
    seekTo(0);
    play();
  }, [seekTo, play]);

  const setTrack = useCallback((index: number) => {
    if (index >= 0 && index < VINYL_TRACKS.length) {
      const wasPlaying = status.playing;
      setCurrentTrackIndex(index);
      player.replace(VINYL_TRACKS[index].source);
      if (wasPlaying) {
        setTimeout(() => player.play(), 50);
      }
    }
  }, [player, status.playing]);

  const nextTrack = useCallback(() => {
    setTrack((currentTrackIndex + 1) % VINYL_TRACKS.length);
  }, [currentTrackIndex, setTrack]);

  const prevTrack = useCallback(() => {
    setTrack((currentTrackIndex - 1 + VINYL_TRACKS.length) % VINYL_TRACKS.length);
  }, [currentTrackIndex, setTrack]);

  // Support Media Session API sur le Web et mobile PWA
  useEffect(() => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: VINYL_TRACKS[currentTrackIndex].title,
          artist: "Pour Anaïs",
          album: "Le Vinyle d'Anaïs",
        });

        navigator.mediaSession.setActionHandler('play', () => play());
        navigator.mediaSession.setActionHandler('pause', () => pause());
        navigator.mediaSession.setActionHandler('seekto', (details) => {
          if (details.seekTime !== undefined) {
            seekTo(details.seekTime);
          }
        });
        navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
        navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
      } catch {
        // Silencieux si MediaMetadata non supporté
      }
    }
  }, [play, pause, seekTo, nextTrack, prevTrack, currentTrackIndex]);

  // Support Lockscreen natif (Android / iOS via expo-audio)
  useEffect(() => {
    if (status.isLoaded && player.setActiveForLockScreen) {
      try {
        player.setActiveForLockScreen(true, {
          title: VINYL_TRACKS[currentTrackIndex].title,
          artist: "Pour Anaïs",
          albumTitle: "Le Vinyle d'Anaïs",
        });
      } catch {
        // Silencieux si non supporté sur la plateforme actuelle
      }
    }
  }, [status.isLoaded, player, currentTrackIndex]);

  // Calculs mémoïsés pour éviter re-rendus inutiles
  const currentTime = status.currentTime ?? 0;
  const duration = status.duration ?? 0;
  const progress = useMemo(() => {
    return duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;
  }, [currentTime, duration]);

  const isFinished = useMemo(() => {
    return duration > 0 && currentTime >= duration - 0.2 && !status.playing;
  }, [currentTime, duration, status.playing]);

  return {
    player,
    status,
    isPlaying: !!status.playing,
    isLoaded: !!status.isLoaded,
    isBuffering: !!status.isBuffering,
    isFinished,
    currentTime,
    duration,
    progress,
    formattedCurrentTime: formatTime(currentTime),
    formattedDuration: formatTime(duration),
    play,
    pause,
    togglePlay,
    seekTo,
    seekToRatio,
    replay,
    nextTrack,
    prevTrack,
    currentTrackIndex,
    totalTracks: VINYL_TRACKS.length,
    currentTrackTitle: VINYL_TRACKS[currentTrackIndex].title,
  };
}

export default useVinylAudio;
