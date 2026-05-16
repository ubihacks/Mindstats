const baseStyle = {
	tab: {
		fontWeight: 'medium',

		_focus: {
			boxShadow: 'none',
		},
		_focusVisible: {
			boxShadow: 'base',
		},
		_dark: {
			color: 'white',
			_focus: {
				color: 'black'
			},
			_active: {
				color: 'black'
			}

		}
	},
};

const variants = {
	line: {
		tab: {
			_selected: {
				color: 'accent',
			},
			_active: {
				bg: 'transparent',
			},
		},
	},
	enclosed: {
		tab: {
			_selected: {
				color: 'accent',
			},
		},
	},
	"soft-rounded": {
		tab: {
			borderRadius: 'sm',
			_selected: {
				color: 'accent',

			},
			_active: {
				bg: 'transparent',
			},
			_dark: {

				color: 'white',
				_selected: {
					color: 'black'
				}
			},

		},
	}
};

const sizes = {
	md: {
		tab: {
			fontSize: 'sm',
		},
	},
};

export default { baseStyle, variants, sizes };
