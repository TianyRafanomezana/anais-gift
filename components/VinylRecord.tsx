import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle, Path, Defs, RadialGradient, Stop, ClipPath, G } from 'react-native-svg';

interface VinylRecordProps {
  size?: number;
}

export default function VinylRecord({ size = 300 }: VinylRecordProps) {
  const center = size / 2;
  const radius = size / 2;
  const labelSize = size * 0.35; // Le macaron fait 35% du rayon, donc 35% de la taille totale en diamètre

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          {/* ClipPath avec fillRule evenodd pour créer un vrai trou compatible avec la 3D */}
          <ClipPath id="donutClip">
            <Path
              d={`
                M 0 0 h ${size} v ${size} h -${size} Z
                M ${center} ${center - radius * 0.03} 
                A ${radius * 0.03} ${radius * 0.03} 0 1 0 ${center} ${center + radius * 0.03} 
                A ${radius * 0.03} ${radius * 0.03} 0 1 0 ${center} ${center - radius * 0.03} 
                Z
              `}
              fillRule="evenodd"
            />
          </ClipPath>

          {/* Dégradé pour le macaron central (Rose Blush comme la pochette) */}
          <RadialGradient id="labelGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="70%" stopColor="#F8E3E5" />
            <Stop offset="100%" stopColor="#E6CED1" />
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

        {/* On englobe tout le disque dans le ClipPath pour faire le trou */}
        <G clipPath="url(#donutClip)">
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
          <Circle cx={center} cy={center} r={radius * 0.32} stroke="#E6CED1" strokeWidth="1" fill="none" />


          {/* Ombre/profondeur du trou (pour donner du relief) */}
          <Circle cx={center} cy={center} r={radius * 0.04} fill="#111" />
          {/* L'axe métallique est maintenant physiquement sur la platine et passera à travers le trou transparent ! */}
        </G>
      </Svg>

      {/* Macaron texte et relief façon vrai vinyle */}
      <View style={[styles.labelOverlay, { width: labelSize, height: labelSize, borderRadius: labelSize / 2, left: center - labelSize / 2, top: center - labelSize / 2 }]}>
        {/* Textes du macaron */}
        <View style={styles.labelTopSection}>
          <Text style={styles.labelTitle}>Prayer to</Text>
        </View>

        <View style={styles.labelMiddleSection}>
          <Text style={styles.labelSpeed}>Anais</Text>
          <View style={{ width: 25 }} />
          <Text style={styles.labelSpeed}>RMD</Text>
        </View>

        <View style={styles.labelBottomSection}>
          <Text style={styles.labelTitle}>My sister</Text>
        </View>

        {/* Centre (trou du vinyle) */}
        <View style={styles.centerHole} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },

  labelTopSection: {
    position: 'absolute',
    top: 15,
    width: '100%',
    alignItems: 'center',
  },
  labelTitle: {
    fontFamily: 'PinyonScript_400Regular',
    fontSize: 18,
    color: '#4A1525',
  },
  labelMiddleSection: {
    position: 'absolute',
    top: '50%',
    marginTop: -5,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelSpeed: {
    fontSize: 7,
    fontWeight: 'bold',
    color: 'rgba(74, 21, 37, 0.6)',
    letterSpacing: 1,
  },
  labelBottomSection: {
    position: 'absolute',
    bottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  labelSide: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#4A1525',
    letterSpacing: 2,
  },
  centerHole: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#111',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
});
