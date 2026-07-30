'use client'

import { Box, Card, Typography } from '@mui/material'
import { useEffect, useMemo } from 'react'
import {
	CircleMarker,
	MapContainer,
	Polyline,
	TileLayer,
	Tooltip,
	useMap,
} from 'react-leaflet'

import type {
	MpdMeasurement,
	SurveyMetric,
	SurveySelection,
	UkriMeasurement,
} from '@/types/survey'

type SurveyMapProps = {
	metric: SurveyMetric
	selected: SurveySelection | null
	highlighted: SurveySelection | null
	mpdData: MpdMeasurement[]
	ukriData: UkriMeasurement[]
	onSelect: (selection: SurveySelection | null) => void
}

type Position = [number, number]

type MapControllerProps = {
	route: Position[]
	selectedPosition?: Position
}

const MapController = ({ route, selectedPosition }: MapControllerProps) => {
	const map = useMap()

	useEffect(() => {
		if (selectedPosition) return
		if (route.length <= 1) return

		map.fitBounds(route, {
			padding: [28, 28],
		})
	}, [map, route, selectedPosition])

	useEffect(() => {
		if (!selectedPosition) return

		map.flyTo(selectedPosition, Math.max(map.getZoom(), 16), {
			duration: 0.6,
		})
	}, [map, selectedPosition])

	return null
}

export const SurveyMap = ({
	metric,
	selected,
	highlighted,
	mpdData,
	ukriData,
	onSelect,
}: SurveyMapProps) => {
	const route = useMemo(() => {
		const source =
			metric === 'mpd'
				? mpdData
				: ukriData.filter((item) => item.track === 1)

		return source.map(
			(item) =>
				[
					item.coordinates.latitude,
					item.coordinates.longitude,
				] as Position,
		)
	}, [metric, mpdData, ukriData])

	const active = highlighted ?? selected

	const activePosition = active?.coordinates
		? ([
				active.coordinates.latitude,
				active.coordinates.longitude,
			] as Position)
		: undefined

	const selectedPosition = selected?.coordinates
		? ([
				selected.coordinates.latitude,
				selected.coordinates.longitude,
			] as Position)
		: undefined

	const centre: Position = route[Math.floor(route.length / 2)] ?? [
		51.9409, -0.2742,
	]

	return (
		<Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
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
					<MapController
						route={route}
						selectedPosition={selectedPosition}
					/>

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

					{active && activePosition && (
						<CircleMarker
							center={activePosition}
							radius={8}
							pathOptions={{
								color: '#fff',
								fillColor: '#1877F2',
								fillOpacity: 1,
								weight: 3,
							}}
							eventHandlers={{
								click: () =>
									onSelect(
										selected?.id === active.id
											? null
											: active,
									),
							}}
						>
							<Tooltip permanent direction='top'>
								{(active.start / 1000).toFixed(2)} km
							</Tooltip>
						</CircleMarker>
					)}
				</MapContainer>
			</Box>
		</Card>
	)
}
