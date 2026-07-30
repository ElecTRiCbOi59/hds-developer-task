'use client'

import { createTheme } from '@mui/material/styles'

export const colours = {
	primary: '#1877F2',
	primarySoft: '#E8F3FF',
	success: '#22C55E',
	successSoft: '#D8FBDE',
	successText: '#065E49',
	axis: '#919EAB',
	grid: '#EEF0F3',
}

export const shadows = {
	card: '0 0 2px rgba(145, 158, 171, 0.20), 0 12px 24px -4px rgba(145, 158, 171, 0.12)',
	floating: '0 8px 24px rgba(145, 158, 171, 0.12)',
	control: '0 1px 3px rgba(145, 158, 171, 0.20)',
	mapControl: '0 4px 12px rgba(28, 37, 46, 0.16)',
}

export const theme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			light: '#5B9CF6',
			main: colours.primary,
			dark: '#0C53B7',
		},
		success: {
			light: '#86E8AB',
			main: colours.success,
			dark: '#118D57',
		},
		grey: {
			50: '#FCFDFD',
			100: '#F9FAFB',
			200: '#F4F6F8',
			300: '#DFE3E8',
			400: '#C4CDD5',
			500: '#919EAB',
			600: '#637381',
			700: '#454F5B',
			800: '#1C252E',
			900: '#141A21',
		},
		background: {
			default: '#F4F6F8',
			paper: '#FFFFFF',
		},
		text: {
			primary: '#1C252E',
			secondary: '#637381',
		},
		divider: 'rgba(145, 158, 171, 0.20)',
	},
	shape: {
		borderRadius: 12,
	},
	typography: {
		fontFamily:
			'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
		h3: {
			fontSize: '2rem',
			fontWeight: 800,
			lineHeight: 1.25,
			letterSpacing: '-0.03em',
		},
		h4: {
			fontWeight: 800,
		},
		h5: {
			fontWeight: 700,
		},
		h6: {
			fontWeight: 700,
		},
		button: {
			textTransform: 'none',
			fontWeight: 700,
		},
	},
	components: {
		MuiCard: {
			styleOverrides: {
				root: {
					border: 0,
					boxShadow: shadows.card,
				},
			},
		},
		MuiButton: {
			defaultProps: {
				disableElevation: true,
			},
		},
	},
})
