# SKILL: MindStats High-Fidelity UI/UX Implementation
# Style Reference: MindStats Brand Guide (Light Professional)
# Tech Stack: Vite, React 19, Chakra UI v2, Redux Toolkit, Framer Motion

## 1. CORE DESIGN TOKENS (LIGHT THEME)
When generating UI for MindStats, strictly follow these visual constraints to match the uploaded designs:

### A. Color Palette & Surfaces
- **Primary Navy:** `#003366` (Used for Hero text, Primary Buttons, and Footer).
- **Backgrounds:** - Main Canvas: Pure White (`#FFFFFF`).
  - Feature Blocks: Very Light Mint/Green (`#E8F3ED`) as seen in UI-1.
  - Secondary Accents: Light Beige/Cream (`#FDF5E6`) as seen in UI-2.
- **Borders:** Use subtle Light Grey (`#DADADA` or `#E2E8F0`) for cards and inputs.

### B. Interactive Components (Pill-Shaped)
- **Primary Button:** - `bg="#003366"`, `color="white"`, `borderRadius="full"`, `px={8}`, `fontFamily="heading" (Montserrat)`.
  - Hover: Scale to `0.98` with slight opacity shift.
- **Secondary/Sign-In Button:** - `variant="outline"`, `borderColor="#003366"`, `color="#003366"`, `borderRadius="full"`.
- **Choice Chips (Assessment):**
  - Inactive: `bg="#f3f3f4"`, `color="gray.600"`.
  - Active: `bg="#003366"`, `color="white"`.

## 2. COMPONENT ARCHITECTURE & LAYOUT
Follow these structural rules to replicate the "MindStats UI" layouts:

### A. Typography Hierarchy
- **Headlines:** Montserrat Bold. Use tight `letterSpacing="-0.02em"`. Color: `#000000` or `#003366`.
- **Body:** Inter or Montserrat Medium. Color: `#333333` for readability.
- **Stats/Badges:** Use Monospace (JetBrains Mono) for "1/28" progress indicators or technical labels.

### B. Grid & Card Systems
- **Pricing Cards:** 1px solid border (`#DADADA`), `borderRadius="8px"`, `p={8}`.
- **Bento Sections:** Use `SimpleGrid` with consistent spacing (`spacing={10}`).
- **Images/Illustrations:** Always use `borderRadius="24px"` for large hero illustrations and character-driven assets to match the rounded aesthetic.

### C. Motion & Transitions (Krisp-Style Fluidity)
Use Framer Motion for a "premium" feel while keeping the light design grounded:
- **Entrance:** Vertical slide-up (`y: 20` to `0`) with `opacity: 0` to `1`.
- **Hover:** Subtle lift (`translateY: -4px`) for feature cards.

## 3. IMPLEMENTATION RULES FOR CLAUDE CODE

### A. Form Handling (UI-3 Reference)
- Inputs must be `variant="filled"`, `bg="#f3f3f4"`, `borderRadius="8px"`.
- Focus state: `borderColor="#003366"`.

### B. Global Footer (UI-1 Reference)
- Always use `bg="#003366"` and `color="white"`.
- Align Social Icons (FB, IG, TikTok) in a horizontal row on the bottom left.

### C. Execution Checklist:
1. **No Dark Mode:** Do not use dark backgrounds unless specifically requested.
2. **Pill Dominance:** Ensure all main action buttons are `borderRadius="full"`.
3. **Illustrative Focus:** Maintain space for grain-textured illustrations; do not overcrowd with text.