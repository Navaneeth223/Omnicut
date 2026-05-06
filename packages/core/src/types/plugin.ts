/**
 * Plugin system types
 * @module types/plugin
 */

/**
 * Plugin state in a project
 */
export interface PluginState {
  /** Plugin identifier */
  pluginId: string;
  /** Whether plugin is enabled */
  enabled: boolean;
  /** Plugin-specific state data */
  state: Record<string, unknown>;
}

/**
 * Plugin manifest
 */
export interface OmniCutPlugin {
  /** Unique plugin identifier (reverse-domain notation) */
  id: string;
  /** Plugin name */
  name: string;
  /** Plugin version (semver) */
  version: string;
  /** Plugin description */
  description: string;
  /** Plugin author */
  author: string;
  /** Plugin license */
  license: string;
  /** Plugin icon (URL or base64) */
  icon?: string;
  /** Plugin category */
  category: PluginCategory;
  /** Required permissions */
  permissions: PluginPermission[];
  /** Entry point file path */
  entry: string;
  /** UI configuration */
  ui?: PluginUIConfig;
  /** Minimum OmniCut version required */
  minVersion?: string;
  /** Plugin homepage URL */
  homepage?: string;
  /** Plugin repository URL */
  repository?: string;
}

/**
 * Plugin categories
 */
export type PluginCategory =
  | 'video_effect'
  | 'audio_effect'
  | 'transition'
  | 'generator'
  | 'export'
  | 'import'
  | 'tool'
  | 'panel'
  | 'workflow';

/**
 * Plugin permissions
 */
export type PluginPermission =
  | 'timeline.read'
  | 'timeline.write'
  | 'media.read'
  | 'media.write'
  | 'effects.read'
  | 'effects.write'
  | 'filesystem.read'
  | 'filesystem.write'
  | 'network'
  | 'clipboard';

/**
 * Plugin UI configuration
 */
export interface PluginUIConfig {
  /** Panel configuration (if plugin adds a panel) */
  panel?: {
    title: string;
    icon?: string;
    defaultPosition: 'left' | 'right' | 'bottom';
    defaultSize: { width: number; height: number };
  };
  /** Menu items to add */
  menuItems?: PluginMenuItem[];
  /** Toolbar items to add */
  toolbarItems?: PluginToolbarItem[];
}

/**
 * Plugin menu item
 */
export interface PluginMenuItem {
  /** Menu path (e.g., 'File/Export/My Plugin') */
  path: string;
  /** Menu item label */
  label: string;
  /** Keyboard shortcut */
  shortcut?: string;
  /** Command to execute */
  command: string;
}

/**
 * Plugin toolbar item
 */
export interface PluginToolbarItem {
  /** Toolbar identifier */
  toolbar: string;
  /** Item icon */
  icon: string;
  /** Item tooltip */
  tooltip: string;
  /** Command to execute */
  command: string;
}

/**
 * Effect definition from plugin
 */
export interface EffectDefinition {
  /** Effect type identifier */
  type: string;
  /** Effect name */
  name: string;
  /** Effect category */
  category: string;
  /** Effect parameters */
  parameters: EffectParameterDefinition[];
  /** Render function */
  render: (input: EffectRenderInput) => EffectRenderOutput;
}

/**
 * Effect parameter definition
 */
export interface EffectParameterDefinition {
  /** Parameter identifier */
  id: string;
  /** Parameter name */
  name: string;
  /** Parameter type */
  type: 'number' | 'slider' | 'color' | 'boolean' | 'choice' | 'text';
  /** Default value */
  defaultValue: unknown;
  /** Minimum value (for numeric types) */
  min?: number;
  /** Maximum value (for numeric types) */
  max?: number;
  /** Available options (for choice type) */
  options?: Array<{ label: string; value: unknown }>;
}

/**
 * Effect render input
 */
export interface EffectRenderInput {
  /** Input frame (ImageData or video frame) */
  frame: ImageData | VideoFrame;
  /** Effect parameters */
  parameters: Record<string, unknown>;
  /** Current time in seconds */
  time: number;
  /** Frame rate */
  frameRate: number;
}

/**
 * Effect render output
 */
export interface EffectRenderOutput {
  /** Output frame */
  frame: ImageData | VideoFrame;
}

/**
 * Panel definition from plugin
 */
export interface PanelDefinition {
  /** Panel identifier */
  id: string;
  /** Panel title */
  title: string;
  /** Panel icon */
  icon?: string;
  /** Panel component (React component) */
  component: unknown; // React.ComponentType
}

/**
 * Renderer definition from plugin
 */
export interface RendererDefinition {
  /** Renderer identifier */
  id: string;
  /** Renderer name */
  name: string;
  /** Supported formats */
  formats: string[];
  /** Render function */
  render: (input: RenderInput) => Promise<RenderOutput>;
}

/**
 * Render input
 */
export interface RenderInput {
  /** Timeline data */
  timeline: unknown;
  /** Output settings */
  settings: unknown;
  /** Progress callback */
  onProgress: (progress: number) => void;
}

/**
 * Render output
 */
export interface RenderOutput {
  /** Output file path */
  path: string;
  /** File size in bytes */
  size: number;
}

/**
 * Processing job
 */
export interface ProcessingJob {
  /** Job type */
  type: string;
  /** Job input data */
  input: unknown;
  /** Job options */
  options?: Record<string, unknown>;
}

/**
 * Job status
 */
export interface JobStatus {
  /** Job identifier */
  id: string;
  /** Job status */
  status: 'queued' | 'processing' | 'completed' | 'failed';
  /** Progress (0-1) */
  progress: number;
  /** Error message (if failed) */
  error?: string;
  /** Result data (if completed) */
  result?: unknown;
}
