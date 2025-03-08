import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';
import { FileItem } from '../../types';
import { colors } from '../../styles/theme';

interface PDFViewerProps {
  file: FileItem;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const source = { uri: file.path, cache: true };
  const { width, height } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading PDF...</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      <Pdf
        source={source}
        onLoadComplete={(numberOfPages, filePath) => {
          setLoading(false);
          setTotalPages(numberOfPages);
        }}
        onPageChanged={(page) => {
          setCurrentPage(page);
        }}
        onError={(error) => {
          setLoading(false);
          setError(`Cannot load PDF: ${(error as any).message}`);
        }}
        onPressLink={(uri) => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}
        enablePaging={true}
        horizontal={false}
      />
      
      {!loading && !error && (
        <View style={styles.pageIndicator}>
          <Text style={styles.pageText}>
            {currentPage} / {totalPages}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    zIndex: 1,
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
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  pageIndicator: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pageText: {
    color: colors.text,
    fontSize: 14,
  },
});

export default PDFViewer;