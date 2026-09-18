import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import VinylPlayer from './components/VinylPlayer';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.instructionText}>🎧 Installe-toi au calme...</Text>
        
        {/* Le lecteur de Vinyle */}
        <VinylPlayer />
        
        <StatusBar style="light" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#180917', // Fond Prune Nuit
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionText: {
    color: '#F7CAD0', // Rose poudré
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 1,
    marginBottom: 50,
    opacity: 0.8,
  },
});
