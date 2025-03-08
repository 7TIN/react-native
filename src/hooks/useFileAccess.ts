import { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FileItem, FolderItem } from '../src/types';
import { getFileExtension, getFileType } from '../src/utils/fileUtils';

const RECENT_FILES_KEY = 'recentFiles';
const FAVORITE_FILES_KEY = 'favoriteFiles';

export const useFileAccess = () => {
  const [recentFiles, setRecentFiles] = useState<FileItem[]>([]);
  const [favoriteFiles, setFavoriteFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load saved files from AsyncStorage
  const loadSavedFiles = async () => {
    try {
      setLoading(true);
      
      // Load recent files
      const recentFilesJson = await AsyncStorage.getItem(RECENT_FILES_KEY);
      if (recentFilesJson) {
        const files = JSON.parse(recentFilesJson) as FileItem[];
        // Convert string dates back to Date objects
        const parsedFiles = files.map(file => ({
          ...file,
          lastModified: new Date(file.lastModified)
        }));
        setRecentFiles(parsedFiles);
      }
      
      // Load favorite files
      const favoriteFilesJson = await AsyncStorage.getItem(FAVORITE_FILES_KEY);
      if (favoriteFilesJson) {
        const files = JSON.parse(favoriteFilesJson) as FileItem[];
        // Convert string dates back to Date objects
        const parsedFiles = files.map(file => ({
          ...file,
          lastModified: new Date(file.lastModified)
        }));
        setFavoriteFiles(parsedFiles);
      }
      
      // Load folders
      await loadFolders();
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading saved files:', err);
      setError('Failed to load saved files');
      setLoading(false);
    }
  };

  // Load folders from app directory
  const loadFolders = async () => {
    try {
      const documentsDir = FileSystem.documentDirectory;
      if (!documentsDir) {
        throw new Error('Documents directory not available');
      }
      
      const foldersList: FolderItem[] = [];
      
      // Default folders
      const defaultFolders = ['Documents', 'Books', 'Comics', 'Downloads'];
      
      for (const folder of defaultFolders) {
        const folderPath = `${documentsDir}${folder}`;
        const folderInfo = await FileSystem.getInfoAsync(folderPath);
        
        if (folderInfo.exists) {
          const contents = await FileSystem.readDirectoryAsync(folderPath);
          foldersList.push({
            id: folder.toLowerCase(),
            name: folder,
            path: folderPath,
            itemCount: contents.length,
          });
        }
      }
      
      setFolders(foldersList);
    } catch (err) {
      console.error('Error loading folders:', err);
      setError('Failed to load folders');
    }
  };

  // Add a file to recent files
  const addRecentFile = async (file: FileItem) => {
    try {
      // Remove if already exists to avoid duplicates
      const updatedRecentFiles = recentFiles.filter(f => f.path !== file.path);
      
      // Add to beginning of array (most recent)
      const newRecentFiles = [file, ...updatedRecentFiles].slice(0, 20); // Keep only 20 most recent
      
      setRecentFiles(newRecentFiles);
      await AsyncStorage.setItem(RECENT_FILES_KEY, JSON.stringify(newRecentFiles));
    } catch (err) {
      console.error('Error adding recent file:', err);
      setError('Failed to add file to recent list');
    }
  };

  // Toggle favorite status for a file
  const toggleFavorite = async (file: FileItem) => {
    try {
      const isFavorite = favoriteFiles.some(f => f.path === file.path);
      
      let newFavoriteFiles: FileItem[];
      
      if (isFavorite) {
        // Remove from favorites
        newFavoriteFiles = favoriteFiles.filter(f => f.path !== file.path);
      } else {
        // Add to favorites
        newFavoriteFiles = [...favoriteFiles, { ...file, isFavorite: true }];
      }
      
      setFavoriteFiles(newFavoriteFiles);
      await AsyncStorage.setItem(FAVORITE_FILES_KEY, JSON.stringify(newFavoriteFiles));
      
      // Update in recent files too
      const updatedRecentFiles = recentFiles.map(f => 
        f.path === file.path ? { ...f, isFavorite: !isFavorite } : f
      );
      setRecentFiles(updatedRecentFiles);
      await AsyncStorage.setItem(RECENT_FILES_KEY, JSON.stringify(updatedRecentFiles));
      
      return !isFavorite;
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError('Failed to update favorite status');
      return false;
    }
  };

  // Get files from a specific folder
  const getFilesFromFolder = async (folderPath: string): Promise<FileItem[]> => {
    try {
      const files = await FileSystem.readDirectoryAsync(folderPath);
      
      const fileItems: FileItem[] = [];
      
      for (const fileName of files) {
        const filePath = `${folderPath}/${fileName}`;
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        
        // if (fileInfo.isDirectory) continue;
        if (fileInfo.exists && !fileInfo.isDirectory) {
        const extension = getFileExtension(fileName);
        const fileType = getFileType(extension);
        
        if (fileType) {
          const isFavorite = favoriteFiles.some(f => f.path === filePath);
          
          fileItems.push({
            id: Math.random().toString(36).substring(2, 9),
            name: fileName,
            path: filePath,
            type: fileType,
            size: fileInfo.size || 0,
            lastModified: fileInfo.modificationTime 
              ? new Date(fileInfo.modificationTime * 1000) 
              : new Date(),
            isFavorite,
          });
        }
      }
    }
      
      return fileItems;
    } catch (err) {
      console.error('Error getting files from folder:', err);
      setError('Failed to load files from folder');
      return [];
    }
  };

  // Initialize
  useEffect(() => {
    loadSavedFiles();
  }, []);

  return {
    recentFiles,
    favoriteFiles,
    folders,
    loading,
    error,
    addRecentFile,
    toggleFavorite,
    getFilesFromFolder,
    refreshFolders: loadFolders,
  };
};