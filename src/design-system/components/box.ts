import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools';


const baseStyle = {
 maxW: '7xl',
 px: { base: '4', md: '8' },
};

const variants = {
 card: (props: StyleFunctionProps) => ({
  ...props.theme.components.Container.variants.card_base(props),
  bg: 'white',
  boxShadow: "sm",
  _dark: {
   boxShadow: 'none',
   bg: 'gray.500',
  },
 }),
navbar: (props: StyleFunctionProps) => ({
    bg: props.theme.colors.primary, // Replace "primary" with the appropriate color from your design system
    width: '100vw', // Set the width to take the full screen
    _dark: {
        bg: props.theme.colors.darkPrimary, // Replace "darkPrimary" with the appropriate dark color from your design system
    },
})
};

export default { baseStyle, variants };
