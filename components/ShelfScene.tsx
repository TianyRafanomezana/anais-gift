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
    color: '#F7CAD0', // Rose clair lisible sur le mur velours bordeaux
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 1,
    opacity: 0.8,
    alignSelf: 'center',
  },
  shelfTop: {
    position: 'absolute',
    top: (height / 2) + 230, // Ajusté pour s'aligner avec la pochette (descendue de 50px)
    width: 320,
    height: 15,
    backgroundColor: '#4A1525', // Velours bordeaux
    borderTopWidth: 1,
    borderTopColor: '#5C1D30',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  shelfFront: {
    position: 'absolute',
    top: (height / 2) + 245, // 230 + 15
    width: 320,
    height: 25,
    backgroundColor: '#2D0D17', // Tranche plus sombre
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
  }
});
