import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  ActivityIndicator, 
  Text, 
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { colors } from '../../styles/theme';
import { FileItem } from '../../types';

interface ComicViewerProps {
  file: FileItem;
//   onClose: () => void;
//   title?: string;
}

interface ComicPage {
  id: string;
  uri: string;
}

const { width, height } = Dimensions.get('window');

const ComicViewer: React.FC<ComicViewerProps> = ({ file}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState<ComicPage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    extractComicPages();
  }, [file.path]);

  const extractComicPages = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if file exists
      const fileInfo = await FileSystem.getInfoAsync(file.path);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }

      // In a real app, you would use a library to extract CBR/CBZ files
      // For this demo, we'll simulate loading comic pages
      
      // Simulate extraction delay
      setTimeout(() => {
        // Generate mock comic pages
        const mockPages: ComicPage[] = Array.from({ length: 20 }, (_, i) => ({
          id: `page-${i + 1}`,
          // Use placeholder images of different sizes to simulate comic pages
          uri: `https://picsum.photos/${800 + (i % 3) * 100}/${1200 + (i % 5) * 100}?random=${i}`,
        }));
        
        setPages(mockPages);
        setLoading(false);
      }, 1500);
      
      // Note: In a real app with the proper libraries, you would:
      // 1. Extract the CBR/CBZ archive to a temp directory
      // 2. Sort the image files (usually jpg/png)
      // 3. Create a list of file URIs to display
      
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Failed to open comic file');
      console.error('Error opening comic:', err);
    }
  };

  const handlePageChange = (index: number) => {
    if (index >= 0 && index < pages.length) {
      setCurrentPage(index);
      flatListRef.current?.scrollToIndex({ index, animated: true });
    }
  };

  const renderComicPage = ({ item, index }: { item: ComicPage; index: number }) => {
    return (
      <View style={styles.pageContainer}>
        <Image
          source={{ uri: item.uri }}
          style={styles.comicImage}
          resizeMode="contain"
        />
        <View style={styles.pageNumberContainer}>
          <Text style={styles.pageNumberText}>{index + 1} / {pages.length}</Text>
        </View>
      </View>
    );
  };

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentPage(viewableItems[0].index);
    }
  }).current;

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
            <Text style={styles.loadingText}>Loading comic...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color="#ff6b6b" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={extractComicPages}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={pages}
            renderItem={renderComicPage}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            initialNumToRender={1}
            maxToRenderPerBatch={2}
            windowSize={3}
          />
        )}
      </View>

      {!loading && !error && (
        <View style={styles.controls}>
          <TouchableOpacity 
            style={[styles.navButton, currentPage <= 0 && styles.disabledButton]} 
            onPress={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 0}
          >
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={currentPage <= 0 ? colors.textSecondary : colors.primary} 
            />
          </TouchableOpacity>
          
          <View style={styles.pageControls}>
            <TouchableOpacity 
              style={styles.thumbnailButton}
              onPress={() => {
                Alert.alert('Thumbnails', 'Thumbnail view would be shown here in a production app.');
              }}
            >
              <Ionicons name="grid" size={24} color={colors.primary} />
              <Text style={styles.thumbnailText}>Pages</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.fitButton}
              onPress={() => {
                Alert.alert('View Mode', 'Toggle between fit to width/height/screen in a production app.');
              }}
            >
              <Ionicons name="resize" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.navButton, currentPage >= pages.length - 1 && styles.disabledButton]} 
            onPress={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= pages.length - 1}
          >
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={currentPage >= pages.length - 1 ? colors.textSecondary : colors.primary} 
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
  pageContainer: {
    width,
    height: height - 112, // Subtract header and controls height
    justifyContent: 'center',
    alignItems: 'center',
  },
  comicImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  pageNumberContainer: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  pageNumberText: {
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
  thumbnailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginRight: 16,
  },
  thumbnailText: {
    color: colors.primary,
    marginLeft: 4,
  },
  fitButton: {
    padding: 8,
  },
});

export default ComicViewer;