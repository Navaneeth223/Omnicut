# OmniCut - Quick Start Guide 🚀

## Getting Started in 5 Minutes

### Step 1: Open the Application
The dev server is already running! Open your browser and go to:
```
http://localhost:5173/
```

You should see the OmniCut video editor interface with three panels:
- **Left**: Media Pool
- **Center**: Video Viewer + Timeline
- **Right**: Effects/Transitions

---

### Step 2: Import Your First Video

**Option A: Click Import**
1. Click the **📁 Import Media** button in the Media Pool (left panel)
2. Select video, audio, or image files from your computer
3. Wait for files to import (thumbnails will be generated)

**Option B: Drag & Drop**
1. Drag files from your file explorer
2. Drop them into the Media Pool area
3. Files will be imported automatically

**Supported Formats:**
- Video: MP4, WebM, MOV, AVI, MKV
- Audio: MP3, WAV, AAC, OGG
- Images: JPG, PNG, GIF, WebP

---

### Step 3: Add Clips to Timeline

1. **Drag** a media item from the Media Pool
2. **Drop** it onto a track in the Timeline (bottom center)
3. The clip will appear on the timeline

**Tips:**
- Video files go on **blue tracks** (Video 1, Video 2)
- Audio files go on **green tracks** (Audio 1, Audio 2)
- Clips will **snap** to the grid and other clips
- **Resize** clips by dragging the edges
- **Move** clips by dragging them

---

### Step 4: Play Your Video

**Using Mouse:**
- Click the **▶️ Play** button in the viewer controls
- Click the **⏸️ Pause** button to stop

**Using Keyboard:**
- Press **Space** to play/pause
- Press **←** to go back one frame
- Press **→** to go forward one frame
- Press **Home** to go to the start
- Press **End** to go to the end

**Scrubbing:**
- Click anywhere on the **timeline ruler** to jump to that time
- Drag the **playhead** (red line) to scrub through the video

---

### Step 5: Apply Effects

1. **Select** a clip on the timeline (click it)
2. Click the **Effects** tab in the right panel
3. **Click** an effect to apply it (e.g., "Brightness/Contrast")
4. **Adjust** the effect parameters with the sliders
5. See the effect in **real-time** in the viewer

**Available Effects:**
- 🌟 Brightness/Contrast
- 🎨 Hue/Saturation
- ☀️ Exposure
- 🌫️ Gaussian Blur
- ✨ Sharpen
- 🎭 Vignette
- 💫 Glow
- 📽️ Film Grain
- 🔄 Transform (Scale/Rotate)
- ✂️ Crop

**Effect Controls:**
- **Slider**: Adjust parameter value
- **👁️ Eye icon**: Enable/disable effect
- **↺ Reset**: Reset parameter to default
- **✕ X**: Remove effect

---

### Step 6: Add Transitions

1. Make sure you have **two clips next to each other** on the timeline
2. Click the **Transitions** tab in the right panel
3. **Drag** a transition (e.g., "Cross Dissolve")
4. **Drop** it between the two clips
5. The transition will appear as a small box between clips

**Available Transitions:**
- Cross Dissolve
- Fade
- Dip to Black
- Dip to White
- Wipe (Left, Right, Up, Down)
- Push (Left, Right)
- Zoom In/Out

---

### Step 7: Export Your Video

1. Click **File → Export** in the menu bar (or press **Ctrl+E**)
2. Choose your export settings:
   - **Format**: MP4, WebM, or MOV
   - **Codec**: H.264 (recommended), H.265, VP9, or AV1
   - **Quality**: Low, Medium, High, or Ultra
   - **Resolution**: Keep project resolution or choose custom
3. Click **Start Export**
4. Wait for the export to complete (progress bar will show)
5. Click **Download** to save your video

**Export Tips:**
- First export will download FFmpeg (~30MB)
- H.264 is the most compatible codec
- Higher quality = larger file size
- Export time depends on video length and quality

---

## Common Tasks

### Editing Clips

**Trim a Clip:**
1. Select the clip
2. Drag the **left edge** to trim the start
3. Drag the **right edge** to trim the end

**Split a Clip:**
1. Move the playhead to where you want to split
2. Select the clip
3. Press **Ctrl+K** or right-click → Split

**Delete a Clip:**
1. Select the clip
2. Press **Delete** or right-click → Delete

**Copy/Paste Clips:**
1. Select clip(s)
2. Press **Ctrl+C** to copy
3. Press **Ctrl+V** to paste

**Duplicate a Clip:**
1. Select the clip
2. Press **Ctrl+D** or right-click → Duplicate

