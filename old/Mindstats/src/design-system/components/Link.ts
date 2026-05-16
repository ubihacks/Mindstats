import { ComponentStyleConfig } from '@chakra-ui/react';

const Link: ComponentStyleConfig = {

	variants: {
		'highlight': {
			color: 'secondary.500',
			_dark: {
				color: 'secondary.200',
			}
		},

		'highlight-light': () => ({	
			color: 'purpleBlue.500',

		}),
	},
};

export default Link;
