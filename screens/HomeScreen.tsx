import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { colors } from '../styles/theme';

interface HomeScreenProps {
  onMenuPress: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onMenuPress }) => {
  return (
    <View style={styles.container}>
      <Header title="New tab" onMenuPress={onMenuPress} />
      
      <View style={styles.content}>
        <Text style={styles.noFileText}>No file is open</Text>
        
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Create new note</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
      
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noFileText: {
    color: colors.text,
    fontSize: 28,
    marginBottom: 40,
  },
  button: {
    width: '100%',
    backgroundColor: colors.buttonBackground,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 16,
  },
});

export default HomeScreen;