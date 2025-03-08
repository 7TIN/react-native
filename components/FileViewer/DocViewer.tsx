import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { FileItem } from '../../types';
import { colors } from '../../styles/theme';
import { WebViewSource } from 'react-native-webview/lib/WebViewTypes';

interface DocViewerProps {
  file: FileItem;
}

const DocViewer: React.FC<DocViewerProps> = ({ file }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // For Office documents, we'll use Google Docs Viewer or Microsoft Office Online
  const viewerUrl = Platform.select({
    ios: `https://docs.google.com/viewer?url=${encodeURIComponent(file.path)}&embedded=true`,
    android: `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(file.path)}`,
  });

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading document...</Text>
        </View>
      )}
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <WebView
          source={{ uri: viewerUrl } as WebViewSource}
          style={styles.webView}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError('Failed to load document. Please check if the file is valid.');
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  webView: {
    flex: 1,
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
});

export default DocViewer;