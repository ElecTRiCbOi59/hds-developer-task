'use client'

import { createTheme } from '@mui/material/styles'

export const colours = {
	primary: '#3D8494',
	primaryLight: '#69A7B3',
	primaryDark: '#286372',
	primarySoft: '#EAF3F5',
	secondary: '#2B2D2F',
	secondaryLight: '#596064',
	secondaryDark: '#17191A',
	secondarySoft: '#EFF1F2',
	grid: '#E9EDEE',
	white: '#FFFFFF',
	grey: {
		50: '#FAFBFB',
		100: '#F6F8F8',
		200: '#EFF2F2',
		300: '#DDE3E4',
		400: '#BCC6C8',
		500: '#879497',
		600: '#667276',
		700: '#485256',
		800: '#2B3235',
		900: '#171B1D',
	},
}

export const dataColours = {
	mpd: '#3D8494',
	ukri: '#D97706',
	ukriTracks: ['#16A34A', '#2563EB', '#7C3AED', '#EA580C'],
}

export const shadows = {
	card: '0 1px 2px rgba(23, 27, 29, 0.04), 0 12px 28px rgba(23, 27, 29, 0.06)',
	floating: '0 10px 30px rgba(23, 27, 29, 0.10)',
	control: '0 1px 3px rgba(23, 27, 29, 0.12)',
	mapControl: '0 4px 14px rgba(23, 27, 29, 0.16)',
}

export const theme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			light: colours.primaryLight,
			main: colours.primary,
			dark: colours.primaryDark,
			contrastText: colours.white,
		},
		secondary: {
			light: colours.secondaryLight,
			main: colours.secondary,
			dark: colours.secondaryDark,
			contrastText: colours.white,
		},
		grey: colours.grey,
		background: {
			default: colours.grey[100],
			paper: colours.white,
		},
		text: {
			primary: colours.grey[900],
			secondary: colours.grey[600],
		},
		divider: 'rgba(72, 82, 86, 0.14)',
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
			lineHeight: 1.2,
			letterSpacing: '-0.035em',
		},
		h4: {
			fontWeight: 800,
		},
		h6: {
			fontWeight: 750,
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
					border: '1px solid rgba(72, 82, 86, 0.08)',
					boxShadow: shadows.card,
				},
			},
		},
		MuiButton: {
			defaultProps: {
				disableElevation: true,
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					fontWeight: 700,
				},
			},
		},
	},
})
