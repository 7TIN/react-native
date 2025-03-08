import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FileItem as FileItemType } from '../types';
import { colors } from '../styles/theme';
import { formatFileSize, getFileIconName } from '../utils/fileUtils';

interface FileItemProps {
  file: FileItemType;
  onPress: (file: FileItemType) => void;
  onFavoriteToggle: (file: FileItemType) => void;
}

const FileItem: React.FC<FileItemProps> = ({ file, onPress, onFavoriteToggle }) => {
  const iconName = getFileIconName(file.type);
  const iconColor = colors.fileIcons[file.type] || colors.primary;
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(file)}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={32} color={iconColor} />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.fileDetails}>
            {formatFileSize(file.size)} • {file.lastModified.toLocaleDateString()}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={() => onFavoriteToggle(file)}
      >
        <Ionicons 
          name={file.isFavorite ? 'star' : 'star-outline'} 
          size={24} 
          color={file.isFavorite ? colors.warning : colors.textSecondary} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    marginBottom: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  fileName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileDetails: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  favoriteButton: {
    padding: 8,
  },
});

export default FileItem;