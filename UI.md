# SKILL: UI/UX Pro Max - Premium Frontend Architecture
# Style Reference: PocketOS.ai, Krisp.ai, Stripe, Vercel
# Tech Stack: Vite, React 19, Chakra UI v2, Redux Toolkit, Framer Motion

## 1. DESIGN & AESTHETIC DIRECTIVES
When generating or refactoring UI components, Claude must enforce the following premium design tokens and layout rules instead of generic fallback styles:

### A. Tactile Borders & Dark Aesthetics (PocketOS Style)
- **Backgrounds:** Use deep, premium dark layers. Primary: `gray.900` or custom HEX `#0A0A0A`. Secondary cards: `gray.850` or `#121212`.
- **Borders:** Avoid heavy drop-shadows. Use razor-sharp 1px borders with low-opacity white to create depth:
  ```typescript
  border="1px solid" borderColor="whiteAlpha.100"
  backdropFilter="blur(16px)" bg="rgba(10, 10, 10, 0.7)"
  ### B. Structural Layouts (Bento Grid)
- Arrange feature showcases, dashboard modules, or metric blocks into structural Bento Grids using Chakra's `<SimpleGrid>` or `<Grid>`.
- Keep spacing consistent with `spacing={6}` (24px) or `spacing={4}` (16px).
- Every card must feature subtle interactive lifting or border-color illumination on hover.

### C. Fluid Micro-Interactions (Krisp Style)
- Utilize `framer-motion` alongside Chakra UI for organic, fluid transitions.
- All primary interaction points (buttons, card hovers, link highlights) must use a standardized transition curve: `transition={{ duration: 0.2, ease: "easeOut" }}`.

---

## 2. COMPONENT CODE ARCHITECTURE (REACT 19 + CHAKRA UI)
Claude must follow these implementation patterns strictly to match the project's ecosystem:

### A. Framer Motion + Chakra Integration
Always merge Framer Motion capabilities with Chakra components using the `motion` utility for clean, declaration-level animations:
- **Muted Elements:** Secondary metadata or subtitles should consistently use `color="gray.400"`.
- **Technical Accent Labels:** Use a monospaced font format for badges, status chips, or system labels.

---

## 3. UI-UX-PRO-MAX STATE & DATA INTEGRATION
To maintain professional software design patterns, layout code must hook correctly into your state and data architecture:

- **Global State:** Bind UI state changes (e.g., toggling sidebar layouts, layout variations, interactive preview states) through Redux Toolkit slices (`src/store`).
- **Server State & Indicators:** Always handle asynchronous view transitions elegantly. When `@tanstack/react-query` components are fetching data, use clean Chakra `<Skeleton>` or custom micro-animated SVG processing indicator waves (mimicking Krisp's audio wave styles) instead of basic text loading placeholders.
- **Form Integrity:** Bind UI fields precisely to `react-hook-form` handled through `zod` validation schemas. Show invalid states smoothly using Chakra’s `<FormErrorMessage>` with subtle entrance transitions.

---

## 4. CLAUDE CODE EXECUTION WORKFLOW
When executing commands via Claude Code terminal (`/dev`, `/fix`, or code edits):

1. **Scan Existing Layout:** Analyze the layout tree inside the target file under `src/`.
2. **Apply Premium Pass:** Intercept standard Chakra elements and enhance them with the specified `border="1px solid" borderColor="whiteAlpha.100"` styling, tracking optimizations, and Framer Motion view-entrance bindings.
3. **Validate Rules:** Ensure no basic bright color choices, overly rounded container corners (`borderRadius` must never exceed `xl`), or standard heavy drop shadows are introduced.