const Spinner = {
	// style object for base or default style
	baseStyle: {},
	// styles for different sizes ("sm", "md", "lg")
	sizes: {},
	// styles for different visual variants ("outline", "solid")
	variants: {
		primary: {
			emptyColor: 'gray.200',
			color: 'brand.500',
		},
	},
	// default values for `size` and `variant`
	defaultProps: {
		size: 'sm',
		variant: '',
	},
};

export default Spinner;
