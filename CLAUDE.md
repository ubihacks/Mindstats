# Role: Senior Full-Stack Engineer & Architect

# Context
Project Name: Mindstat (B2B DISC Behavioral Assessment Tool)
Tech Stack: Vite, React, TypeScript, Redux Toolkit (RTK), Chakra UI.
Backend: Supabase (Auth/PostgreSQL) with Prisma ORM.

# Reference Files
- Requirements: /docs/business-requirements.md 
- assests : /DOC/images/assesst (use if needed)
- Tech Stack: Vite, Redux Toolkit, Chakra UI, Supabase


# Role: Principal Product Engineer & UX Architect


# UI/UX Quality Bar
- Use high-end Chakra UI patterns (Table containers, Stat components, Tooltips).
- Ensure 100% accessible (A11y) and mobile-responsive layouts.
- Implement micro-interactions (e.g., loading states on buttons).



# The MNC Quality Bar (Strict Constraints)
1. **Design Tokens:** Do not use hardcoded hex codes. Use Chakra UI theme tokens (e.g., `gray.50`, `blue.600`).
2. **Perceived Performance:** Implement "Optimistic UI." Use `Skeleton` loaders for data fetching and `framer-motion` for layout transitions (Chakra's `Fade` or `Collapse`).
3. **Information Density:** Maintain a "Clean B2B" aesthetic. High whitespace, consistent `4px` or `8px` grid alignment, and 600+ font weight for headers.
4. **The "Polish" Rule:** All interactive elements must have:
   - `_hover`, `_active`, and `_focus-visible` states.
   - Tooltips for any disabled action (The Gatekeeper Rule).
   - Loading spinners on buttons (`isLoading`) for any async RTK Query action.
5. **Architectural Purity:** - Separate "Smart" (Container) and "Dumb" (Presentational) components.
   - Use TypeScript `Discriminated Unions` for UI states (e.g., Status: 'idle' | 'loading' | 'success').


# Instruction
Analyze the business logic in the docs and implement the following features. 
Ensure strict adherence to the "Gatekeeper Rule" and the "Credit Logic" defined in the requirements.

# Project Objective
Create a behavioral matching engine between "Hiring Roles" and "Candidates." 
Follow a feature-based folder structure (e.g., /src/features/assessment, /src/features/billing).

# Current Task: Assessment & Gatekeeper Implementation
1. **Redux State Machine**: 
   - Manage the "Hiring Manager" assessment status.
   - Implement the "Gatekeeper Rule": Candidate invitation links remain locked (isDisabled) until the associated Hiring Manager's assessment status is 'COMPLETED'.
   - Manage credit logic: 10 credits for first-time unique company domains; 0 for subsequent users on same domain.

2. **Chakra UI Assessment Module**:
   - Implement a 28-question DISC questionnaire based on the "Social Interactive Style" approach.
   - Force "Force-Choice" Logic: Each question must have exactly one "Most" and one "Least" selection. If a user selects "Most" on an option already marked "Least," clear the "Least" selection.
   - Use Chakra UI components (RadioGroup, VStack, Table, or Cards) for a premium, clean aesthetic.

3. **Database & Naming Standards**:
   - Use PascalCase for React components.
   - Use camelCase for TS variables.
   - Use snake_case for Prisma/Supabase database columns.
   - Wrap all credit transactions in robust error handling/try-catch blocks.

# Constraints
- Auth: Restrict to professional emails only (filter by domain).
- Reporting: Dashboard must include an Admin portal for manual PDF/Excel report uploads (reports are NOT automated).
- Credits: 2-week expiry on links; refund credits to the company pool if unused and expired.

Please generate the Redux Slice, the main Assessment Component, and the Dashboard logic that enforces the Gatekeeper lock.