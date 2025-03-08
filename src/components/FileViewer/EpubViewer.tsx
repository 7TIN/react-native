import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ActivityIndicator, 
  Text, 
  TouchableOpacity,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as WebBrowser from 'expo-web-browser';
import { colors } from '../../styles/theme';
import { FileItem } from '../../types';

interface EpubViewerProps {
  file: FileItem;
//   onClose: () => void;
//   title?: string;
}

const EpubViewer: React.FC<EpubViewerProps> = ({ file}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    openEpub();
  }, [file.path]);

  const openEpub = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if file exists
      const fileInfo = await FileSystem.getInfoAsync(file.path);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }
      setTimeout(() => {
        setLoading(false);
        setTotalPages(Math.floor(Math.random() * 200) + 50); 

        if (Platform.OS !== 'web') {
          WebBrowser.openBrowserAsync(`file://${file.path}`).catch(err => {
            console.error('Failed to open browser:', err);
            Alert.alert(
              'Viewer Not Available',
              'A proper EPUB viewer is not available in this demo. In a production app, you would integrate a native EPUB reader library.',
              [{ text: 'OK' }]
            );
          });
        }
      }, 1500);
    } catch (err: any) { 
      setLoading(false);
      setError(err.message || 'Failed to open EPUB file');
      console.error('Error opening EPUB:', err);
    }
  };

  const handlePageChange = (increment: number) => {
    const newPage = currentPage + increment;
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity> */}
        {/* <Text style={styles.headerTitle}>{title}</Text> */}
        <TouchableOpacity style={styles.optionsButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading EPUB...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color="#ff6b6b" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={openEpub}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.readerContainer}>
            <Text style={styles.infoText}>
              In a production app, the EPUB content would be displayed here using a proper EPUB reader library.
            </Text>
            
            <View style={styles.pageInfo}>
              <Text style={styles.pageText}>
                Page {currentPage} of {totalPages}
              </Text>
            </View>
          </View>
        )}
      </View>

      {!loading && !error && (
        <View style={styles.controls}>
          <TouchableOpacity 
            style={[styles.navButton, currentPage <= 1 && styles.disabledButton]} 
            onPress={() => handlePageChange(-1)}
            disabled={currentPage <= 1}
          >
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={currentPage <= 1 ? colors.textSecondary : colors.primary} 
            />
          </TouchableOpacity>
          
          <View style={styles.pageControls}>
            <TouchableOpacity style={styles.tocButton}>
              <Ionicons name="list" size={24} color={colors.primary} />
              <Text style={styles.tocText}>Contents</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.bookmarkButton}>
              <Ionicons name="bookmark-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.navButton, currentPage >= totalPages && styles.disabledButton]} 
            onPress={() => handlePageChange(1)}
            disabled={currentPage >= totalPages}
          >
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={currentPage >= totalPages ? colors.textSecondary : colors.primary} 
            />
          </TouchableOpacity>
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
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: colors.text,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  readerContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  infoText: {
    color: colors.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  pageInfo: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  pageText: {
    color: '#fff',
    fontSize: 14,
  },
  controls: {
    height: 56,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  navButton: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  pageControls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tocButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginRight: 16,
  },
  tocText: {
    color: colors.primary,
    marginLeft: 4,
  },
  bookmarkButton: {
    padding: 8,
  },
});

export default EpubViewer;