import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

// ─── Mindstat — UI/UX Pro Max Skill ────────────────────────────────────────────
// Style    : PocketOS.ai · Krisp.ai · Stripe · Vercel dark premium               
// Pattern  : Dark aesthetic · Bento Grid · Glassmorphic 1px borders              
// Typography: Plus Jakarta Sans (heading) + Inter (body)                          
// Rule     : border="1px solid" borderColor="whiteAlpha.100" · no radius > xl   
// ─────────────────────────────────────────────────────────────────────────────

const colors = {
  // UI/UX Pro Skill: Deep premium dark layers (PocketOS / Vercel style)
  dark: {
    900: '#080808',  // ★ primary page background — deepest
    850: '#0f0f0f',  // card / panel background
    800: '#141414',  // elevated card / hover surface
    700: '#1a1a1a',  // hover state / subtle bg
    600: '#252525',  // divider / muted border
    500: '#333333',  // muted interactive border
  },

  // Primary: Blue accent — visible on dark backgrounds
  // Source: ui-ux-pro colors.csv #1 SaaS General (#2563EB primary)
  brand: {
    50:  '#EFF6FF',  // lightest tint — badge backgrounds on white
    100: '#DBEAFE',  // light — badge text bg on white
    200: '#BFDBFE',  // medium-light
    300: '#93C5FD',  // accent light — text on dark bg
    400: '#60A5FA',  // interactive mid
    500: '#3B82F6',  // primary interactive
    600: '#2563EB',  // ★ PRIMARY CTA — ui-ux-pro SaaS primary
    700: '#1D4ED8',  // CTA hover
    800: '#1E3A8A',  // dark elements / sidebar
    900: '#0F172A',  // ★ HERO BG — pure deep dark (ui-ux-pro B2B primary)
  },

  // Accent: Teal — standard Tailwind, WCAG-safe success / focus states
  teal: {
    50:  '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',  // accent on dark backgrounds
    400: '#2DD4BF',
    500: '#14B8A6',
    600: '#0D9488',  // focus borders / active toggles
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
  },

  // Neutral: Standard Tailwind Slate — matches ui-ux-pro #F8FAFC bg & #E2E8F0 border
  slate: {
    50:  '#F8FAFC',  // ★ page background (ui-ux-pro SaaS bg)
    100: '#F1F5F9',  // surface-container
    200: '#E2E8F0',  // ★ card borders (ui-ux-pro SaaS border)
    300: '#CBD5E1',  // dividers
    400: '#94A3B8',  // placeholder text
    500: '#64748B',  // secondary text
    600: '#475569',  // body text variant
    700: '#334155',  // body text
    800: '#1E293B',  // ★ primary text (ui-ux-pro SaaS text)
    900: '#0F172A',  // darkest
  },
};

// ui-ux-pro typography.csv #13: Plus Jakarta Sans — Friendly SaaS
// "SaaS products, web apps, dashboards, B2B, productivity tools"
const fonts = {
  heading: `'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif`,
  body:    `'Inter', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif`,
  mono:    `'JetBrains Mono', 'Fira Code', 'Consolas', monospace`,
};

// Soft-glow elevation — avoids heavy drop shadows per spec
// UI/UX Pro Skill: No heavy drop-shadows. 1px border depth instead.
// Use only subtle glows for focus / hover illumination.
const shadows = {
  card:         'none',
  'card-hover': '0 0 0 1px rgba(255,255,255,0.08)',  // border-glow on hover
  'card-focus': '0 0 0 2px rgba(96,165,250,0.40)',   // brand.400 focus ring
  'brand-glow': '0 0 20px rgba(37,99,235,0.30)',
  'teal-glow':  '0 0 20px rgba(20,184,166,0.28)',
};

// Rounded shape language — approachable yet professional
const radii = {
  none: '0',
  sm:   '4px',    // 0.25rem
  md:   '8px',    // 0.5rem  — standard (buttons, inputs, cards)
  lg:   '10px',
  xl:   '14px',
  '2xl':'16px',   // 1rem — cards
  '3xl':'24px',   // 1.5rem — hero/large containers
  full: '9999px', // pills / selection chips
};

