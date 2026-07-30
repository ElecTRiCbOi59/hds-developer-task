import 'leaflet/dist/leaflet.css'

import type { Metadata } from 'next'

import { ThemeProvider } from '@/components/ThemeProvider'

import './globals.css'

export const metadata: Metadata = {
	title: 'HDS Survey Dashboard',
	description: 'A602 road survey data dashboard',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	)
}
