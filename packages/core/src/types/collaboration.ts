/**
 * Collaboration Types
 * Real-time collaboration and sharing
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  color: string;
  role: 'owner' | 'editor' | 'viewer';
}

export interface CollaborationSession {
  id: string;
  projectId: string;
  users: User[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface CollaborationCursor {
  userId: string;
  position: {
    x: number;
    y: number;
  };
  timestamp: Date;
}

export interface CollaborationSelection {
  userId: string;
  clipId?: string;
  trackId?: string;
  timestamp: Date;
}

export interface CollaborationComment {
  id: string;
  userId: string;
  projectId: string;
  clipId?: string;
  timestamp: number;
  content: string;
  resolved: boolean;
  createdAt: Date;
  updatedAt: Date;
  replies: CollaborationComment[];
}

export interface CollaborationChange {
  id: string;
  userId: string;
  type: 'add' | 'update' | 'delete';
  entity: 'clip' | 'track' | 'effect' | 'transition';
  entityId: string;
  data: any;
  timestamp: Date;
}

export interface ShareSettings {
  projectId: string;
  shareLink: string;
  expiresAt?: Date;
  password?: string;
  allowComments: boolean;
  allowEditing: boolean;
  allowDownload: boolean;
}

export interface ProjectPermissions {
  userId: string;
  projectId: string;
  canView: boolean;
  canEdit: boolean;
  canComment: boolean;
  canShare: boolean;
  canDelete: boolean;
}
