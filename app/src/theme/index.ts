import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
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

  // Primary: MindStats Navy — Desing.md brand guide
  brand: {
    50:  '#E8F3ED',  // ★ MINT — feature block bg (Desing.md)
    100: '#CCE0FF',  // light badge bg
    200: '#99BBFF',  // medium-light
    300: '#6699EE',  // accent light
    400: '#3377CC',  // interactive mid
    500: '#1155BB',  // primary interactive
    600: '#003366',  // ★ PRIMARY — MindStats navy (Desing.md)
    700: '#002952',  // hover state
    800: '#001F3D',  // deep navy / sidebar
    900: '#001428',  // darkest
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
  card:         '0 1px 3px rgba(0,0,0,0.06)',
  'card-hover': '0 4px 16px rgba(0,0,0,0.10)',
  'card-focus': '0 0 0 3px rgba(0,51,102,0.20)',
  'brand-glow': '0 4px 20px rgba(0,51,102,0.20)',
  'teal-glow':  '0 4px 20px rgba(20,184,166,0.20)',
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
      borderRadius: 'full',
      letterSpacing: '0.01em',
      _focusVisible: { boxShadow: '0 0 0 3px rgba(0,51,102,0.30)' },
    },
    sizes: {
      lg: { h: '52px', px: '28px', fontSize: 'md', borderRadius: 'full' },
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
          borderColor:  'gray.300',
          bg:           '#f3f3f4',
          fontSize:     'sm',
          _hover:       { borderColor: 'gray.400' },
          _focus: {
            bg:          'white',
            borderColor: 'brand.600',
            boxShadow:   '0 0 0 1px var(--chakra-colors-brand-600)',
          },
          _placeholder: { color: 'gray.400' },
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
          borderColor:  'gray.300',
          bg:           '#f3f3f4',
          fontSize:     'sm',
          _hover: { borderColor: 'gray.400' },
          _focus: { bg: 'white', borderColor: 'brand.600', boxShadow: '0 0 0 1px var(--chakra-colors-brand-600)' },
        },
      },
    },
  },

  Textarea: {
    defaultProps: { focusBorderColor: 'brand.600' },
    variants: {
      outline: {
        borderRadius: 'md',
        borderColor:  'gray.300',
        bg:           '#f3f3f4',
        fontSize:     'sm',
        _hover:  { borderColor: 'gray.400' },
        _focus: { bg: 'white', borderColor: 'brand.600', boxShadow: '0 0 0 1px var(--chakra-colors-brand-600)' },
      },
    },
  },

  // Montserrat headings — tight tracking, bold confidence
  Heading: {
    baseStyle: {
      fontFamily:    'heading',
      letterSpacing: '-0.02em',
      fontWeight:    '700',
      color:         '#003366',
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
        color:         'gray.800',
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
          color:         'gray.600',
          borderColor:   'gray.200',
          py:            3,
          bg:            'gray.50',
        },
        td: {
          borderColor: 'gray.100',
          py:          3.5,
          fontSize:    'sm',
          color:       'gray.800',
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
      color:      'gray.700',
      mb:         1.5,
      letterSpacing: '0.01em',
    },
  },

  // Progress bar — teal by default
  Progress: {
    defaultProps: { colorScheme: 'teal' },
    baseStyle: {
      track:     { borderRadius: 'full', bg: 'gray.200' },
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
        bg:                   'white',
        color:                '#333333',
        WebkitFontSmoothing:  'antialiased',
        MozOsxFontSmoothing:  'grayscale',
        lineHeight:           '1.6',
      },
      '*': {
        borderColor: '#DADADA',
      },
      // Refined scrollbar
      '::-webkit-scrollbar':        { width: '5px', height: '5px' },
      '::-webkit-scrollbar-track':  { bg: 'transparent' },
      '::-webkit-scrollbar-thumb':  { bg: 'gray.300', borderRadius: 'full' },
      '::-webkit-scrollbar-thumb:hover': { bg: 'gray.400' },
    },
  },
});

export default theme;
