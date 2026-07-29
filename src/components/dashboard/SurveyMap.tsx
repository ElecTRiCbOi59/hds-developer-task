'use client'

import { Box, Card, Typography } from '@mui/material'
import { useEffect, useMemo } from 'react'
import { MapContainer, Polyline, TileLayer, useMap } from 'react-leaflet'

import type { MpdMeasurement, UkriMeasurement } from '@/types/survey'

type SurveyMapProps = {
	mpdData: MpdMeasurement[]
	ukriData: UkriMeasurement[]
}

type Position = [number, number]

const MapController = ({ route }: { route: Position[] }) => {
	const map = useMap()

	useEffect(() => {
		if (route.length <= 1) return

		map.fitBounds(route, {
			padding: [28, 28],
		})
	}, [map, route])

	return null
}

export const SurveyMap = ({ mpdData, ukriData }: SurveyMapProps) => {
	const route = useMemo(() => {
		const source =
			mpdData.length > 0
				? mpdData
				: ukriData.filter((item) => item.track === 1)

		return source.map(
			(item) =>
				[
					item.coordinates.latitude,
					item.coordinates.longitude,
				] as Position,
		)
	}, [mpdData, ukriData])

	const centre: Position = route[Math.floor(route.length / 2)] ?? [
		51.9409, -0.2742,
	]

	return (
		<Card sx={{ p: 3, borderRadius: 3 }}>
			<Box sx={{ mb: 2 }}>
				<Typography variant='h6'>Survey route</Typography>

				<Typography
					variant='body2'
					sx={{
						mt: 0.5,
						color: 'text.secondary',
					}}
				>
					GPS positions from the supplied survey data.
				</Typography>
			</Box>

			<Box
				sx={{
					height: 360,
					overflow: 'hidden',
					borderRadius: 2.5,
					bgcolor: 'grey.100',
					'& .leaflet-container': {
						width: '100%',
						height: '100%',
					},
				}}
			>
				<MapContainer center={centre} zoom={14} scrollWheelZoom={false}>
					<MapController route={route} />

					<TileLayer
						attribution='&copy; OpenStreetMap contributors'
						url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
					/>

					<Polyline
						positions={route}
						pathOptions={{
							color: '#1877F2',
							weight: 4,
							opacity: 0.8,
						}}
					/>
				</MapContainer>
			</Box>
		</Card>
	)
}
