---
name: Heritage Opulence
colors:
  surface: '#1a1110'
  surface-dim: '#1a1110'
  surface-bright: '#423735'
  surface-container-lowest: '#140c0b'
  surface-container-low: '#231918'
  surface-container: '#271d1c'
  surface-container-high: '#322826'
  surface-container-highest: '#3d3231'
  on-surface: '#f1dedc'
  on-surface-variant: '#dcc0bd'
  inverse-surface: '#f1dedc'
  inverse-on-surface: '#392e2d'
  outline: '#a38b88'
  outline-variant: '#554240'
  surface-tint: '#ffb4aa'
  primary: '#ffb4aa'
  on-primary: '#5f1410'
  primary-container: '#4a0404'
  on-primary-container: '#d26a5f'
  inverse-primary: '#9d4139'
  secondary: '#95d3ba'
  on-secondary: '#003829'
  secondary-container: '#0b513d'
  on-secondary-container: '#83c2a9'
  tertiary: '#b6c4ff'
  on-tertiary: '#05297a'
  tertiary-container: '#001b5c'
  on-tertiary-container: '#6c85d9'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4aa'
  on-primary-fixed: '#410001'
  on-primary-fixed-variant: '#7e2b23'
  secondary-fixed: '#b0f0d6'
  secondary-fixed-dim: '#95d3ba'
  on-secondary-fixed: '#002117'
  on-secondary-fixed-variant: '#0b513d'
  tertiary-fixed: '#dce1ff'
  tertiary-fixed-dim: '#b6c4ff'
  on-tertiary-fixed: '#00164e'
  on-tertiary-fixed-variant: '#264191'
  background: '#1a1110'
  on-background: '#f1dedc'
  surface-variant: '#3d3231'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Source Sans 3
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Source Sans 3
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Source Sans 3
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.15em
spacing:
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 80px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is anchored in the concept of "Modern Heritage," blending traditional Indian craftsmanship with a high-end luxury digital experience. It targets a discerning audience seeking investment-grade ethnic jewelry, evoking feelings of timelessness, prestige, and cultural pride.

The visual style is a fusion of **Minimalism** and **Tactile Luxury**. While the layout remains clean and spacious to let the jewelry breathe, the UI elements utilize rich textures and metallic finishes to simulate a physical boutique experience. High-contrast backgrounds and gold-leaf accents create a dramatic, theatrical stage for the products.

## Colors
The palette is a regal ensemble of "Jewel Tones" set against a deep, shadowed environment. 

- **Primary (Deep Maroon):** Used for primary backgrounds and high-intent surfaces. It provides a warm, velvety depth.
- **Accents (Emerald & Royal Blue):** Reserved for category signifiers, subtle hover states, or "Limited Edition" badges to provide visual variety without breaking the brand harmony.
- **Gold Accents:** Gold is never used as a solid block. It is applied via linear gradients at 45 degrees to simulate the shimmer of real metal on borders, icons, and call-to-action text.
- **Surface Strategy:** Use the primary maroon for main sections, transitioning to a near-black neutral (#1A1A1A) for footers and secondary containers to maintain high contrast.

## Typography
Typography follows a classical editorial hierarchy. **Playfair Display** provides the "voice" of the brand—authoritative, elegant, and high-fashion. It should be used for all narrative headings and product names.

**Source Sans 3** is the functional workhorse, chosen for its exceptional legibility at small sizes and its neutral character which does not compete with the decorative headlines. All labels and utility text (prices, specifications) should use uppercase with increased letter spacing to evoke a sense of "engraved" luxury.

## Layout & Spacing
The layout uses a **Fixed Grid** philosophy on desktop to create an "art gallery" feel, centered with generous outer margins. 

- **Desktop:** 12-column grid with a 1280px max-width. Use "wide" whitespace between sections (80px+) to emphasize the premium nature of the products.
- **Mobile:** 4-column grid with 20px margins. Content should stack vertically with jewelry imagery taking the full width of the container.
- **Rhythm:** Use an 8px base unit for all internal component spacing (padding, gaps).

## Elevation & Depth
Depth is created through **Tonal Layering** and **Lustrous Outlines** rather than traditional drop shadows.

- **The Gold Border:** Elevate primary elements (cards, active inputs) using a 1px or 2px border with the gold gradient.
- **Subtle Overlays:** Use 10% opacity white overlays on maroon surfaces to indicate hover states or higher elevation.
- **Mandala Watermarks:** Use subtle, low-contrast ornamental patterns (mandala) in the background of sections. These should be set to `multiply` or `overlay` blend modes with an opacity of 5-8% so they appear as ghosted textures on the maroon fabric.

## Shapes
This design system utilizes a **Sharp (0)** roundedness strategy. Sharp corners convey a sense of precision, structural integrity, and architectural luxury found in high-end jewelry boxes and boutiques.

- **Dividers:** Use 1px "Gold Wire" dividers (horizontal gold gradient lines) to separate sections.
- **Image Treatment:** Product photography should be strictly rectangular or held within a subtle "arch" frame (referencing Indian palace architecture) but never with rounded corners.

## Components

- **Buttons:** Primary buttons feature a solid Deep Maroon background with a 1.5px Gold Gradient border. Text is set in Gold `label-caps`. Secondary buttons are "Ghost" style with only the Gold border and Gold text.
- **Product Cards:** Cards have no background (transparent) but use a "Gold Wire" border on hover. The product image should be silhouetted or shot on a dark, moody background. Price and title are centered below the image in Playfair Display.
- **Refined Form Fields:** Inputs are bottom-border only (1px Gold) with the label floating above in `label-caps`. This mimics the look of high-end stationery.
- **Chips/Badges:** Small, rectangular tags with Emerald Green or Royal Blue backgrounds and white text, used sparingly for "New Arrival" or "Certified" markers.
- **Mandala Dividers:** A specific component consisting of a thin gold line interrupted in the center by a small, simplified gold mandala icon. Use this to separate major narrative sections on the homepage.