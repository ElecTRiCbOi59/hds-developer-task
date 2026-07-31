import { describe, expect, it, jest } from '@jest/globals'

import { ThemeProvider } from '@/components/ThemeProvider'
import { renderComponent } from '../helpers/renderComponent'

jest.mock('@mui/material-nextjs/v16-appRouter', () => ({
	AppRouterCacheProvider: ({ children }: { children: React.ReactNode }) =>
		children,
}))

describe('ThemeProvider', () => {
	it('renders its children inside the application theme', () => {
		const view = renderComponent(
			<ThemeProvider>
				<span>Dashboard content</span>
			</ThemeProvider>,
		)

		expect(view.container.textContent).toContain('Dashboard content')
		view.cleanup()
	})
})
