'use client'

import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#1877F2',
		},
		background: {
			default: '#F4F6F8',
			paper: '#FFFFFF',
		},
		text: {
			primary: '#1C252E',
			secondary: '#637381',
		},
	},
	shape: {
		borderRadius: 12,
	},
	typography: {
		fontFamily:
			'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
	},
})
