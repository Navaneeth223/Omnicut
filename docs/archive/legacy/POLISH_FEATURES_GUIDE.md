# 🎨 Polish Features - Developer Guide

**Quick reference for using toast notifications, error boundaries, keyboard shortcuts, and loading components**

---

## 🔔 Toast Notifications

### Import
```typescript
import { useToast } from './hooks/useToast';
```

### Usage
```typescript
function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('Operation completed!');
  };

  const handleError = () => {
    toast.error('Operation failed');
  };

  const handleWarning = () => {
    toast.warning('Please check your input');
  };

  const handleInfo = () => {
    toast.info('Processing your request...');
  };

  return (
    <button onClick={handleSuccess}>Show Toast</button>
  );
}
```

### Custom Duration
```typescript
// Default: 3000ms (3 seconds)
toast.success('Quick message', 2000);  // 2 seconds
toast.error('Important error', 5000);  // 5 seconds
```

### Use Cases
- ✅ Export success/failure
- ✅ Media import feedback
- ✅ AI generation feedback
- ✅ Effect application feedback
- ✅ Save/load operations
- ✅ Network request feedback

---

## 🛡️ Error Boundary

### Import
```typescript
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
```

### Usage - Wrap Components
```typescript
function MyWorkspace() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

### Usage - Custom Fallback
```typescript
<ErrorBoundary
  fallback={
    <div>
      <h2>Oops! Something went wrong</h2>
      <button onClick={() => window.location.reload()}>
        Reload
      </button>
    </div>
  }
>
  <MyComponent />
</ErrorBoundary>
```

### Use Cases
- ✅ Wrap entire workspace
- ✅ Wrap complex components
- ✅ Wrap third-party components
- ✅ Wrap async data components
- ✅ Wrap experimental features

---

## ⌨️ Keyboard Shortcuts

### Already Integrated
- Press `?` key anytime to see all shortcuts
- No additional code needed

### Add Custom Shortcuts
```typescript
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    // Ctrl+K for custom action
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      handleCustomAction();
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

### Available Shortcuts
- **General**: Ctrl+S, Ctrl+Z, Ctrl+Shift+Z, Ctrl+E, ?
- **Playback**: Space, Home, End, ←, →, J, K, L
- **Timeline**: V, C, H, Ctrl+C, Ctrl+V, Ctrl+D, Delete, +, -
- **Workspaces**: Ctrl+1 through Ctrl+8

---

## ⏳ Loading Components

### Import
```typescript
import {
  Spinner,
  LoadingOverlay,
  SkeletonText,
  SkeletonCard,
  LoadingDots,
} from './components/Loading/Loading';
```

### 1. Spinner
```typescript
// Small spinner (16px)
<Spinner size="small" />

// Medium spinner (32px) - default
<Spinner size="medium" />

// Large spinner (48px)
<Spinner size="large" />
```

**Use Cases**: Inline loading, button loading, small operations

### 2. Loading Overlay
```typescript
// Full-screen overlay with message
{isLoading && (
  <LoadingOverlay message="Generating image..." />
)}

// Without message
{isLoading && <LoadingOverlay />}
```

**Use Cases**: AI generation, export, long operations

### 3. Skeleton Text
```typescript
// Default width (100%)
<SkeletonText />

// Custom width
<SkeletonText width="80%" />
<SkeletonText width="200px" />
```

**Use Cases**: Loading text content, placeholders

### 4. Skeleton Card
```typescript
// Default card placeholder
<SkeletonCard />
```

**Use Cases**: Loading media items, thumbnails, cards

### 5. Loading Dots
```typescript
// Animated dots (...)
<LoadingDots />
```

**Use Cases**: Inline loading text, processing indicators

---

## 📋 Common Patterns

### Pattern 1: AI Generation with Feedback
```typescript
function AIImageGenerator() {
  const toast = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    toast.info('Generating image...');

    try {
      const result = await generateImage(prompt);
      toast.success('Image generated successfully!');
      setImage(result);
    } catch (error) {
      toast.error('Failed to generate image');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={isGenerating}>
        {isGenerating ? <Spinner size="small" /> : 'Generate'}
      </button>
      {isGenerating && (
        <LoadingOverlay message="Generating image..." />
      )}
    </div>
  );
}
```

### Pattern 2: Export with Progress
```typescript
function ExportDialog() {
  const toast = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    toast.info('Starting export...');

    try {
      await exportVideo(settings);
      toast.success('Video exported successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to export video');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <button onClick={handleExport} disabled={isExporting}>
        {isExporting ? (
          <>
            <Spinner size="small" />
            <span>Exporting...</span>
          </>
        ) : (
          'Export'
        )}
      </button>
      {isExporting && (
        <LoadingOverlay message="Exporting video..." />
      )}
    </div>
  );
}
```