### Timeline Navigation

**Zoom In/Out:**
- Press **+** or **-** keys
- Use the zoom slider in the timeline toolbar
- Scroll with **Ctrl+Wheel**

**Scroll Timeline:**
- Use the scrollbar at the bottom
- Drag with the **Hand tool** (press **H**)
- Scroll with **Shift+Wheel**

**Snapping:**
- Toggle with the **Snapping** checkbox in toolbar
- Or press **S**
- Clips will snap to grid, playhead, and other clips

**Ripple Mode:**
- Toggle with the **Ripple** checkbox in toolbar
- When enabled, moving/deleting clips will shift all clips after it

### Track Controls

Each track has controls on the left:
- **M** - Mute/Unmute audio
- **S** - Solo (mute all other tracks)
- **🔒** - Lock (prevent editing)
- **👁️** - Show/Hide track

### Undo/Redo

- Press **Ctrl+Z** to undo
- Press **Ctrl+Y** to redo
- All actions are undoable!

---

## Keyboard Shortcuts Cheat Sheet

### Playback
| Key | Action |
|-----|--------|
| `Space` | Play/Pause |
| `←` | Step backward |
| `→` | Step forward |
| `Home` | Go to start |
| `End` | Go to end |

### Editing
| Key | Action |
|-----|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+X` | Cut |
| `Ctrl+C` | Copy |
| `Ctrl+V` | Paste |
| `Delete` | Delete |
| `Ctrl+D` | Duplicate |
| `Ctrl+K` | Split at playhead |

### Tools
| Key | Action |
|-----|--------|
| `V` | Selection tool |
| `C` | Razor tool |
| `H` | Hand tool |

### Timeline
| Key | Action |
|-----|--------|
| `+` / `=` | Zoom in |
| `-` | Zoom out |
| `S` | Toggle snapping |

### Other
| Key | Action |
|-----|--------|
| `Ctrl+E` | Export |
| `Ctrl+I` | Import media |
| `Ctrl+,` | Settings |

---

## Troubleshooting

### Blank Page
✅ **Fixed!** The application should now load properly.

If you still see a blank page:
1. Hard refresh: **Ctrl+Shift+R**
2. Clear browser cache
3. Check browser console (F12) for errors

### Video Not Playing
- Make sure the clip is on the timeline
- Check if the track is muted
- Try a different video format
- Check browser console for errors

### Effects Not Showing
- Make sure a clip is selected
- Check if the effect is enabled (eye icon)
- Try adjusting the effect parameters
- Refresh the page if needed

### Export Fails
- Wait for FFmpeg to download (first time only)
- Try a different codec (H.264 is most reliable)
- Check browser console for errors
- Make sure you have clips on the timeline

### Performance Issues
- Close other browser tabs
- Reduce timeline zoom level
- Use lower quality preview
- Try a different browser (Chrome recommended)

---

## Tips & Tricks

### 🎯 Pro Tips

1. **Use Keyboard Shortcuts** - Much faster than clicking!
2. **Enable Snapping** - Makes alignment easier
3. **Use Ripple Mode** - For quick edits without gaps
4. **Preview Before Export** - Play through your edit first
5. **Save Often** - Auto-save is enabled, but manual save is safer

### 🎨 Creative Tips

1. **Layer Effects** - Apply multiple effects to one clip
2. **Adjust Effect Intensity** - Use sliders for subtle changes
3. **Use Transitions Sparingly** - Less is more!
4. **Match Audio to Video** - Use waveforms to sync
5. **Experiment** - Try different effects and transitions

### ⚡ Performance Tips

1. **Use H.264** - Fastest codec for export
2. **Lower Resolution** - For faster exports
3. **Close Unused Tabs** - Free up memory
4. **Use Chrome** - Best performance
5. **Restart Browser** - If it gets slow

---

## Need Help?

### Check the Documentation
- `SESSION_10_COMPLETE.md` - Full feature list
- `BLANK_PAGE_FIXED.md` - Troubleshooting guide
- `TROUBLESHOOTING.md` - Common issues

### Browser Console
Press **F12** to open developer tools and check for errors.

### Dev Server
The dev server is running at: http://localhost:5173/

---

## What's Next?

Now that you know the basics, try:
1. ✅ Import multiple videos
2. ✅ Create a multi-track edit
3. ✅ Apply effects and transitions
4. ✅ Export your first video
5. ✅ Explore advanced features

**Have fun editing! 🎬**

---

**Version**: 1.0.0-alpha  
**Last Updated**: 2026-05-07  
**Status**: ✅ Ready to use
