import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ShelfScene() {
  return (
    <View style={styles.container}>
      <View style={styles.wall}>
        <Text style={styles.instructionText}>🎧 Installe-toi au calme...</Text>
      </View>
      
      {/* L'étagère */}
      <View style={styles.shelfTop} />
      <View style={styles.shelfFront} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 50,
  },
  wall: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    zIndex: 2,
  },
  instructionText: {
    position: 'absolute',
    top: (height / 2) - 250,
    color: '#F7CAD0',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 1,
    opacity: 0.8,
    alignSelf: 'center',
  },
  sleeveFront: {
    width: 260,
    height: 260,
    backgroundColor: '#F7CAD0', // Rose poudré satiné
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D4AF37', // Dorure fine
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20,
    // On le décale légèrement vers le haut pour le poser "sur" l'étagère
    transform: [{ translateY: 5 }],
  },
  sleeveText: {
    color: '#D4AF37',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 4,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sleeveSubtext: {
    marginTop: 20,
    color: '#8c5a61',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  shelfTop: {
    position: 'absolute',
    top: (height / 2) + 80, // Ajusté pour la pochette de taille 240
    width: width,
    height: 15,
    backgroundColor: '#3a1f33', // Bois sombre violacé
    borderTopWidth: 1,
    borderTopColor: '#5c3251',
  },
  shelfFront: {
    position: 'absolute',
    top: (height / 2) + 95, // 80 + 15
    width: width,
    height: 25,
    backgroundColor: '#261421', // Tranche de l'étagère plus sombre
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
  }
});
