'use client'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import type { ReactNode } from 'react'

import { theme } from '@/theme/theme'

type ThemeProviderProps = {
	children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => (
	<AppRouterCacheProvider>
		<MuiThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</MuiThemeProvider>
	</AppRouterCacheProvider>
)
