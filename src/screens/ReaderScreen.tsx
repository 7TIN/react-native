// In ReaderScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import FileViewer from '../components/FileViewer';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FileItem, FileType } from '../types';

const ReaderScreen = () => {
    
  const navigation = useNavigation();
  const route = useRoute();
  const { fileId, filePath, fileName, fileType, fileSize, fileLastModified, isFavorite } = route.params as {
    fileId?: string;
    filePath: string;
    fileName: string;
    fileType: string;
    fileSize?: number;
    fileLastModified?: string;
    isFavorite?: boolean;
  };
  const validFileTypes: FileType[] = [
    'pdf', 'txt', 'rtf', 'doc', 'docx', 'odt', 'epub', 'mobi', 'fb2', 'azw', 'comic', 'cbr', 'cbz'
  ];

  const file: FileItem = {
    id: fileId ?? new Date().getTime().toString(),
    path: filePath,
    name: fileName,
    type: validFileTypes.includes(fileType as FileType) ? (fileType as FileType) : 'txt',
    size: fileSize ?? 0,
    lastModified: fileLastModified ? new Date(fileLastModified) : new Date(),
    isFavorite: isFavorite ?? false,
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const handleError = (error: string) => {
    console.error('File viewer error:', error);
    // You could show a toast or alert here
  };
//   const file: FileItem = {
//     id: Math.random().toString(36).substring(2, 9),
//     name: fileName,
//     path: filePath,
//     type: fileType,
//     size: 0, // You might need to fetch this dynamically
//     lastModified: new Date(),
//     isFavorite: false, // Default to false
//   };

  return (
    <View style={styles.container}>
      <FileViewer file={file} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ReaderScreen;