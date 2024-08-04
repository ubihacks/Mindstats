import { StyleFunctionProps } from '@chakra-ui/theme-tools';


const baseStyle = {
	':focus:not(:focus-visible)': {
		boxShadow: 'none',
	},
	fontWeight: 'medium',

};

const variants = {
	primary: () => ({
		bg: 'brand.50',
		color: 'white',
		borderRadius: 'full',
	}),

	'menu-gradient': () => ({
		fontWeight: '500',
		color: 'gray.700',
		_hover: {
			color: 'white', bgGradient: 'linear(to-br, #5148E0, #9048E0)', boxShadow: '0px 26px 58px rgba(86, 34, 170, 0.29), 0px 9.49043px 21.171px rgba(86, 34, 170, 0.182635), 0px 4.60743px 10.2781px rgba(86, 34, 170, 0.141797), 0px 2.25865px 5.03852px rgba(86, 34, 170, 0.113448), 0px 0.893072px 1.99224px rgba(86, 34, 170, 0.0845645)', _disabled: {
				bgGradient: 'linear(to-br, #5148E0, #9048E0)',
			},
		},
		_active: { bgGradient: 'linear(to-b, #5f51c9, #7e56c8)', boxShadow: 'md' },
		_activeLink: { color: 'white', bgGradient: 'linear(to-b, #5f51c9, #7e56c8)', boxShadow: 'md' },
		_dark: { color: 'white', boxShadow: 'dark-md' },
		_disabled: {
			color: 'white',
			bgGradient: 'linear(to-br, #5148E0, #9048E0)',
			_hover: {
				bgGradient: 'linear(to-b, #5f51c9, #7e56c8)',
				boxShadow: 'md',
			},
		},
	}),
	gradient_purple_base: () => ({
		fontWeight: '500',
		color: 'white',
		padding: '10px 16px 10px 16px',
		bgGradient: 'linear(to-br, #5148E0, #9048E0)',
		_hover: {
			color: 'white', bgGradient: 'linear(to-br, #5148E0, #9048E0)', boxShadow: 'md', _hover: {
				_disabled: {
					bgGradient: 'linear(to-br, #5148E0, #9048E0)',
				},
			},
		},
		_active: { bgGradient: 'linear(to-b, #5f51c9, #7e56c8)', boxShadow: 'md' },
		_focus: { bgGradient: 'linear(to-b, #5f51c9, #7e56c8)', boxShadow: 'md' },
		_activeLink: { color: 'white', bgGradient: 'linear(to-b, #5f51c9, #7e56c8)', boxShadow: 'md' },
		_dark: { color: 'white', boxShadow: 'dark-md' },
		_disabled: {
			_hover: {
				bgGradient: 'linear(to-b, #5f51c9, #7e56c8)',
				boxShadow: 'md',
			},
		},
	}),

	'gradient-purple': (props: StyleFunctionProps) => ({
		...props.theme.components.Button.variants.gradient_purple_base(props),
	}),
	'gradient-purple-rounded': (props: StyleFunctionProps) => ({
		...props.theme.components.Button.variants.gradient_purple_base(props),
		borderRadius: 'full',
	}),
	'gradient-red': () => ({
		fontWeight: '500',
		color: 'white',
		padding: '10px 16px 10px 16px',
		bgGradient: 'linear(to-b, #E55B48, #E5734A)',
		_hover: {
			color: 'white', bgGradient: 'linear(to-b, #E55B48, #E5734A)', boxShadow: 'md', _disabled: {
				bgGradient: 'linear(to-b, #E55B48, #E5734A)',
			},
		},
		_active: { bgGradient: 'linear(to-b, #5f51c9, #7e56c8)', boxShadow: 'md' },
		_focus: { bgGradient: 'linear(to-b, #5f51c9, #7e56c8)', boxShadow: 'md' },
		_activeLink: { color: 'white', bgGradient: 'linear(to-b, #5f51c9, #7e56c8)', boxShadow: 'md' },
		_dark: { color: 'white', boxShadow: 'dark-md' },
		_disabled: {
			bgGradient: 'linear(to-b, #E55B48, #E5734A)',
			_hover: {
				bgGradient: 'linear(to-b, #5f51c9, #7e56c8)',
				boxShadow: 'md',
			},
		},
	}),

	'outline': () => ({
		borderWidth: 2,
		borderColor: 'gray.300',
		color: 'gray.500',
		_hover: {
			borderColor: 'gray.500'
		},
		_dark: {
			color: 'gray.200',
			borderColor: 'gray.200', _hover: {
				borderColor: 'gray.100'
			},
		}
	}),

	'outline-thin': () => ({
		borderWidth: 1,
		borderColor: 'white',
		borderRadius: 'full',
		color: 'white',
		_hover: {
			borderColor: 'white.500'
		},
		_dark: {
			color: 'gray.200',
			borderColor: 'gray.200', _hover: {
				borderColor: 'gray.100'
			},
		}
	}),

	'solid-light': () => ({
		color: '#3B36BC',
		background: '#FFFFFF'
	}),


	'solid-dark': () => ({
		bg: 'dark.200',
		fontWeight: '500',
		borderRadius: 'full',
		color: 'dark.700',
		_hover: { boxShadow: 'md', bg: 'dark.300' },
		_dark: {
			bg: 'dark.700',
			color: 'white',
			_hover: { boxShadow: 'md', bg: 'dark.900' },
		},
	}),

	'rounded-outline': () => ({
		fontWeight: '500',
		borderRadius: 'full',
		borderWidth: 2,
		borderColor: 'gray.200',
		color: 'gray.500',
		_hover: {
			borderColor: 'gray.500'
		},
		_dark: {
			color: 'white',
			borderColor: 'gray.200', _hover: {
				borderColor: 'gray.100'
			},
		}

	}),
	success: () => ({
		bg: 'green.400',
		color: 'white',

		_dark: {
			bg: 'green.500',
			color: 'white',
			_hover: {
				bg: 'green.600',

			}
		},
		_hover: {
			bg: 'green.500',

			_disabled: {
				bg: "green.500",
			},
		},

	}),
	alert: () => ({
		bg: 'red.500',
		color: 'white',
		_dark: {
			bg: 'red.500',
			color: 'black',
		},
	}),
};

export default {
	baseStyle,
	variants,
};
