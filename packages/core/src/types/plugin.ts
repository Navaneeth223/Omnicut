/**
 * Plugin System Types
 * Extensibility and plugin architecture
 */

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  icon?: string;
  category: 'effect' | 'transition' | 'export' | 'import' | 'tool' | 'ai' | 'utility';
  enabled: boolean;
  installed: boolean;
  installedAt?: Date;
  updatedAt?: Date;
}

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  homepage?: string;
  repository?: string;
  license: string;
  keywords: string[];
  category: Plugin['category'];
  main: string;
  dependencies?: Record<string, string>;
  permissions: PluginPermission[];
}

export type PluginPermission =
  | 'read:project'
  | 'write:project'
  | 'read:media'
  | 'write:media'
  | 'network'
  | 'filesystem'
  | 'clipboard'
  | 'notifications';

export interface PluginAPI {
  // Project access
  getProject: () => any;
  updateProject: (data: any) => void;
  
  // Timeline access
  getTimeline: () => any;
  addClip: (clip: any) => void;
  removeClip: (clipId: string) => void;
  
  // Media access
  getMediaPool: () => any;
  addMedia: (media: any) => void;
  
  // Effects
  registerEffect: (effect: any) => void;
  registerTransition: (transition: any) => void;
  
  // Export
  registerExporter: (exporter: any) => void;
  
  // UI
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
  showDialog: (dialog: any) => void;
  
  // Events
  on: (event: string, handler: Function) => void;
  off: (event: string, handler: Function) => void;
  emit: (event: string, data: any) => void;
}

export interface PluginContext {
  plugin: Plugin;
  api: PluginAPI;
  config: Record<string, any>;
}

export interface PluginHook {
  name: string;
  handler: (context: PluginContext, ...args: any[]) => any;
}

export interface PluginEffect {
  id: string;
  name: string;
  description: string;
  parameters: PluginParameter[];
  apply: (input: any, parameters: Record<string, any>) => any;
}

export interface PluginParameter {
  id: string;
  name: string;
  type: 'number' | 'string' | 'boolean' | 'color' | 'select';
  default: any;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ label: string; value: any }>;
}

export interface PluginMarketplace {
  id: string;
  name: string;
  url: string;
  plugins: PluginListing[];
}

export interface PluginListing {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  icon?: string;
  category: Plugin['category'];
  downloads: number;
  rating: number;
  reviews: number;
  price: number; // 0 for free
  featured: boolean;
  verified: boolean;
}
