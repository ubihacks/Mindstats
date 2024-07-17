const baseStyle = {
	track: {
		borderRadius: 'xl',
	},
};

const variants = {
	solid: {
		track: {
			bg: 'bg-muted',
		},
	},
	'on-accent': {
		track: {
			bg: 'transparent',
		},
		filledTrack: {
			bg: 'secondary.50',
		},
	},
};

const defaultProps = {
	colorScheme: 'purple',
	variant: 'solid',
};

export default {
	variants,
	baseStyle,
	defaultProps,
};
