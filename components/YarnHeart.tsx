import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  withDelay,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface YarnHeartProps {
  size?: number;
}

export default function YarnHeart({ size = 150 }: YarnHeartProps) {
  // Longueur estimée du chemin SVG (il vaut mieux prévoir large pour cacher tout le trait au départ)
  const PATH_LENGTH = 450;

  const dashOffset = useSharedValue(PATH_LENGTH);

  useEffect(() => {
    // 1. Tissage du fil de laine (dessin du chemin)
    dashOffset.value = withDelay(
      500,
      withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.quad) })
    );
  }, []);

  const animatedBaseProps = useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.value,
  }));

  const animatedHighlightProps = useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.value,
  }));

  return (
    <Animated.View style={[styles.container, { width: size, height: size }]}>
      <Svg viewBox="0 0 100 120" width="100%" height="100%">
        {/* Ombre portée légère du fil */}
        <AnimatedPath
          d="M 25,115 
             C 25,90 45,85 50,80 
             C 10,60 5,20 30,10 
             C 45,5 50,25 50,25 
             C 50,25 55,5 70,10 
             C 95,20 90,60 50,80 
             C 65,85 75,95 75,115"
          fill="none"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={PATH_LENGTH}
          animatedProps={animatedBaseProps}
          transform="translate(1, 2)" // Décalage pour l'ombre
        />

        {/* Cœur central (Fil principal - Rouge profond) */}
        <AnimatedPath
          d="M 25,115 
             C 25,90 45,85 50,80 
             C 10,60 5,20 30,10 
             C 45,5 50,25 50,25 
             C 50,25 55,5 70,10 
             C 95,20 90,60 50,80 
             C 65,85 75,95 75,115"
          fill="none"
          stroke="#3E1C22" // Ombre du fil (Bordeaux très sombre)
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={PATH_LENGTH}
          animatedProps={animatedBaseProps}
        />

        {/* Effet texturé du fil (Surbrillance pour la laine) */}
        <AnimatedPath
          d="M 25,115 
             C 25,90 45,85 50,80 
             C 10,60 5,20 30,10 
             C 45,5 50,25 50,25 
             C 50,25 55,5 70,10 
             C 95,20 90,60 50,80 
             C 65,85 75,95 75,115"
          fill="none"
          stroke="#5C2A33" // Couleur principale de la typo (Bordeaux/Violet)
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={PATH_LENGTH}
          // On ajoute un tout petit dash en plus pour donner l'illusion de crans/fibres
          // Mais il faut faire attention, si on met deux valeurs dans strokeDasharray, 
          // ça casse le strokeDashoffset simple. On va le garder lisse pour un joli rendu vectoriel.
          animatedProps={animatedHighlightProps}
        />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
