'use client'

import {
	Box,
	Card,
	Chip,
	IconButton,
	Stack,
	Tooltip as MuiTooltip,
	Typography,
	useMediaQuery,
	useTheme,
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

import { Icon } from '@/components/icons/Icon'
import { colours, dataColours, shadows } from '@/theme/theme'
import { getPointOfInterestGroups } from '@/utils/pointsOfInterest'
import type {
	ChartMode,
	MpdMeasurement,
	SurveySelection,
	UkriMeasurement,
} from '@/types/survey'

type SurveyMapProps = {
	mode: ChartMode
	selected: SurveySelection | null
	highlighted: SurveySelection | null
	mpdData: MpdMeasurement[]
	ukriData: UkriMeasurement[]
	showPointsOfInterest: boolean
	onSelect: (selection: SurveySelection | null) => void
}

type Position = [number, number]

type UkriRoute = {
	track: number
	positions: Position[]
}

type MapControllerProps = {
	positions: Position[]
	resetKey: number
	selectedPosition?: Position
	compact: boolean
}

const MapController = ({
	positions,
	resetKey,
	selectedPosition,
	compact,
}: MapControllerProps) => {
	const map = useMap()

	useEffect(() => {
		if (selectedPosition || positions.length <= 1) return

		map.fitBounds(positions, {
			padding: compact ? [12, 12] : [28, 28],
			animate: false,
		})
	}, [compact, map, positions, resetKey, selectedPosition])

	useEffect(() => {
		if (!selectedPosition) return

		map.flyTo(selectedPosition, Math.max(map.getZoom(), 16), {
			duration: 0.6,
		})
	}, [map, selectedPosition])

	return null
}

const toPosition = (coordinates: {
	latitude: number
	longitude: number
}): Position => [coordinates.latitude, coordinates.longitude]

const getUkriTrackColour = (track: number) =>
	dataColours.ukriTracks[(track - 1) % dataColours.ukriTracks.length]

export const SurveyMap = ({
	mode,
	selected,
	highlighted,
	mpdData,
	ukriData,
	showPointsOfInterest,
	onSelect,
}: SurveyMapProps) => {
	const theme = useTheme()
	const compact = useMediaQuery(theme.breakpoints.down('sm'))
	const [resetKey, setResetKey] = useState(0)

	const mpdRoute = useMemo(
		() => mpdData.map((item) => toPosition(item.coordinates)),
		[mpdData],
	)

	const ukriRoutes = useMemo<UkriRoute[]>(() => {
		const tracks = new Map<number, Position[]>()

		ukriData.forEach((item) => {
			const positions = tracks.get(item.track) ?? []
			positions.push(toPosition(item.coordinates))
			tracks.set(item.track, positions)
		})

		return Array.from(tracks.entries())
			.sort(([trackA], [trackB]) => trackA - trackB)
			.map(([track, positions]) => ({ track, positions }))
	}, [ukriData])

	const visiblePositions = useMemo(() => {
		if (mode === 'mpd') return mpdRoute
		if (mode === 'ukri')
			return ukriRoutes.flatMap((route) => route.positions)

		return [...mpdRoute, ...ukriRoutes.flatMap((route) => route.positions)]
	}, [mode, mpdRoute, ukriRoutes])

	const active = highlighted ?? selected
	const activeMetric = active?.metric

	const focusedMetric =
		mode === 'combined' && !showPointsOfInterest
			? (highlighted?.metric ?? selected?.metric)
			: undefined

	const pointsOfInterest = useMemo(
		() =>
			getPointOfInterestGroups(mode, mpdData, ukriData).flatMap(
				(group) => group.points,
			),
		[mode, mpdData, ukriData],
	)

	const activePosition = active ? toPosition(active.coordinates) : undefined
	const selectedPosition = selected
		? toPosition(selected.coordinates)
		: undefined

	const centre: Position = visiblePositions[
		Math.floor(visiblePositions.length / 2)
	] ?? [51.9409, -0.2742]

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

	const markerColour =
		activeMetric === 'ukri' ? dataColours.ukri : dataColours.mpd

	const showMpdRoute =
		mode === 'mpd' || (mode === 'combined' && focusedMetric !== 'ukri')

	const showUkriRoutes =
		mode === 'ukri' || (mode === 'combined' && focusedMetric !== 'mpd')

	const showingBothRoutes = mode === 'combined' && !focusedMetric

	return (
		<Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
			<Box sx={{ mb: 2 }}>
				<Stack
					sx={{
						flexDirection: { xs: 'column', sm: 'row' },
						alignItems: { xs: 'flex-start', sm: 'center' },
						justifyContent: 'space-between',
						gap: 1,
					}}
				>
					<Box>
						<Typography variant='h6'>Survey route</Typography>
						<Typography
							variant='body2'
							sx={{ mt: 0.5, color: 'text.secondary' }}
						>
							{mode === 'combined'
								? 'MPD route and all four UKRI tracks.'
								: mode === 'ukri'
									? 'All four UKRI tracks across the surveyed route.'
									: 'MPD GPS positions across the surveyed route.'}
						</Typography>
					</Box>

					{mode === 'combined' && (
						<Stack sx={{ flexDirection: 'row', gap: 0.75 }}>
							<Chip
								label='MPD'
								size='small'
								variant='outlined'
								sx={{
									color: dataColours.mpd,
									borderColor: dataColours.mpd,
									fontWeight: 700,
								}}
							/>
							<Chip
								label='UKRI'
								size='small'
								variant='outlined'
								sx={{
									color: dataColours.ukri,
									borderColor: dataColours.ukri,
									fontWeight: 700,
								}}
							/>
						</Stack>
					)}
				</Stack>
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
				<MapContainer
					key={mode}
					center={centre}
					zoom={14}
					scrollWheelZoom={false}
				>
					<MapController
						positions={visiblePositions}
						resetKey={resetKey}
						selectedPosition={selectedPosition}
						compact={compact}
					/>

					<TileLayer
						attribution='&copy; OpenStreetMap contributors'
						url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
					/>

					{showMpdRoute && (
						<Polyline
							key={`mpd-${mode}-${focusedMetric ?? 'all'}`}
							positions={mpdRoute}
							pathOptions={{
								color: dataColours.mpd,
								weight: showingBothRoutes ? 5 : 4.5,
								opacity: 0.9,
							}}
						/>
					)}

					{showUkriRoutes &&
						ukriRoutes.map((route) => (
							<Polyline
								key={`ukri-${route.track}-${mode}-${focusedMetric ?? 'all'}`}
								positions={route.positions}
								pathOptions={{
									color: getUkriTrackColour(route.track),
									weight: showingBothRoutes ? 3 : 3.5,
									opacity: showingBothRoutes ? 0.9 : 0.8,
									dashArray: showingBothRoutes
										? '8 8'
										: undefined,
								}}
							/>
						))}

					{showPointsOfInterest &&
						pointsOfInterest.map((point) => {
							const colour =
								point.metric === 'mpd'
									? dataColours.mpd
									: dataColours.ukri

							return (
								<CircleMarker
									key={`poi-${point.id}`}
									center={toPosition(point.coordinates)}
									radius={4}
									pathOptions={{
										color: colours.white,
										fillColor: colour,
										fillOpacity: 0.85,
										weight: 1.5,
									}}
									eventHandlers={{
										click: () => handleMarkerClick(point),
									}}
								>
									<Tooltip direction='top'>
										{point.metric.toUpperCase()} ·{' '}
										{point.value.toFixed(2)} {point.unit}
									</Tooltip>
								</CircleMarker>
							)
						})}

					{active && activePosition && (
						<CircleMarker
							center={activePosition}
							radius={8}
							pathOptions={{
								color: colours.white,
								fillColor: markerColour,
								fillOpacity: 1,
								weight: 3,
							}}
							eventHandlers={{
								click: () => handleMarkerClick(active),
							}}
						>
							<Tooltip permanent direction='top'>
								{active.metric.toUpperCase()} ·{' '}
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
							'&:hover': { bgcolor: 'grey.100' },
						}}
					>
						<Icon name='resetMap' size={19} />
					</IconButton>
				</MuiTooltip>
			</Box>
		</Card>
	)
}
