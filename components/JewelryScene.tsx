import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Defs, RadialGradient, Stop, G, ClipPath } from 'react-native-svg';
import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface JewelrySceneProps {
  rubyScale?: SharedValue<number>;
}

export default function JewelryScene({ rubyScale }: JewelrySceneProps) {
  const animatedRubyStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: rubyScale ? rubyScale.value : 1 }]
    };
  });

  return (
    <View style={styles.container}>
      {/* Background and Chain */}
      <View style={StyleSheet.absoluteFill}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Chaîne = ronds + traits de liaison */}
          {(() => {
            const links = [];
            const centerX = width / 2;
            const centerY = height / 2 - 55;
            const numLinks = 15;

            // Côté gauche
            for (let i = 0; i < numLinks; i++) {
              const t = i / numLinks;
              const x = t * centerX;
              const y = height / 4 + t * (centerY - height / 4);
              // Trait vers le maillon suivant
              if (i < numLinks - 1) {
                const t2 = (i + 1) / numLinks;
                const x2 = t2 * centerX;
                const y2 = height / 4 + t2 * (centerY - height / 4);
                links.push(
                  <Path key={`ll-${i}`} d={`M ${x} ${y} L ${x2} ${y2}`} stroke="#cc9900" strokeWidth="1.5" />
                );
              }
              links.push(
                <Circle key={`l-${i}`} cx={x} cy={y} r="3" stroke="#cc9900" strokeWidth="1.5" fill="none" />
              );
            }
            // Côté droit
            for (let i = 0; i < numLinks; i++) {
              const t = i / numLinks;
              const x = width - t * centerX;
              const y = height / 4 + t * (centerY - height / 4);
              if (i < numLinks - 1) {
                const t2 = (i + 1) / numLinks;
                const x2 = width - t2 * centerX;
                const y2 = height / 4 + t2 * (centerY - height / 4);
                links.push(
                  <Path key={`rl-${i}`} d={`M ${x} ${y} L ${x2} ${y2}`} stroke="#cc9900" strokeWidth="1.5" />
                );
              }
              links.push(
                <Circle key={`r-${i}`} cx={x} cy={y} r="3" stroke="#cc9900" strokeWidth="1.5" fill="none" />
              );
            }
            return links;
          })()}
          {/* Anneau de liaison */}
          <Circle cx={width / 2} cy={height / 2 - 50} r="4" stroke="#cc9900" strokeWidth="2.5" fill="none" />
          {/* Traits de liaison derniers maillons → anneau */}
          <Path d={`M ${width / 2 - (width / 2) / 15} ${height / 4 + (14 / 15) * (height / 2 - 55 - height / 4)} L ${width / 2} ${height / 2 - 54}`} stroke="#cc9900" strokeWidth="1.5" />
          <Path d={`M ${width / 2 + (width / 2) / 15} ${height / 4 + (14 / 15) * (height / 2 - 55 - height / 4)} L ${width / 2} ${height / 2 - 54}`} stroke="#cc9900" strokeWidth="1.5" />
        </Svg>
      </View>

      {/* The Ruby Heart - Wrapped in Animated.View for future zoom */}
      <Animated.View style={[styles.rubyContainer, animatedRubyStyle]}>
        <Svg width={200} height={200} viewBox="0 0 200 200">
          <Defs>
            <RadialGradient id="goldGrad" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#ffe6a7" />
              <Stop offset="100%" stopColor="#cc9900" />
            </RadialGradient>
            <ClipPath id="heartClip">
              <Path
                d="M 0 -15 
                   C -10 -35, -55 -35, -50 5
                   C -45 40, -10 60, 0 75
                   C 10 60, 45 40, 50 5
                   C 55 -35, 10 -35, 0 -15"
              />
            </ClipPath>
          </Defs>

          <G transform="translate(100, 80)" clipPath="url(#heartClip)">
            {/* Base sombre du coeur (visible entre les facettes = ombre) */}
            <Path
              d="M 0 -15 
                 C -10 -35, -55 -35, -50 5
                 C -45 40, -10 60, 0 75
                 C 10 60, 45 40, 50 5
                 C 55 -35, 10 -35, 0 -15"
              fill="#4a0a1a"
            />

            {/* === FACETTES REMPLIES === */}

            {/* BOUCLIER CENTRAL (Table) - carmin éclatant (plus bordeaux qu'avant, mais lumineux) */}
            <Path d="M -30 4 L -15 -10 L 15 -10 L 30 4 L 0 47 Z" fill="#c41a3a" />

            {/* FACETTES SUPÉRIEURES */}
            {/* Top center - highlight (lumière directe) */}
            <Path d="M -15 -10 L -5 -35 L 5 -35 L 15 -10 Z" fill="#ff758f" />
            {/* Top-left petit triangle - reflet intense */}
            <Path d="M -15 -10 L -40 -30 L -5 -35 Z" fill="#ffb3c6" />
            {/* Top-right petit triangle */}
            <Path d="M 15 -10 L 5 -35 L 40 -30 Z" fill="#c9184a" />

            {/* FACETTES UPPER-SIDES */}
            {/* Upper-left quad */}
            <Path d="M -30 4 L -15 -10 L -40 -30 L -55 -10 Z" fill="#d62254" />
            {/* Upper-right quad */}
            <Path d="M 30 4 L 15 -10 L 40 -30 L 55 -10 Z" fill="#a4133c" />

            {/* FACETTES LATÉRALES GAUCHE (éclairées) */}
            {/* Left upper triangle */}
            <Path d="M -30 4 L -55 -10 L -55 18 Z" fill="#c9184a" />
            {/* Left mid triangle */}
            <Path d="M -30 4 L -55 18 L -48 35 Z" fill="#b01340" />

            {/* FACETTES LATÉRALES DROITE (ombre) */}
            {/* Right upper triangle */}
            <Path d="M 30 4 L 55 -10 L 55 18 Z" fill="#8a0e30" />
            {/* Right mid triangle */}
            <Path d="M 30 4 L 55 18 L 48 35 Z" fill="#800f2f" />

            {/* FACETTES LOWER-SIDES */}
            {/* Left lower quad */}
            <Path d="M -30 4 L -48 35 L -30 52 L 0 47 Z" fill="#a4133c" />
            {/* Right lower quad */}
            <Path d="M 30 4 L 48 35 L 30 52 L 0 47 Z" fill="#6d0b28" />

            {/* FACETTES INFÉRIEURES (vers la pointe) */}
            {/* Bottom-left upper */}
            <Path d="M 0 47 L -30 52 L -18 65 Z" fill="#8a0e30" />
            {/* Bottom-left lower */}
            <Path d="M 0 47 L -18 65 L 0 80 Z" fill="#6d0b28" />
            {/* Bottom-right upper */}
            <Path d="M 0 47 L 30 52 L 18 65 Z" fill="#700d2a" />
            {/* Bottom-right lower */}
            <Path d="M 0 47 L 18 65 L 0 80 Z" fill="#590d22" />

            {/* Glow/Highlight subtil */}
            <Circle cx="-8" cy="-12" r="3" fill="rgba(255,255,255,0.4)" />

          </G>

          {/* PRONGS en dehors du ClipPath pour ne pas être coupés */}
          <G transform="translate(100, 80)">
            {/* Top Left Prong - sur le lobe gauche */}
            <Circle cx="-45" cy="-22" r="5" fill="#cc9900" stroke="#ffe6a7" strokeWidth="1.5" />
            {/* Top Right Prong - sur le lobe droit */}
            <Circle cx="45" cy="-22" r="5" fill="#cc9900" stroke="#ffe6a7" strokeWidth="1.5" />
            {/* Bottom Prong - sur la pointe */}
            <Circle cx="0" cy="77" r="5" fill="#cc9900" stroke="#ffe6a7" strokeWidth="1.5" />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Écran blanc
    alignItems: 'center',
    justifyContent: 'center',
  },
  rubyContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    // We position it so its center matches the ring
    marginTop: -20,
  }
});
