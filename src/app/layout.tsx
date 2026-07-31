import 'leaflet/dist/leaflet.css'

import type { Metadata } from 'next'

import { ThemeProvider } from '@/components/ThemeProvider'

import './globals.css'

export const metadata: Metadata = {
	title: 'A602 Road Survey | Highway Data Systems',
	description: 'MPD and UKRI road survey dashboard for Highway Data Systems',
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
