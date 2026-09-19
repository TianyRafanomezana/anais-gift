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
  shelfTop: {
    position: 'absolute',
    top: (height / 2) + 80, // Ajusté pour la pochette de taille 240
    width: 320,
    height: 15,
    backgroundColor: '#3a1f33', // Bois sombre violacé
    borderTopWidth: 1,
    borderTopColor: '#5c3251',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  shelfFront: {
    position: 'absolute',
    top: (height / 2) + 95, // 80 + 15
    width: 320,
    height: 25,
    backgroundColor: '#261421', // Tranche de l'étagère plus sombre
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
  }
});
