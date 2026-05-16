import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// ─── Insight Professional Design System ─────────────────────────────────────
// Primary: Deep Navy  |  Secondary: Teal  |  Surface: Warm Off-White
// Fonts: Montserrat (headings) + Inter (body)
// ─────────────────────────────────────────────────────────────────────────────

const colors = {
  // Primary: Deep Navy — institutional trust & professional authority
  brand: {
    50:  '#d5e3ff',  // primary-fixed — very light tint for badges/backgrounds
    100: '#a7c8ff',  // inverse-primary — light blue for dark-bg accents
    200: '#799dd6',  // on-primary-container
    300: '#4d7bb0',
    400: '#3a5f94',  // surface-tint — medium navy, icon accents on dark bg
    500: '#2a4d7a',
    600: '#1f477b',  // on-primary-fixed-variant
    700: '#003366',  // primary-container → PRIMARY CTA BUTTON
    800: '#001e40',  // primary → very dark navy (sidebar bg)
    900: '#001020',  // deepest
  },

  // Secondary: Teal — interactive elements, focus states, success
  teal: {
    50:  '#e8fafa',
    100: '#93f2f2',  // secondary-fixed
    200: '#76d6d5',  // secondary-fixed-dim
    300: '#4dbfbf',
    400: '#26a8a8',
    500: '#008f8f',
    600: '#006a6a',  // secondary — focus borders, active states, toggles
    700: '#004f4f',  // on-secondary-fixed-variant
    800: '#003838',
    900: '#002020',  // on-secondary-fixed
  },

  // Neutral: Warm Gray — surfaces and text (replaces cool slate)
  slate: {
    50:  '#fbf9f8',  // surface / page background
    100: '#f5f3f3',  // surface-container-low
    200: '#efeded',  // surface-container / card borders
    300: '#e4e2e2',  // surface-container-highest / dividers
    400: '#c3c6d1',  // outline-variant
    500: '#737780',  // outline / secondary text
    600: '#43474f',  // on-surface-variant
    700: '#303031',  // inverse-surface
    800: '#1b1c1c',  // on-surface / primary text
    900: '#121212',  // deepest dark
  },
};

const fonts = {
  heading: `'Montserrat', 'Inter', system-ui, -apple-system, sans-serif`,
  body:    `'Inter', system-ui, -apple-system, sans-serif`,
  mono:    `'JetBrains Mono', 'Fira Code', 'Consolas', monospace`,
};

// Soft-glow elevation — avoids heavy drop shadows per spec
const shadows = {
  card:       '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.03)',
  'card-hover': '0 4px 20px rgba(0,0,0,0.05), 0 2px 8px -2px rgba(0,0,0,0.04)',
  'card-focus': '0 0 0 3px rgba(0,106,106,0.20)',
  'brand-glow': '0 0 20px rgba(0,51,102,0.18)',
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
        bg:     props.colorScheme === 'brand' ? 'brand.700' : undefined,
        color:  props.colorScheme === 'brand' ? 'white'     : undefined,
        _hover: {
          bg:        props.colorScheme === 'brand' ? 'brand.800' : undefined,
          transform: 'translateY(-1px)',
          boxShadow: 'card-hover',
        },
        _active: {
          bg:        props.colorScheme === 'brand' ? 'brand.800' : undefined,
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
    defaultProps: { focusBorderColor: 'teal.600' },
    variants: {
      outline: {
        field: {
          borderRadius: 'md',
          borderColor:  'slate.300',
          bg:           'white',
          fontSize:     'sm',
          _hover:       { borderColor: 'slate.500' },
          _focus: {
            borderColor: 'teal.600',
            boxShadow:   '0 0 0 1px #006a6a',
          },
          _placeholder: { color: 'slate.400' },
        },
      },
    },
  },

  Select: {
    defaultProps: { focusBorderColor: 'teal.600' },
    variants: {
      outline: {
        field: {
          borderRadius: 'md',
          borderColor:  'slate.300',
          fontSize:     'sm',
          _hover: { borderColor: 'slate.500' },
          _focus: { borderColor: 'teal.600', boxShadow: '0 0 0 1px #006a6a' },
        },
      },
    },
  },

  Textarea: {
    defaultProps: { focusBorderColor: 'teal.600' },
    variants: {
      outline: {
        borderRadius: 'md',
        borderColor:  'slate.300',
        fontSize:     'sm',
        _hover:  { borderColor: 'slate.500' },
        _focus: { borderColor: 'teal.600', boxShadow: '0 0 0 1px #006a6a' },
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
