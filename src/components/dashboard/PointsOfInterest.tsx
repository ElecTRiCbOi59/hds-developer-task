'use client'

import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import { Box, ButtonBase, Card, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'

import type {
	MpdMeasurement,
	SurveyMetric,
	SurveySelection,
	UkriMeasurement,
} from '@/types/survey'

type PointsOfInterestProps = {
	metric: SurveyMetric
	selected: SurveySelection | null
	mpdData: MpdMeasurement[]
	ukriData: UkriMeasurement[]
	onSelect: (selection: SurveySelection | null) => void
	onHover: (selection: SurveySelection | null) => void
}

type PointOfInterest = SurveySelection & {
	value: number
	unit: string
}

export const PointsOfInterest = ({
	metric,
	selected,
	mpdData,
	ukriData,
	onSelect,
	onHover,
}: PointsOfInterestProps) => {
	const points: PointOfInterest[] =
		metric === 'mpd'
			? [...mpdData]
					.sort((a, b) => b.mpd - a.mpd)
					.slice(0, 5)
					.map((item) => ({
						id: `mpd-${item.section}`,
						start: item.start,
						coordinates: item.coordinates,
						value: item.mpd,
						unit: 'mm',
					}))
			: [...ukriData]
					.sort((a, b) => b.ukri - a.ukri)
					.slice(0, 5)
					.map((item) => ({
						id: `ukri-${item.track}-${item.segment}`,
						start: item.start,
						coordinates: item.coordinates,
						value: item.ukri,
						unit: 'm/km',
					}))

	return (
		<Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
			<Box sx={{ mb: 2.5 }}>
				<Typography variant='h6'>Highest measurements</Typography>
				<Typography
					variant='body2'
					sx={{ mt: 0.5, color: 'text.secondary' }}
				>
					Hover to preview a location, or select it to keep it
					highlighted.
				</Typography>
			</Box>

			<Stack sx={{ gap: 0.75 }}>
				{points.map((point, index) => {
					const active = selected?.id === point.id

					return (
						<ButtonBase
							key={point.id}
							onClick={() => onSelect(active ? null : point)}
							onMouseEnter={() => onHover(point)}
							onMouseLeave={() => onHover(null)}
							aria-pressed={active}
							sx={{
								width: '100%',
								p: 1.5,
								borderRadius: 2,
								textAlign: 'left',
								bgcolor: active
									? (theme) =>
											alpha(
												theme.palette.primary.main,
												0.08,
											)
									: 'transparent',
								transition: 'background-color 150ms ease',
								'&:hover': {
									bgcolor: active
										? (theme) =>
												alpha(
													theme.palette.primary.main,
													0.1,
												)
										: 'grey.100',
								},
							}}
						>
							<Box
								sx={{
									width: 30,
									height: 30,
									display: 'grid',
									placeItems: 'center',
									borderRadius: 1.5,
									bgcolor: active
										? 'primary.main'
										: 'grey.100',
									color: active
										? 'primary.contrastText'
										: 'text.secondary',
									fontSize: 12,
									fontWeight: 800,
								}}
							>
								{String(index + 1).padStart(2, '0')}
							</Box>

							<Box sx={{ flex: 1, ml: 1.25 }}>
								<Typography sx={{ fontWeight: 700 }}>
									{point.value.toFixed(2)} {point.unit}
								</Typography>
								<Typography
									variant='caption'
									sx={{ color: 'text.secondary' }}
								>
									{(point.start / 1000).toFixed(2)} km along
									route
								</Typography>
							</Box>

							<LocationOnOutlinedIcon
								sx={{
									fontSize: 19,
									color: active
										? 'primary.main'
										: 'text.secondary',
								}}
							/>
						</ButtonBase>
					)
				})}
			</Stack>
		</Card>
	)
}
