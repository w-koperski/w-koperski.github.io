# Pixel Art 3D Avatar - Asset & Geometry Plan

## Decision: Three.js Primitives (No External GLB)

This avatar is **built from Three.js BoxGeometry primitives**, not downloaded as an external GLB file. This approach:
- Keeps bundle size minimal
- Allows runtime customization and animation
- Maintains pixel art aesthetic with flat shading
- Integrates seamlessly with existing HeroScene setup

**Implementation scheduled for Task 11** (avatar-component-build).

---

## Voxel Character Geometry

### Head
- **Geometry**: `BoxGeometry(0.6, 0.6, 0.6)`
- **Position**: `[0, 0.8, 0]` (above torso)
- **Material**: `#2a2a2a` with `flatShading: true`
- **Details**: Simple cube, no features (eyes/mouth added via texture or separate meshes later)

### Body / Torso
- **Geometry**: `BoxGeometry(0.8, 1.0, 0.4)`
- **Position**: `[0, 0, 0]` (center)
- **Material**: `#2a2a2a` with `flatShading: true`
- **Details**: Main blocky torso, slightly wider than tall

### Left Arm
- **Geometry**: `BoxGeometry(0.2, 0.7, 0.2)`
- **Position**: `[-0.5, 0.2, 0]` (left side of torso)
- **Material**: `#2a2a2a` with `flatShading: true`
- **Animation**: Idle rotation around shoulder joint

### Right Arm
- **Geometry**: `BoxGeometry(0.2, 0.7, 0.2)`
- **Position**: `[0.5, 0.2, 0]` (right side of torso)
- **Material**: `#2a2a2a` with `flatShading: true`
- **Animation**: Idle rotation around shoulder joint

### Left Leg
- **Geometry**: `BoxGeometry(0.25, 0.5, 0.25)`
- **Position**: `[-0.2, -0.75, 0]` (below torso, left)
- **Material**: `#2a2a2a` with `flatShading: true`

### Right Leg
- **Geometry**: `BoxGeometry(0.25, 0.5, 0.25)`
- **Position**: `[0.2, -0.75, 0]` (below torso, right)
- **Material**: `#2a2a2a` with `flatShading: true`

---

## Desk & Workspace

### Desk Surface
- **Geometry**: `BoxGeometry(2.0, 0.1, 0.8)`
- **Position**: `[0, -1.3, 0]` (below avatar)
- **Material**: `#1a1a1a` with `flatShading: true`
- **Details**: Flat desk surface, slightly recessed

### Monitor (Frame)
- **Geometry**: `BoxGeometry(0.9, 0.7, 0.05)`
- **Position**: `[0.8, -0.5, 0]` (on desk, to the right)
- **Material**: `#1a1a1a` with `flatShading: true`
- **Details**: Thin monitor frame

### Monitor Screen (Emissive Face)
- **Geometry**: `PlaneGeometry(0.8, 0.6)` or `BoxGeometry(0.8, 0.6, 0.01)`
- **Position**: `[0.8, -0.5, 0.03]` (in front of monitor frame)
- **Material**: 
  - `color: #0A0A0A` (dark base)
  - `emissive: #4AF626` (terminal green)
  - `emissiveIntensity: 0.3` (base, pulses during animation)
- **Animation**: Emissive intensity oscillates 0.2–0.5 (breathing glow effect)

### Keyboard
- **Geometry**: `BoxGeometry(0.6, 0.05, 0.2)`
- **Position**: `[0, -1.25, 0]` (on desk, in front)
- **Material**: `#1a1a1a` with `flatShading: true`

---

## Lighting Plan

### Ambient Light
- **Color**: `#1a1a2e` (cool dark blue)
- **Intensity**: `0.3`
- **Purpose**: Base scene illumination

### Point Light (Monitor Glow)
- **Position**: `[0.8, -0.5, 0.3]` (from monitor screen)
- **Color**: `#4AF626` (terminal green)
- **Intensity**: `1.5`
- **Distance**: `3`
- **Purpose**: Casts green glow onto avatar and desk

### Rim Light (Optional, Task 11)
- **Position**: `[-2, 1, 2]` (back-left)
- **Color**: `#4AF626` (subtle green rim)
- **Intensity**: `0.5`
- **Purpose**: Highlights avatar silhouette

---

## Animations (Idle State)

### Breathing (Chest)
- **Target**: Torso Y-scale
- **Range**: `1.0 → 1.05 → 1.0`
- **Duration**: 3 seconds (sine wave)
- **Purpose**: Subtle life-like movement

### Head Rotation
- **Target**: Head Y-rotation
- **Range**: `-0.1 → 0.1 radians`
- **Duration**: 4 seconds (sine wave)
- **Purpose**: Gentle head turn, looking at monitor

### Monitor Glow Pulse
- **Target**: Monitor screen emissiveIntensity
- **Range**: `0.2 → 0.5 → 0.2`
- **Duration**: 2 seconds (sine wave)
- **Purpose**: Screen breathing effect

### Arm Idle Sway
- **Target**: Arm Y-rotation (around shoulder)
- **Range**: `-0.05 → 0.05 radians`
- **Duration**: 3.5 seconds (sine wave, offset per arm)
- **Purpose**: Relaxed posture

---

## Camera Setup

### Position
- **Default**: `[0, 0, 5]` (inherited from HeroScene)
- **FOV**: `50`
- **Look-at**: Avatar center (desk area)

### Mouse Interaction
- **X-axis**: ±0.3 radians based on mouse X position
- **Y-axis**: ±0.2 radians based on mouse Y position
- **Purpose**: Parallax effect, viewer feels avatar responds to presence

---

## Color Palette

| Element | Color | Hex | Purpose |
|---------|-------|-----|---------|
| Avatar Body | Dark Gray | `#2a2a2a` | Main character color |
| Desk | Darker Gray | `#1a1a1a` | Workspace surface |
| Monitor Screen | Terminal Green | `#4AF626` | Emissive glow, accent |
| Monitor Frame | Dark Gray | `#1a1a1a` | Matches desk |
| Ambient Light | Cool Blue | `#1a1a2e` | Scene tone |

---

## Mobile Fallback

- **Breakpoint**: `< 768px` (mobile devices)
- **Behavior**: Avatar component NOT rendered on mobile
- **Fallback**: `StaticTerminal` component shown instead
- **Rationale**: 3D rendering on mobile is performance-intensive; static fallback maintains visual consistency

---

## Performance Considerations

- **Flat Shading**: All meshes use `flatShading: true` for pixel art aesthetic and reduced lighting calculations
- **Geometry Reuse**: Consider using `InstancedMesh` if avatar is rendered multiple times
- **LOD (Level of Detail)**: Not needed for this simple geometry; consider if avatar becomes complex
- **Intersection Observer**: Reuse existing HeroScene visibility detection to pause animations off-screen

---

## Integration with HeroScene

- **Canvas**: Reuse existing `<Canvas>` in HeroScene
- **Lighting**: Integrate with existing ambient light; add monitor point light
- **Particles**: CodeParticles component continues to render
- **Grid**: Existing grid helper remains visible
- **Camera Rig**: Existing mouse-tracking camera rig applies to avatar

---

## Next Steps (Task 11)

1. Create `PixelAvatar.jsx` component
2. Build geometry hierarchy with proper positioning
3. Implement idle animations using `useFrame`
4. Add monitor glow pulse animation
5. Test on desktop and mobile (verify fallback)
6. Integrate into HeroScene as replacement for TerminalMonitor
