export default {
	global: () => ({
		body: {
			color: 'default',
			bg: 'bg-canvas',
		},
		'*::placeholder': {
			opacity: 1,
			color: 'muted',
		},
	}),
};