### Pattern 3: Media Import with Feedback
```typescript
function MediaPool() {
  const toast = useToast();
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async (files: FileList) => {
    setIsImporting(true);
    toast.info(`Importing ${files.length} files...`);

    try {
      await importFiles(files);
      toast.success(`Imported ${files.length} files successfully!`);
    } catch (error) {
      toast.error('Failed to import files');
      console.error(error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div>
      {isImporting && <Spinner size="medium" />}
      <input
        type="file"
        multiple
        onChange={(e) => e.target.files && handleImport(e.target.files)}
      />
    </div>
  );
}
```

### Pattern 4: Error Boundary with Toast
```typescript
function MyWorkspace() {
  const toast = useToast();

  useEffect(() => {
    // Listen for errors
    const handleError = (event: ErrorEvent) => {
      toast.error('An error occurred');
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [toast]);

  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

### Pattern 5: Loading Skeleton
```typescript
function MediaGrid() {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadItems().then((data) => {
      setItems(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="media-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="media-grid">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  );
}
```

---

## 🎯 Best Practices

### Toast Notifications
- ✅ Use success for completed actions
- ✅ Use error for failures
- ✅ Use warning for validation issues
- ✅ Use info for ongoing processes
- ✅ Keep messages short and clear
- ✅ Use custom duration for important messages
- ❌ Don't spam toasts (combine related messages)
- ❌ Don't use for every minor action

### Error Boundaries
- ✅ Wrap entire workspaces
- ✅ Wrap complex components
- ✅ Provide custom fallback UI when needed
- ✅ Log errors for debugging
- ❌ Don't wrap every small component
- ❌ Don't hide errors in production (show user-friendly message)

### Loading States
- ✅ Show loading immediately when action starts
- ✅ Use appropriate loading component for context
- ✅ Provide meaningful loading messages
- ✅ Hide loading when action completes
- ✅ Show error state if loading fails
- ❌ Don't show loading for instant operations
- ❌ Don't forget to hide loading on error

### Keyboard Shortcuts
- ✅ Use standard shortcuts (Ctrl+S, Ctrl+Z, etc.)
- ✅ Prevent default browser behavior
- ✅ Check for modifier keys (Ctrl, Shift, Alt)
- ✅ Document custom shortcuts
- ❌ Don't override browser shortcuts
- ❌ Don't use single letters without modifiers

---

## 🔧 Troubleshooting

### Toast Not Showing
```typescript
// Make sure ToastContainer is rendered in App.tsx
<ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />

// Make sure you're using the hook
const toast = useToast();
```

### Error Boundary Not Catching
```typescript
// Error boundaries only catch errors in:
// - Render methods
// - Lifecycle methods
// - Constructors

// They DON'T catch errors in:
// - Event handlers (use try/catch)
// - Async code (use try/catch)
// - Server-side rendering
```

### Loading Component Not Visible
```typescript
// Make sure component is conditionally rendered
{isLoading && <LoadingOverlay />}

// Check z-index for overlay
.loading-overlay {
  z-index: 9999;
}
```

### Keyboard Shortcut Not Working
```typescript
// Check for event.preventDefault()
if (e.key === '?') {
  e.preventDefault();  // Important!
  setShowDialog(true);
}

// Check for modifier keys
if (e.ctrlKey && e.key === 's') {
  e.preventDefault();
  handleSave();
}
```

---

## 📚 Additional Resources

### Documentation
- `SESSION_21_POLISH_COMPLETE.md` - Component details
- `SESSION_21_INTEGRATION_COMPLETE.md` - Integration guide
- `WHATS_NEW_SESSION_21.md` - Feature overview
- `README.md` - Complete project documentation

### Component Files
- `apps/web/src/components/Toast/Toast.tsx`
- `apps/web/src/components/Loading/Loading.tsx`
- `apps/web/src/components/ErrorBoundary/ErrorBoundary.tsx`
- `apps/web/src/components/KeyboardShortcuts/KeyboardShortcutsDialog.tsx`
- `apps/web/src/hooks/useToast.ts`

---

## 🎉 Quick Start Checklist

### Add Toast Notifications
- [ ] Import `useToast` hook
- [ ] Call `toast.success()` / `toast.error()` / etc.
- [ ] Test with user actions

### Add Loading States
- [ ] Import loading component
- [ ] Add loading state variable
- [ ] Show loading during async operations
- [ ] Hide loading when complete

### Add Error Boundary
- [ ] Import `ErrorBoundary` component
- [ ] Wrap your component
- [ ] Test error handling

### Add Keyboard Shortcuts
- [ ] Add keyboard event listener
- [ ] Check for key combination
- [ ] Prevent default behavior
- [ ] Document in shortcuts dialog

---

**Ready to polish your workspace!** 🚀

