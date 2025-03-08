import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/theme';

const BottomNavigation: React.FC = () => {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navButton}>
        <Ionicons name="chevron-back" size={24} color={colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton}>
        <Ionicons name="chevron-forward" size={24} color={colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton}>
        <Ionicons name="add-circle" size={24} color={colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton}>
        <Ionicons name="grid" size={24} color={colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton}>
        <Ionicons name="menu" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    height: 56,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BottomNavigation;