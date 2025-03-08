import { FileType, FileItem } from '../types';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { Platform } from 'react-native';
import { requestStoragePermission } from './permissions';

// Get file extension from path
export const getFileExtension = (path: string): string => {
  return path.split('.').pop()?.toLowerCase() || '';
};

// Get file type from extension
export const getFileType = (extension: string): FileType | null => {
  switch (extension) {
    case 'pdf':
      return 'pdf';
    case 'txt':
      return 'txt';
    case 'doc':
    case 'docx':
      return 'doc';
    case 'rtf':
      return 'rtf';
    case 'epub':
      return 'epub';
    case 'mobi':
      return 'mobi';
    case 'djvu':
      return 'djvu';
    case 'chm':
      return 'chm';
    case 'odt':
      return 'odt';
    case 'fb2':
      return 'fb2';
    case 'azw':
      return 'azw';
    case 'cbr':
      return 'cbr';
    case 'cbz':
      return 'cbz';
    case 'comic':
      return 'comic';
    default:
      return null;
  }
};

// Get MIME type for file picker
export const getMimeTypes = (): string[] => {
  return [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/rtf',
    'application/epub+zip',
    'application/x-mobipocket-ebook',
    'image/vnd.djvu',
    'application/vnd.ms-htmlhelp',
    'application/vnd.oasis.opendocument.text',
    'application/x-fictionbook+xml',
    'application/vnd.amazon.ebook',
    'application/x-cbr',
    'application/x-cbz',
    'application/x-comic-book-archive',
  ];
};

// Pick a document from device
export const pickDocument = async (): Promise<FileItem | null> => {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
        console.warn('Permission denied. Cannot pick a file.');
        return null;
      }
    const result = await DocumentPicker.getDocumentAsync({
      type: getMimeTypes(),
      copyToCacheDirectory: true,
    });
    
    if (result.canceled) {
      return null;
    }
    
    const file = result.assets[0];
    const extension = getFileExtension(file.name);
    const fileType = getFileType(extension);
    
    if (!fileType) {
      throw new Error('Unsupported file type');
    }
    
    return {
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      path: file.uri,
      type: fileType,
      size: file.size || 0,
      lastModified: new Date(),
    };
  } catch (error) {
    console.error('Error picking document:', error);
    return null;
  }
};

// Get file info
export const getFileInfo = async (path: string): Promise<Partial<FileItem> | null> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(path);
    if (!fileInfo.exists) {
      return null;
    }
    
    return {
      size: fileInfo.size || 0,
      lastModified: fileInfo.modificationTime 
        ? new Date(fileInfo.modificationTime * 1000) 
        : new Date(),
    };
  } catch (error) {
    console.error('Error getting file info:', error);
    return null;
  }
};

// Get icon name for file type
export const getFileIconName = (fileType: FileType): string => {
  switch (fileType) {
    case 'pdf':
      return 'document-text';
    case 'txt':
      return 'document';
    case 'doc':
    case 'docx':
      return 'document-text';
    case 'rtf':
      return 'document-text';
    case 'epub':
    case 'mobi':
    case 'azw':
    case 'fb2':
      return 'book';
    case 'djvu':
    case 'chm':
      return 'document';
    case 'odt':
      return 'document-text';
    case 'comic':
    case 'cbr':
    case 'cbz':
      return 'image';
    default:
      return 'document';
  }
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};