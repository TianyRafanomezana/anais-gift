import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Defs, RadialGradient, Stop, ClipPath, G } from 'react-native-svg';

interface VinylRecordProps {
  size?: number;
}

export default function VinylRecord({ size = 300 }: VinylRecordProps) {
  const center = size / 2;
  const radius = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          {/* Dégradé pour le macaron central (Or brossé / Rose Gold) */}
          <RadialGradient id="labelGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor="#FFE6A3" />
            <Stop offset="70%" stopColor="#D4AF37" />
            <Stop offset="100%" stopColor="#B8860B" />
          </RadialGradient>
          
          {/* Dégradé pour le vinyle noir avec un léger reflet radial */}
          <RadialGradient id="vinylGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <Stop offset="30%" stopColor="#1a1a1a" />
            <Stop offset="80%" stopColor="#0a0a0a" />
            <Stop offset="100%" stopColor="#000000" />
          </RadialGradient>
          
          <ClipPath id="vinylClip">
            <Circle cx={center} cy={center} r={radius} />
          </ClipPath>
        </Defs>

        {/* Base du Vinyle */}
        <Circle cx={center} cy={center} r={radius} fill="url(#vinylGradient)" />

        {/* Microsillons (Rainures) */}
        {[0.9, 0.8, 0.7, 0.6, 0.5, 0.45].map((scale, index) => (
          <Circle
            key={index}
            cx={center}
            cy={center}
            r={radius * scale}
            stroke="#222"
            strokeWidth="0.5"
            fill="none"
          />
        ))}

        {/* Reflet lumineux stylisé (très simple pour l'instant) */}
        {/* On utilise deux chemins semi-transparents blancs/gris pour simuler le reflet conique */}
        <G clipPath="url(#vinylClip)">
          <Path
            d={`M ${center} ${center} L ${center - radius * 0.5} 0 A ${radius} ${radius} 0 0 1 ${center + radius * 0.5} 0 Z`}
            fill="rgba(255,255,255,0.05)"
          />
          <Path
            d={`M ${center} ${center} L ${center - radius * 0.5} ${size} A ${radius} ${radius} 0 0 0 ${center + radius * 0.5} ${size} Z`}
            fill="rgba(255,255,255,0.05)"
          />
        </G>

        {/* Macaron Central (Label) */}
        <Circle cx={center} cy={center} r={radius * 0.35} fill="url(#labelGradient)" />

        {/* Ligne décorative sur le macaron */}
        <Circle cx={center} cy={center} r={radius * 0.32} stroke="#B8860B" strokeWidth="1" fill="none" />

        {/* Logo Cœur (Minimaliste au centre) */}
        <Path
          d={`M ${center} ${center + 5} 
              C ${center} ${center + 5}, ${center - 15} ${center - 5}, ${center - 15} ${center - 15} 
              C ${center - 15} ${center - 25}, ${center - 5} ${center - 25}, ${center} ${center - 15} 
              C ${center + 5} ${center - 25}, ${center + 15} ${center - 25}, ${center + 15} ${center - 15} 
              C ${center + 15} ${center - 5}, ${center} ${center + 5}, ${center} ${center + 5} Z`}
          fill="#180917" /* Rose très sombre / Prune */
        />

        {/* Trou central (Spindle hole) */}
        <Circle cx={center} cy={center} r={radius * 0.03} fill="#000" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // Ajout d'une ombre subtile pour donner du relief au disque
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
});
