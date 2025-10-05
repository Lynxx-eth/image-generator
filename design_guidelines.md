# AI Banner & Image Generator - Design Guidelines

## Design Approach

**Hybrid Approach**: Drawing inspiration from leading AI image generation platforms (Midjourney, DALL-E, Adobe Firefly) while maintaining a clean, utility-focused design system. This tool prioritizes **functional excellence with creative elegance** - users need efficient image generation with an interface that inspires creativity.

## Core Design Principles

1. **Content-First**: The generated image is the hero - everything else supports it
2. **Streamlined Workflow**: Minimal steps from prompt to image
3. **Creative Confidence**: Dark theme that reduces eye strain and emphasizes visual output
4. **Responsive Grace**: Seamless experience across all devices

---

## Color Palette

### Dark Mode (Primary)
- **Background Base**: 222 15% 8% (deep charcoal)
- **Surface**: 222 14% 12% (elevated surfaces, cards)
- **Surface Elevated**: 222 13% 16% (input fields, dropdowns)
- **Primary Brand**: 262 83% 58% (vibrant purple for CTAs)
- **Primary Hover**: 262 83% 52%
- **Success/Generated**: 142 71% 45% (when image successfully generated)
- **Text Primary**: 0 0% 98%
- **Text Secondary**: 0 0% 65%
- **Border**: 222 13% 20%

### Light Mode (Secondary)
- **Background**: 0 0% 99%
- **Surface**: 0 0% 100%
- **Primary**: 262 83% 48%
- **Text**: 222 15% 15%

---

## Typography

**Font Stack**: 
- **Primary**: 'Inter', -apple-system, system-ui, sans-serif
- **Accent/Headers**: 'Space Grotesk', 'Inter', sans-serif

**Scale**:
- **Hero Title**: text-4xl md:text-5xl lg:text-6xl, font-bold, tracking-tight
- **Section Headers**: text-2xl md:text-3xl, font-semibold
- **Input Labels**: text-sm, font-medium, text-secondary
- **Body**: text-base, leading-relaxed
- **Button Text**: text-sm md:text-base, font-medium

---

## Layout System

**Spacing Primitives**: Tailwind units of **2, 4, 6, 8, 12, 16, 24**
- Consistent rhythm: p-4, gap-6, space-y-8
- Generous breathing room around primary image display
- Mobile: p-4, gap-4; Desktop: p-8, gap-8

**Container Strategy**:
- App Container: max-w-7xl mx-auto
- Image Display Zone: max-w-4xl (allows image to breathe)
- Control Panel: max-w-2xl for optimal form width

**Grid System**:
- Single column on mobile
- Two-column on desktop (controls left, image preview right for larger screens)
- Adaptive: Stacks vertically on tablet portrait

---

## Component Library

### Header
- Sticky top header with subtle backdrop blur
- Logo/Title on left, theme toggle on right
- Height: h-16, border-bottom with border-subtle
- Includes: "AI Banner & Image Generator" title with gradient text effect (purple to blue)

### Input Controls Section
**Prompt Input**:
- Large textarea (min-h-32) with placeholder animation
- Focus state: ring-2 ring-primary, subtle glow effect
- Character counter (subtle, bottom-right)
- Rounded corners: rounded-xl

**Size Selector Dropdown**:
- Custom styled select with icon indicators
- Options displayed with dimensions and aspect ratio labels
- Visual preview icons for each size option
- Height: h-12, consistent with button sizing

**Generate Button**:
- Primary CTA: Large, prominent (h-12 md:h-14)
- Full width on mobile, auto on desktop
- Loading state: Animated gradient background with spinner
- Disabled state when no prompt entered

### Image Display Zone
- **Empty State**: Dashed border container with centered icon and inspirational prompt suggestions
- **Loading State**: Skeleton loader with animated gradient, preserving aspect ratio
- **Success State**: 
  - Image displayed with subtle shadow and rounded corners (rounded-2xl)
  - Fade-in animation on load
  - Metadata overlay (size, generation time) on hover
  - Image container has min-h-96 to prevent layout shift

### Download Button
- Secondary style with icon
- Appears only when image is generated
- Smooth slide-in animation from bottom
- Fixed position on mobile (bottom sheet style)

### Additional Components
**Feature Pills** (Below header):
- Small badges showcasing capabilities: "Text-to-Image", "Custom Sizes", "Instant Download"
- Pills with bg-surface-elevated, rounded-full, px-4 py-1.5

**Status Toast**:
- Success/Error notifications
- Top-right positioning
- Auto-dismiss after 4s
- Blur backdrop with border-l-4 accent

---

## Animations

**Strategic Use Only**:
1. **Image Generation**: Fade-in + scale animation (300ms ease-out)
2. **Button States**: Subtle scale on press (95%)
3. **Loading Spinner**: Smooth rotation on generate button
4. **Prompt Focus**: Gentle glow effect on textarea focus
5. **Download Button Entry**: Slide-up animation (200ms)

---

## Images

**No Hero Image Required** - This is a utility tool where the generated content IS the hero.

**Icon Usage**:
- Heroicons via CDN (outline for most, solid for active states)
- Sparkles icon for generate button
- Download icon for download button
- Image icon for empty state
- Moon/Sun for theme toggle

---

## Layout Structure

### Desktop (1024px+)
```
[Header - Full Width]
[Feature Pills - Centered]
[Two Column Layout]
  Left: Control Panel (prompt, size, generate) - 40% width
  Right: Image Display Zone - 60% width
[Download Button - Bottom Right when image exists]
```

### Mobile (<1024px)
```
[Header]
[Feature Pills]
[Control Panel - Full Width]
[Generate Button - Full Width]
[Image Display - Full Width]
[Download Button - Fixed Bottom]
```

---

## Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px  
- Desktop: 1024px+

**Key Adjustments**:
- Font sizes scale down smoothly
- Padding reduces from 8 to 4 units
- Buttons go full-width on mobile
- Image display maintains aspect ratio, scales to container

---

## Accessibility Features

- High contrast text (WCAG AAA where possible)
- Focus indicators on all interactive elements
- Keyboard navigation support
- Alt text generation for downloaded images
- Loading states announced to screen readers
- Error messages clearly visible and actionable