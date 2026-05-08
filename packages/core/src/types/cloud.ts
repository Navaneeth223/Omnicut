/**
 * Cloud Sync Types
 * Cloud storage and synchronization
 */

export interface CloudProvider {
  id: string;
  name: string;
  type: 'google-drive' | 'dropbox' | 'onedrive' | 's3' | 'custom';
  connected: boolean;
  email?: string;
  quota?: {
    used: number;
    total: number;
  };
}

export interface CloudFile {
  id: string;
  name: string;
  path: string;
  size: number;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
  syncedAt?: Date;
  hash: string;
  provider: string;
}

export interface SyncStatus {
  projectId: string;
  status: 'idle' | 'syncing' | 'error' | 'conflict';
  lastSyncAt?: Date;
  pendingChanges: number;
  error?: string;
}

export interface SyncConflict {
  id: string;
  projectId: string;
  localVersion: any;
  remoteVersion: any;
  timestamp: Date;
  resolved: boolean;
}

export interface SyncSettings {
  enabled: boolean;
  autoSync: boolean;
  syncInterval: number; // milliseconds
  provider: string;
  path: string;
  conflictResolution: 'local' | 'remote' | 'manual';
}

export interface CloudBackup {
  id: string;
  projectId: string;
  name: string;
  size: number;
  createdAt: Date;
  provider: string;
  path: string;
  automatic: boolean;
}

export interface SyncQueue {
  id: string;
  projectId: string;
  operation: 'upload' | 'download' | 'delete';
  file: CloudFile;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  error?: string;
  createdAt: Date;
}
