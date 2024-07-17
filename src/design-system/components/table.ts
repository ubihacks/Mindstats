import { mode, StyleFunctionProps } from "@chakra-ui/theme-tools"


const baseStyle = {
	table: {
		bg: 'bg-surface',
		borderRadius: "lg",
		borderColor: 'gray.200',
	},
	maxW: '7xl',
	px: { base: '4', md: '8' },
}

const variants = {
	simple: (props: StyleFunctionProps) => ({
		th: {
			color: 'default',
			bg: mode('gray.50', 'gray.700')(props),
			p: '2',
		},
		tbody: {
			bg: 'bg-card',
		}
	}),

}

const sizes = {
	md: {
		td: {
			fontSize: 'sm',
		},
	},
}

export default {
	sizes,
	baseStyle,
	variants,
}
