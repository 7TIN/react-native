import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FileItem } from '../../types';
import PDFViewer from './PDFViewer';
import TextViewer from './TextViewer';
import DocViewer from './DocViewer';
import EpubViewer from './EpubViewer';
import ComicViewer from './ComicViewer';
import { colors } from '../../styles/theme';

interface FileViewerProps {
  file: FileItem;
}

const FileViewer: React.FC<FileViewerProps> = ({ file }) => {
  // Render appropriate viewer based on file type
  const renderViewer = () => {
    switch (file.type) {
      case 'pdf':
        return <PDFViewer file={file} />;
        
      case 'txt':
      case 'rtf':
        return <TextViewer file={file} />;
        
      case 'doc':
      case 'docx':
      case 'odt':
        return <DocViewer file={file} />;
        
      case 'epub':
      case 'mobi':
      case 'fb2':
      case 'azw':
        return <EpubViewer file={file} />;
        
      case 'comic':
      case 'cbr':
      case 'cbz':
        return <ComicViewer file={file} />;
        
      default:
        return (
          <View style={styles.unsupportedContainer}>
            <Text style={styles.unsupportedText}>
              Unsupported file format: {file.type}
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderViewer()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  unsupportedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  unsupportedText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default FileViewer;