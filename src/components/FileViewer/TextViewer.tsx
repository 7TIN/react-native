import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { FileItem } from '../../types';
import { colors } from '../../styles/theme';

interface TextViewerProps {
  file: FileItem;
}

const TextViewer: React.FC<TextViewerProps> = ({ file }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTextFile = async () => {
      try {
        setLoading(true);
        
        // Read the file content
        const fileContent = await FileSystem.readAsStringAsync(file.path);
        setContent(fileContent);
        setLoading(false);
      } catch (err) {
        console.error('Error reading text file:', err);
        setError('Failed to load text file');
        setLoading(false);
      }
    };

    loadTextFile();
  }, [file]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading text file...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.textContent}>{content}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  textContent: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.text,
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
  },
});

export default TextViewer;