import { getColor, mode, StyleFunctionProps } from '@chakra-ui/theme-tools';

const parts = ['field', 'menu', 'option'];

const baseStyle = {
	field: {
		width: '100%',
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		transition: 'all 50ms ease',
	},
	option: {
		display: 'flex',
		alignItems: 'center',
		cursor: 'pointer',
		_disabled: {
			opacity: 0.4,
			cursor: 'not-allowed',
		},
	},
	menu: {
		minW: '3xs',
	},
};

const variants = {
	outline: (props: StyleFunctionProps) => ({
		menu: {
			bg: mode('white', 'gray.800')(props),
			boxShadow: mode('sm', 'sm-dark')(props),
			color: 'inherit',
			minW: '3xs',
			py: '2',
			borderRadius: 'md',
			borderWidth: '1px',
		},
		option: {
			_focus: {
				bg: mode('gray.100', 'whiteAlpha.100')(props),
			},
			_hover: {
				bg: mode('gray.100', 'whiteAlpha.100')(props),
			},
			_selected: {
				bg: mode('gray.200', 'whiteAlpha.200')(props),
			},
		},
		field: {
			border: '1px solid',
			borderColor: 'inherit',
			_hover: {
				borderColor: mode('gray.300', 'whiteAlpha.400')(props),
			},
			_disabled: {
				opacity: 0.4,
				cursor: 'not-allowed',
				borderColor: 'inherit',
			},
			_readOnly: {
				boxShadow: 'none !important',
				userSelect: 'all',
			},
			_invalid: {
				borderColor: getColor(props.theme, mode('red.500', 'red.300')(props)),
				boxShadow: `0 0 0 1px ${getColor(props.theme, mode('red.500', 'red.300')(props))}`,
			},
			_focus: {
				borderColor: getColor(props.theme, mode(`${props.colorScheme}.500`, `${props.colorScheme}.300`)(props)),
				boxShadow: `0 0 0 1px ${getColor(props.theme, mode(`${props.colorScheme}.500`, `${props.colorScheme}.300`)(props))}`,
			},
			_expanded: {
				borderColor: getColor(props.theme, mode(`${props.colorScheme}.500`, `${props.colorScheme}.300`)(props)),
				boxShadow: `0 0 0 1px ${getColor(props.theme, mode(`${props.colorScheme}.500`, `${props.colorScheme}.300`)(props))}`,
			},
		},
	}),
};

const sizes = {
	sm: {
		field: {
			px: 3,
			h: 8,
			fontSize: 'sm',
			borderRadius: 'sm',
		},
		menu: {
			fontSize: 'sm',
			borderRadius: 'sm',
		},
		option: {
			px: 3,
			h: 8,
			fontSize: 'sm',
		},
	},
	md: {
		field: {
			px: 4,
			h: 10,
			fontSize: 'md',
			borderRadius: 'md',
		},
		menu: {
			fontSize: 'md',
			borderRadius: 'md',
		},
		option: {
			px: 4,
			h: 10,
			fontSize: 'md',
		},
	},
	lg: {
		field: {
			px: 4,
			h: 12,
			fontSize: 'lg',
			borderRadius: 'md',
		},
		menu: {
			fontSize: 'lg',
			borderRadius: 'md',
		},
		option: {
			px: 4,
			h: 12,
			fontSize: 'lg',
		},
	},
};

export default {
	parts,
	baseStyle,
	variants,
	sizes,
	defaultProps: {
		size: 'md',
		variant: 'outline',
		colorScheme: 'brand',
	},
};
