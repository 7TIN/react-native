import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/theme';

const DrawerContent: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.drawerHeader}>
        <View style={styles.drawerIcon}>
          <Ionicons name="document" size={24} color={colors.primary} />
        </View>
        <View style={styles.drawerTitleContainer}>
          <Text style={styles.drawerTitle}>Notes</Text>
          <Text style={styles.drawerSubtitle}>0 files, 0 folders</Text>
        </View>
        <TouchableOpacity style={styles.drawerSettings}>
          <Ionicons name="settings" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.drawerItem}>
        <Text style={styles.drawerItemText}>Files</Text>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
      
      {/* Add more drawer items as needed */}
      <TouchableOpacity style={styles.drawerItem}>
        <Text style={styles.drawerItemText}>Recent</Text>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.drawerItem}>
        <Text style={styles.drawerItemText}>Shared</Text>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.drawerItem}>
        <Text style={styles.drawerItemText}>Favorites</Text>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
      <View style={styles.bottomNav}>
        <AntDesign name="addfile" size={20} color ={colors.primary}/>
        <AntDesign name="addfolder" size={20} color ={colors.primary}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  drawerIcon: {
    marginRight: 12,
  },
  drawerTitleContainer: {
    flex: 1,
  },
  drawerTitle: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  drawerSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  drawerSettings: {
    padding: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  drawerItemText: {
    color: colors.text,
    fontSize: 16,
  },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around', 
        alignItems: 'center',
        paddingVertical: 17,
        borderTopWidth: 1, 
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      borderTopColor: colors.border,
    },
});

export default DrawerContent;