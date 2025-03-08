export interface DrawerItem {
    id: string;
    title: string;
    icon: string;
  }
export type FileType = | 'pdf' | 'txt' | 'doc' | 'docx' | 'rtf' | 'epub' | 'mobi' | 'djvu' | 'chm' | 'odt' | 'fb2' | 'azw' 
  | 'comic' | 'cbr' | 'cbz';

export interface FileItem {
  id: string;
  name: string;
  path: string;
  type: FileType;
  size: number;
  lastModified: Date;
  isFavorite?: boolean;
}

export interface FolderItem {
  id: string;
  name: string;
  path: string;
  itemCount: number;
}

export type DrawerItemType = 'all' | 'recent' | 'favorites' | 'folder';

// export interface DrawerItem {
//   id: string;
//   title: string;
//   icon: string;
//   type: DrawerItemType;
//   path?: string;
// }
