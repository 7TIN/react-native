import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/theme';

interface HeaderProps {
  title: string;
  onMenuPress: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuPress }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <Ionicons name="menu" size={24} color={colors.primary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity style={styles.optionsButton}>
        <Ionicons name="ellipsis-vertical" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '500',
  },
  optionsButton: {
    padding: 8,
  },
});

export default Header;