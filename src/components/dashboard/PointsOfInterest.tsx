'use client'

import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import { Box, Card, Stack, Typography } from '@mui/material'
import { useMemo } from 'react'

import type {
	MpdMeasurement,
	SurveyMetric,
	SurveySelection,
	UkriMeasurement,
} from '@/types/survey'

type PointsOfInterestProps = {
	metric: SurveyMetric
	mpdData: MpdMeasurement[]
	ukriData: UkriMeasurement[]
	selected: SurveySelection | null
	onSelect: (selection: SurveySelection | null) => void
	onHighlight: (selection: SurveySelection | null) => void
}

export const PointsOfInterest = ({
	metric,
	mpdData,
	ukriData,
	selected,
	onSelect,
	onHighlight,
}: PointsOfInterestProps) => {
	const measurements = useMemo<SurveySelection[]>(() => {
		const data =
			metric === 'mpd'
				? mpdData.map((item) => ({
						id: `mpd-${item.section}`,
						start: item.start,
						value: item.mpd,
						coordinates: item.coordinates,
					}))
				: ukriData.map((item) => ({
						id: `ukri-${item.track}-${item.segment}`,
						start: item.start,
						value: item.ukri,
						coordinates: item.coordinates,
					}))

		return data.sort((a, b) => b.value - a.value).slice(0, 5)
	}, [metric, mpdData, ukriData])

	const unit = metric === 'mpd' ? 'mm' : 'm/km'

	const selectMeasurement = (measurement: SurveySelection) => {
		onSelect(selected?.id === measurement.id ? null : measurement)
	}

	return (
		<Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
			<Box sx={{ mb: 2 }}>
				<Typography variant='h6'>Highest measurements</Typography>

				<Typography
					variant='body2'
					sx={{
						mt: 0.5,
						color: 'text.secondary',
					}}
				>
					The highest {metric.toUpperCase()} values recorded across
					the route.
				</Typography>
			</Box>

			<Stack sx={{ gap: 1 }}>
				{measurements.map((measurement, index) => {
					const active = selected?.id === measurement.id

					return (
						<Box
							key={measurement.id}
							onClick={() => selectMeasurement(measurement)}
							onMouseEnter={() => onHighlight(measurement)}
							onMouseLeave={() => onHighlight(null)}
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 1.5,
								p: 1.5,
								borderRadius: 2,
								cursor: 'pointer',
								bgcolor: active
									? 'rgba(24, 119, 242, 0.08)'
									: 'transparent',
								transition: 'background-color 150ms ease',
								'&:hover': {
									bgcolor: active
										? 'rgba(24, 119, 242, 0.1)'
										: 'grey.100',
								},
							}}
						>
							<Typography
								variant='body2'
								sx={{
									width: 24,
									color: 'text.disabled',
									fontWeight: 700,
								}}
							>
								{String(index + 1).padStart(2, '0')}
							</Typography>

							<Box sx={{ flex: 1 }}>
								<Typography
									variant='body2'
									sx={{ fontWeight: 700 }}
								>
									{measurement.value.toFixed(2)} {unit}
								</Typography>

								<Typography
									variant='caption'
									sx={{ color: 'text.secondary' }}
								>
									{(measurement.start / 1000).toFixed(2)} km
									along route
								</Typography>
							</Box>

							<LocationOnOutlinedIcon
								sx={{
									fontSize: 19,
									color: active
										? 'primary.main'
										: 'text.disabled',
								}}
							/>
						</Box>
					)
				})}
			</Stack>
		</Card>
	)
}
