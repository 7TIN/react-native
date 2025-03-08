import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';

export const requestStoragePermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'ios') {
      // iOS doesn't need explicit permission for document picker
      return true;
    }
    
    // For Android, we need to request media library permissions
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting permissions:', error);
    return false;
  }
};

export const createAppDirectories = async (): Promise<void> => {
  try {
    const documentsDir = FileSystem.documentDirectory;
    
    if (!documentsDir) {
      throw new Error('Documents directory not available');
    }
    
    // Create directories for different file types
    const directories = [
      'Documents',
      'Books',
      'Comics',
      'Downloads',
    ];
    
    for (const dir of directories) {
      const dirPath = `${documentsDir}${dir}`;
      const dirInfo = await FileSystem.getInfoAsync(dirPath);
      
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });
      }
    }
  } catch (error) {
    console.error('Error creating app directories:', error);
  }
};