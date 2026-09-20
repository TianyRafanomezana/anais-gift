import { View, StyleSheet, Text, Dimensions, Pressable } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ShelfScene() {
  return (
    <View style={styles.container}>
      <View style={styles.wall}>
        <Text style={styles.instructionText}>🎧 Installe-toi au calme...</Text>
      </View>

      {/* L'étagère Supérieure (Souvenirs) */}
      <View style={styles.topShelfTop} />
      <View style={styles.topShelfFront} />

      <Pressable
        style={styles.box}
        onPress={() => console.log('Souvenirs cliqué !')}
      >
        <Text style={styles.boxText}>Souvenirs</Text>
      </Pressable>

      {/* L'étagère Principale (Disque) */}
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
    top: (height / 2) - 200,
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
  },
  topShelfTop: {
    position: 'absolute',
    top: (height / 2) - 140, // Descendue un peu plus
    width: 120,
    height: 15,
    backgroundColor: '#4A1525', 
    borderTopWidth: 1,
    borderTopColor: '#5C1D30',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  topShelfFront: {
    position: 'absolute',
    top: (height / 2) - 125, // -140 + 15
    width: 120,
    height: 20,
    backgroundColor: '#2D0D17',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3, // Un peu plus d'ombre vu que c'est sombre
    shadowRadius: 10,
    elevation: 10,
  },
  box: {
    position: 'absolute',
    top: (height / 2) - 220, // 80px posée sur -140
    width: 80,
    height: 80,
    backgroundColor: '#FDFBF7',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#EAE0D5',
    zIndex: 10,
  },
  boxText: {
    fontSize: 14,
    color: '#8A6870',
    fontWeight: '600',
    letterSpacing: 1,
    fontFamily: 'PinyonScript_400Regular',
  }
});