const components = {
  Button: {
    baseStyle: {
      fontFamily: 'heading',
      fontWeight: '700',
      borderRadius: 'md',
      letterSpacing: '0.01em',
      _focusVisible: { boxShadow: '0 0 0 3px rgba(0,106,106,0.30)' },
    },
    sizes: {
      lg: { h: '48px', px: '24px', fontSize: 'md', borderRadius: 'md' },
      md: { h: '40px', px: '20px', fontSize: 'sm' },
      sm: { h: '32px', px: '14px', fontSize: 'xs' },
    },
    variants: {
      solid: (props: any) => ({
        bg:     props.colorScheme === 'brand' ? 'brand.600' : undefined,
        color:  props.colorScheme === 'brand' ? 'white'     : undefined,
        _hover: {
          bg:        props.colorScheme === 'brand' ? 'brand.700' : undefined,
          transform: 'translateY(-1px)',
          boxShadow: 'brand-glow',
        },
        _active: {
          bg:        props.colorScheme === 'brand' ? 'brand.700' : undefined,
          transform: 'translateY(0)',
        },
        transition: 'all 0.15s ease',
      }),
      outline: {
        borderWidth: '1.5px',
        _hover:  { transform: 'translateY(-1px)', boxShadow: 'card' },
        _active: { transform: 'translateY(0)' },
        transition: 'all 0.15s ease',
      },
      ghost: {
        _hover:  { transform: 'translateY(-1px)' },
        _active: { transform: 'translateY(0)' },
        transition: 'all 0.15s ease',
      },
    },
  },

  Input: {
    defaultProps: { focusBorderColor: 'brand.600' },
    variants: {
      outline: {
        field: {
          borderRadius: 'md',
          borderColor:  'slate.300',
          bg:           'white',
          fontSize:     'sm',
          _hover:       { borderColor: 'slate.400' },
          _focus: {
            borderColor: 'brand.600',
            boxShadow:   '0 0 0 1px #2563EB',
          },
          _placeholder: { color: 'slate.400' },
        },
      },
    },
  },

  Select: {
    defaultProps: { focusBorderColor: 'brand.600' },
    variants: {
      outline: {
        field: {
          borderRadius: 'md',
          borderColor:  'slate.300',
          fontSize:     'sm',
          _hover: { borderColor: 'slate.400' },
          _focus: { borderColor: 'brand.600', boxShadow: '0 0 0 1px #2563EB' },
        },
      },
    },
  },

  Textarea: {
    defaultProps: { focusBorderColor: 'brand.600' },
    variants: {
      outline: {
        borderRadius: 'md',
        borderColor:  'slate.300',
        fontSize:     'sm',
        _hover:  { borderColor: 'slate.400' },
        _focus: { borderColor: 'brand.600', boxShadow: '0 0 0 1px #2563EB' },
      },
    },
  },

  // Montserrat headings — tight tracking, bold confidence
  Heading: {
    baseStyle: {
      fontFamily:    'heading',
      letterSpacing: '-0.02em',
      fontWeight:    '700',
      color:         'slate.800',
    },
  },

  // Pill-shaped badges — distinguishes from structural blocks
  Badge: {
    baseStyle: {
      borderRadius: 'full',
      fontWeight:   '600',
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
      fontSize:      '10px',
    },
  },

  Modal: {
    baseStyle: {
      dialog: {
        borderRadius: '2xl',
        boxShadow:    'xl',
        bg:           'white',
      },
      header: {
        fontFamily:    'heading',
        fontWeight:    '700',
        fontSize:      'lg',
        letterSpacing: '-0.02em',
        pb:            3,
        color:         'slate.800',
      },
      overlay: {
        backdropFilter: 'blur(2px)',
      },
    },
  },

  // Clean B2B table — high contrast headers, generous row height
  Table: {
    variants: {
      simple: {
        th: {
          fontFamily:    'heading',
          fontSize:      '11px',
          fontWeight:    '700',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color:         'slate.500',
          borderColor:   'slate.200',
          py:            3,
          bg:            'slate.50',
        },
        td: {
          borderColor: 'slate.100',
          py:          3.5,
          fontSize:    'sm',
          color:       'slate.800',
        },
      },
    },
  },

  Tooltip: {
    baseStyle: {
      borderRadius: 'md',
      fontWeight:   '600',
      fontSize:     'xs',
      bg:           'slate.800',
      color:        'white',
      px:           3,
      py:           1.5,
    },
  },

  FormLabel: {
    baseStyle: {
      fontWeight: '600',
      fontSize:   'sm',
      color:      'slate.700',
      mb:         1.5,
      letterSpacing: '0.01em',
    },
  },

  // Progress bar — teal by default
  Progress: {
    defaultProps: { colorScheme: 'teal' },
    baseStyle: {
      track:     { borderRadius: 'full', bg: 'slate.200' },
      filledTrack: { borderRadius: 'full' },
    },
  },
};

const theme = extendTheme({
  config,
  colors,
  fonts,
  shadows,
  radii,
  components,
  styles: {
    global: {
      'html, body': {
        bg:                   'slate.50',  // warm off-white surface
        color:                'slate.800',
        WebkitFontSmoothing:  'antialiased',
        MozOsxFontSmoothing:  'grayscale',
        lineHeight:           '1.6',
      },
      // Tonal separation — card borders use outline-variant
      '*': {
        borderColor: 'slate.200',
      },
      // Refined scrollbar
      '::-webkit-scrollbar':        { width: '5px', height: '5px' },
      '::-webkit-scrollbar-track':  { bg: 'transparent' },
      '::-webkit-scrollbar-thumb':  { bg: 'slate.300', borderRadius: 'full' },
      '::-webkit-scrollbar-thumb:hover': { bg: 'slate.400' },
    },
  },
});

export default theme;
