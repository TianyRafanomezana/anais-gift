import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue, interpolate } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface TurntableSceneProps {
  armRotation: SharedValue<number>;
  armLift?: SharedValue<number>;
}

interface TurntableBaseProps {
  isPlaying?: boolean;
  onPress?: () => void;
}

export default function TurntableScene({ isPlaying = false, onPress }: TurntableBaseProps) {
  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Turntable Base (Valise) */}
      <Pressable
        style={styles.turntableBase}
        onPress={onPress}
        disabled={!onPress}
      >
        {/* Tranche du couvercle (vue de dessus) */}
        <View style={styles.lidEdge}>
          {/* Loquet supérieur de fermeture avec sa boucle */}
          <View style={styles.topLatchContainer}>
            <View style={styles.latchLoop} />
            <View style={styles.latchBase} />
          </View>
        </View>

        {/* Intérieur bois */}
        <View style={styles.woodDeck}>
          <Image
            source={require('../assets/wood_texture_mid.jpg')}
            style={styles.woodImage}
            resizeMode="cover"
          />
          {/* Léger voile d'ombrage pour le relief */}
          <View style={styles.woodOverlay} />
        </View>

        {/* Platter Rim (Tranche du plateau pour l'épaisseur 3D) */}
        <View style={styles.platterRim} />
        {/* Platter (Le plateau où le vinyle va atterrir) */}
        <View style={styles.platter}>
          {/* Support central métallique (Spindle) */}
          <View style={styles.platterSpindle}>
            <View style={styles.platterSpindleHighlight} />
          </View>
        </View>

        {/* Support plastique noir pour le bras */}
        <View style={styles.armSupportPanel} />

        {/* Boutons sur la droite, en dessous du bras */}
        <View style={styles.knobsContainer}>
          <View style={styles.knob}><View style={styles.knobHighlight} /></View>
          <View style={styles.knob}><View style={styles.knobHighlight} /></View>

          {/* Voyant LED (allumé si isPlaying) */}
          <View style={[styles.ledIndicator, isPlaying && styles.ledIndicatorOn]} />
        </View>

        {/* Éléments avant qui dépassent (poignée, loquets) */}
        <View style={styles.frontEdge}>
          <View style={styles.latch} />
          <View style={styles.handle} />
          <View style={styles.latch} />

          {/* Bout de métal central (fermoir) aligné avec le haut */}
          <View style={styles.centerLatch} />
        </View>
      </Pressable>
    </View>
  );
}

