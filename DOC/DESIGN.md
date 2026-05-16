---
name: Insight Professional
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#43474f'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#737780'
  outline-variant: '#c3c6d1'
  surface-tint: '#3a5f94'
  primary: '#001e40'
  on-primary: '#ffffff'
  primary-container: '#003366'
  on-primary-container: '#799dd6'
  inverse-primary: '#a7c8ff'
  secondary: '#006a6a'
  on-secondary: '#ffffff'
  secondary-container: '#90efef'
  on-secondary-container: '#006e6e'
  tertiary: '#172021'
  on-tertiary: '#ffffff'
  tertiary-container: '#2c3536'
  on-tertiary-container: '#949d9e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a7c8ff'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#1f477b'
  secondary-fixed: '#93f2f2'
  secondary-fixed-dim: '#76d6d5'
  on-secondary-fixed: '#002020'
  on-secondary-fixed-variant: '#004f4f'
  tertiary-fixed: '#dbe4e5'
  tertiary-fixed-dim: '#bfc8c9'
  on-tertiary-fixed: '#151d1e'
  on-tertiary-fixed-variant: '#404849'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  section-gap: 80px
  element-gap: 16px
---

## Brand & Style

The design system is built for a professional workplace behavioral assessment platform. It aims to evoke an emotional response of **trustworthiness, clarity, and personal growth**. The brand personality is that of a "wise consultant"—authoritative yet accessible, data-driven yet human-centric.

The visual style is a fusion of **Corporate Modern** and **Minimalism**, characterized by:
- High-quality, textured illustrations that add a layer of human warmth to data-driven insights.
- Generous whitespace to allow complex behavioral information to "breathe."
- A rigorous grid system that communicates stability and precision.
- A sophisticated color palette that balances cold, analytical blues with warm, humanistic secondary tones.

## Colors

The color strategy uses a **Deep Navy (#003366)** as the foundation to establish institutional trust and professional authority. 

- **Primary:** Used for core branding, primary buttons, and navigation backgrounds to anchor the UI.
- **Secondary (Teal):** Used for interactive elements like toggles and success states, providing a bridge between the cold navy and the warmer illustration palette.
- **Tertiary/Subtle:** Light grays and soft teals are used for section containers to create a "layered" information architecture without relying on heavy borders.
- **Accent (Muted Orange):** Reserved for highlighting key insights or "Aha!" moments within assessment results, mirroring the palette used in custom illustrations.

## Typography

This design system employs a pairing of **Montserrat** for structural impact and **Inter** for sustained reading. 

- **Headlines:** Set in Montserrat with tight tracking and bold weights. This creates a sense of confidence and modernity.
- **Body Text:** Set in Inter. The high x-height and neutral character ensure maximum legibility for long-form behavioral reports and assessment questions.
- **Scaling:** On mobile devices, display and large headlines should scale down by approximately 25% to maintain a balanced visual hierarchy on smaller viewports.

## Layout & Spacing

The layout follows a **Fixed Grid** model for desktop to ensure content remains centered and readable, transitioning to a fluid model for tablet and mobile.

- **Desktop (1280px+):** 12-column grid with 24px gutters. Content is typically grouped into 4-column cards or 6-column split sections.
- **Tablet (768px - 1024px):** 8-column grid with 20px gutters. Horizontal layouts (like pricing cards) should reflow into 2-stack or 1-stack configurations.
- **Mobile (Below 768px):** 4-column grid with 16px margins. All multi-column components stack vertically.
- **Rhythm:** Use a consistent 8px base unit for all internal component padding and margins to ensure a tight, professional finish.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layering** and **Low-Contrast Outlines**.

- **Surfaces:** Main content sits on white (#FFFFFF). Secondary sections use a subtle gray (#F8F9FA) or a very pale teal tint to denote a change in context.
- **Depth:** Avoid heavy drop shadows. Instead, use a single "soft-glow" shadow style for active cards or modals (0px 4px 20px rgba(0, 0, 0, 0.05)).
- **Separation:** Use 1px borders in a light gray (#E5E7EB) for card containers to provide structure without adding visual noise.

## Shapes

The design system uses a **Rounded** shape language to soften the professional tone and make the platform feel approachable.

- **Standard Elements:** Buttons, input fields, and cards use a 0.5rem (8px) corner radius.
- **Large Containers:** Hero sections and feature blocks may use "rounded-xl" (1.5rem / 24px) to create a distinct frame for the textured illustrations.
- **Interactive Feedback:** Toggle pills and selection chips should use a fully rounded (pill) radius to distinguish them from structural layout blocks.

## Components

### Buttons
- **Primary:** Deep navy background, white text, 8px radius. High-contrast and substantial padding (12px 24px).
- **Secondary/Ghost:** Navy border (1px) with navy text or transparent background for less critical actions.

### Cards
- White background, 1px light gray border, 16px corner radius. Used for assessment results and pricing plans. 
- Headers within cards should use the accent navy to provide clear entry points.

### Input Fields
- Understated styling: 1px gray border that transitions to a teal border on focus. 
- Labels sit above the field in "label-sm" typography (Inter Bold).

### Assessment UI
- **Selection Chips:** Use "Most" and "Least" labels. Selected states should use the primary navy for "Least" and a secondary teal for "Most" to create clear visual differentiation.
- **Progress Bars:** Thin, centered progress indicator (e.g., "1/28") using a pill-shaped container to reduce user anxiety during the assessment.

### Illustrations
- All imagery must maintain the grain-textured, artistic style seen in the reference. 
- Human figures should be stylized and diverse, utilizing the muted orange/teal/navy palette.