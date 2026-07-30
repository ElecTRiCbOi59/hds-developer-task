'use client'

import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded'
import {
	Box,
	Card,
	IconButton,
	Tooltip as MuiTooltip,
	Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import {
	CircleMarker,
	MapContainer,
	Polyline,
	TileLayer,
	Tooltip,
	useMap,
} from 'react-leaflet'

import { colours, shadows } from '@/theme/theme'
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
	resetKey: number
	selectedPosition?: Position
}

const MapController = ({
	route,
	resetKey,
	selectedPosition,
}: MapControllerProps) => {
	const map = useMap()

	useEffect(() => {
		if (selectedPosition || route.length <= 1) {
			return
		}

		map.fitBounds(route, {
			padding: [28, 28],
		})
	}, [map, resetKey, route, selectedPosition])

	useEffect(() => {
		if (!selectedPosition) {
			return
		}

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
	const [resetKey, setResetKey] = useState(0)

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

	const handleMarkerClick = (selection: SurveySelection) => {
		if (selected?.id === selection.id) {
			onSelect(null)
			setResetKey((value) => value + 1)
			return
		}

		onSelect(selection)
	}

	const resetMap = () => {
		onSelect(null)
		setResetKey((value) => value + 1)
	}

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
					position: 'relative',
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
						resetKey={resetKey}
						selectedPosition={selectedPosition}
					/>

					<TileLayer
						attribution='&copy; OpenStreetMap contributors'
						url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
					/>

					<Polyline
						positions={route}
						pathOptions={{
							color: colours.primary,
							weight: 4,
							opacity: 0.8,
						}}
					/>

					{active && activePosition && (
						<CircleMarker
							center={activePosition}
							radius={8}
							pathOptions={{
								color: '#FFFFFF',
								fillColor: colours.primary,
								fillOpacity: 1,
								weight: 3,
							}}
							eventHandlers={{
								click: () => handleMarkerClick(active),
							}}
						>
							<Tooltip permanent direction='top'>
								{(active.start / 1000).toFixed(2)} km
							</Tooltip>
						</CircleMarker>
					)}
				</MapContainer>

				<MuiTooltip title='Reset map view' arrow>
					<IconButton
						onClick={resetMap}
						aria-label='Reset map view'
						sx={{
							position: 'absolute',
							top: 12,
							right: 12,
							zIndex: 1000,
							width: 36,
							height: 36,
							bgcolor: 'background.paper',
							boxShadow: shadows.mapControl,
							'&:hover': {
								bgcolor: 'grey.100',
							},
						}}
					>
						<MyLocationRoundedIcon
							sx={{
								fontSize: 19,
							}}
						/>
					</IconButton>
				</MuiTooltip>
			</Box>
		</Card>
	)
}