export function TurntableArmScene({ armRotation, armLift }: TurntableSceneProps) {
  const animatedArmStyle = useAnimatedStyle(() => {
    // Si armLift est défini, on interpole de 0 (posé) à 1 (soulevé)
    const scale = armLift ? interpolate(armLift.value, [0, 1], [1, 1.05]) : 1;
    const shadowOffset = armLift ? interpolate(armLift.value, [0, 1], [15, 25]) : 15;
    const shadowOpacity = armLift ? interpolate(armLift.value, [0, 1], [0.6, 0.4]) : 0.6;
    const translateY = armLift ? interpolate(armLift.value, [0, 1], [0, -5]) : 0;

    return {
      transform: [
        { translateY: -90 },
        { rotate: `${armRotation.value}deg` },
        { translateY: 90 },
        { translateY }, // Effet de recul visuel
        { scale }, // Effet de zoom
      ],
      shadowOffset: { width: 5, height: shadowOffset },
      shadowOpacity,
      shadowRadius: 10,
    };
  });

  return (
    <View style={styles.container}>
      <View style={[styles.turntableBase, styles.transparentBase]}>
        {/* Tonearm Base (Pivot) */}
        <View style={styles.tonearmBase}>
          <View style={styles.tonearmBaseCenter} />
        </View>

        {/* Tonearm (Le bras articulé animé) */}
        <Animated.View style={[styles.tonearmWrapper, animatedArmStyle]}>
          <View style={styles.tonearmLine} />
          <View style={styles.tonearmHead}>
            <View style={styles.tonearmNeedle} />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  turntableBase: {
    width: 340,
    height: 290,
    backgroundColor: '#4A0E1C', // Laque Bordeaux profond
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#2D0811', // Bords très sombres

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  woodDeck: {
    position: 'absolute',
    top: 10,
    left: 12,
    right: 12,
    bottom: 10,
    backgroundColor: '#2D0811', // Intérieur laque sombre
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#1A0409',
    overflow: 'hidden',
  },
  woodImage: {
    position: 'absolute',
    top: -120,
    left: -95,
    width: 520,
    height: 520,
    transform: [{ rotate: '30deg' }],
    opacity: 0, // On cache le bois pour le style moderne
  },
  woodOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  lidEdge: {
    position: 'absolute',
    top: -55,
    width: 340,
    height: 55,
    backgroundColor: '#4A0E1C', // Laque Bordeaux
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: '#2D0811',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // Ombre portée vers l'intérieur pour donner de la profondeur
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 2, // Pour que l'ombre passe au-dessus du cuir et du bois
  },
  topLatchContainer: {
    alignItems: 'center',
    marginBottom: -2,
  },
  latchLoop: {
    width: 40,
    height: 30,
    borderWidth: 5,
    borderColor: '#D4AF37', // Boucle Or
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  latchBase: {
    width: 26,
    height: 15,
    backgroundColor: '#C59B27', // Or
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    borderWidth: 1,
    borderColor: '#B8860B',
    marginTop: -4,
  },
  frontEdge: {
    position: 'absolute',
    bottom: -8, // 0 = bord extérieur de la valise. bottom: -8 + height: 8 => top: 0 (colle parfaitement)
    width: 340,
    height: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start', // Colle la poignée et les loquets tout en haut, contre la valise
    gap: 0, // Les éléments se touchent
    zIndex: 20,
  },
  latch: {
    width: 16,
    height: 6,
    backgroundColor: '#D4AF37', // Or
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#B8860B',
    zIndex: 2,
  },
  centerLatch: {
    position: 'absolute',
    left: '50%',
    marginLeft: -12,
    top: 0,
    width: 24,
    height: 6,
    backgroundColor: '#D4AF37', // Or
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#B8860B',
    zIndex: 3,
  },
  handle: {
    width: 90,
    height: 8,
    backgroundColor: '#1A0409', // Cuir bordeaux très sombre/noir
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    marginHorizontal: -4, // Fait chevaucher les bouts métalliques de 4px de chaque côté
    zIndex: 1,
  },
  armSupportPanel: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 54,
    height: 85,
    backgroundColor: '#2D0811', // Support laque sombre
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1A0409',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    zIndex: 4,
  },
  knobsContainer: {
    position: 'absolute',
    bottom: 22, // Légèrement remonté pour la nouvelle hauteur
    right: 18, // Alignés sur la droite
    width: 40,
    alignItems: 'center',
    gap: 15,
    zIndex: 5,
  },
  smallKnob: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#666',
    marginBottom: 5,
  },
  knob: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#D4AF37', // Or
    borderWidth: 1,
    borderColor: '#B8860B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  knobHighlight: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F9E2A0', // Reflet or clair
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  ledIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#444', // Éteint
    marginTop: 15, // Espacement par rapport aux boutons
    borderWidth: 1,
    borderColor: '#222',
  },
  ledIndicatorOn: {
    backgroundColor: '#FF3B30', // Rouge vif
    borderColor: '#FFA099',
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  transparentBase: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  platterRim: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#C59B27', // Tranche Or
    position: 'absolute',
    top: 19,
    left: 11,
  },
  platter: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#111',
    borderWidth: 4,
    borderColor: '#D4AF37', // Bordure Or autour du plateau noir

    position: 'absolute',
    top: 15,
    left: 11, // Décalé pour conserver l'alignement vinyle à -29px
    justifyContent: 'center',
    alignItems: 'center',
  },
  platterSpindle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D4AF37', // Centre Or
    borderWidth: 1,
    borderColor: '#B8860B',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  platterSpindleHighlight: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#FFF',
    position: 'absolute',
    top: 2,
    left: 2,
  },
  tonearmBase: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4A0E1C', // Pivot Bordeaux
    borderWidth: 2,
    borderColor: '#2D0811',
    position: 'absolute',
    top: 26, // Recentré pour la hauteur 290
    right: 17, // Au centre du support noir
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tonearmBaseCenter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#D4AF37', // Centre Or
  },
  tonearmWrapper: {
    position: 'absolute',
    top: 48, // 26 + 22
    right: 32, // 17 (pivot) + 22 (rayon) - 7 (demi-bras) = 32
    width: 14,
    height: 180,
    zIndex: 11,
    alignItems: 'center',
  },
  tonearmLine: {
    width: 4,
    height: 180,
    backgroundColor: '#D4AF37', // Tige Or
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  tonearmHead: {
    width: 18,
    height: 35,
    backgroundColor: '#4A0E1C', // Tête Bordeaux
    borderWidth: 1,
    borderColor: '#D4AF37', // Bordure or
    borderRadius: 4,
    marginTop: -5,
    alignItems: 'flex-start', // Pour placer l'aiguille rouge sur le côté
  },
  tonearmNeedle: {
    width: 6,
    height: 10,
    backgroundColor: '#D4AF37', // Pointe or
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    marginTop: 15,
    marginLeft: -3, // Dépasse un peu sur la gauche
  }
});
