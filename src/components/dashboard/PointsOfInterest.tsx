'use client'

import {
	Box,
	Button,
	ButtonBase,
	Card,
	Chip,
	Stack,
	Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useMemo } from 'react'

import { Icon } from '@/components/icons/Icon'
import { dataColours } from '@/theme/theme'
import type {
	ChartMode,
	MpdMeasurement,
	SurveySelection,
	UkriMeasurement,
} from '@/types/survey'
import {
	getPointOfInterestGroups,
	POINT_OF_INTEREST_PERCENT,
} from '@/utils/pointsOfInterest'

type PointsOfInterestProps = {
	mode: ChartMode
	selected: SurveySelection | null
	mpdData: MpdMeasurement[]
	ukriData: UkriMeasurement[]
	showAllOnMap: boolean
	onShowAllOnMapChange: (show: boolean) => void
	onSelect: (selection: SurveySelection | null) => void
	onHover: (selection: SurveySelection | null) => void
}

export const PointsOfInterest = ({
	mode,
	selected,
	mpdData,
	ukriData,
	showAllOnMap,
	onShowAllOnMapChange,
	onSelect,
	onHover,
}: PointsOfInterestProps) => {
	const groups = useMemo(
		() => getPointOfInterestGroups(mode, mpdData, ukriData),
		[mode, mpdData, ukriData],
	)

	const totalPoints = groups.reduce(
		(total, group) => total + group.points.length,
		0,
	)

	return (
		<Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
			<Box sx={{ mb: 2.5 }}>
				<Stack
					sx={{
						flexDirection: 'row',
						alignItems: 'center',
						gap: 1,
						flexWrap: 'wrap',
					}}
				>
					<Typography variant='h6'>Points of interest</Typography>
					<Chip
						label={`Top ${POINT_OF_INTEREST_PERCENT * 100}% · ${totalPoints}`}
						size='small'
						sx={{
							height: 22,
							bgcolor: 'grey.100',
							color: 'text.secondary',
							fontSize: 11,
							fontWeight: 700,
						}}
					/>
				</Stack>

				<Button
					size='small'
					variant={showAllOnMap ? 'contained' : 'outlined'}
					startIcon={<Icon name='location' size={16} />}
					aria-pressed={showAllOnMap}
					onClick={() => onShowAllOnMapChange(!showAllOnMap)}
					sx={{ mt: 1.25 }}
				>
					{showAllOnMap ? 'Hide from map' : 'Show all on map'}
				</Button>

				<Typography
					variant='body2'
					sx={{ mt: 1.5, color: 'text.secondary' }}
				>
					Highest measurements in the active view. Hover to preview a
					location, or select it to keep it highlighted.
				</Typography>
			</Box>

			<Box
				sx={{
					maxHeight: 360,
					overflowY: 'auto',
					pr: 0.5,
				}}
			>
				<Stack sx={{ gap: 2 }}>
					{groups.map((group) => (
						<Box key={group.metric}>
							{mode === 'combined' && (
								<Stack
									sx={{
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'space-between',
										mb: 0.75,
									}}
								>
									<Typography
										variant='caption'
										sx={{
											fontWeight: 800,
											color: 'text.secondary',
										}}
									>
										{group.label}
									</Typography>

									<Typography
										variant='caption'
										sx={{ color: 'text.disabled' }}
									>
										{group.points.length} points
									</Typography>
								</Stack>
							)}

							<Stack sx={{ gap: 0.75 }}>
								{group.points.map((point, index) => {
									const active = selected?.id === point.id
									const metricColour =
										point.metric === 'mpd'
											? dataColours.mpd
											: dataColours.ukri

									return (
										<ButtonBase
											key={point.id}
											onClick={() =>
												onSelect(active ? null : point)
											}
											onMouseEnter={() => onHover(point)}
											onMouseLeave={() => onHover(null)}
											aria-pressed={active}
											sx={{
												width: '100%',
												p: 1.25,
												borderRadius: 2,
												textAlign: 'left',
												bgcolor: active
													? alpha(metricColour, 0.08)
													: 'transparent',
												'&:hover': {
													bgcolor: 'grey.100',
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
														? metricColour
														: 'grey.100',
													color: active
														? 'common.white'
														: 'text.secondary',
													fontSize: 11,
													fontWeight: 800,
												}}
											>
												{String(index + 1).padStart(
													2,
													'0',
												)}
											</Box>

											<Box sx={{ flex: 1, ml: 1.25 }}>
												<Stack
													sx={{
														flexDirection: 'row',
														alignItems: 'center',
														gap: 0.75,
														flexWrap: 'wrap',
													}}
												>
													<Typography
														sx={{ fontWeight: 700 }}
													>
														{point.value.toFixed(2)}{' '}
														{point.unit}
													</Typography>

													{mode === 'combined' && (
														<Chip
															label={point.metric.toUpperCase()}
															size='small'
															sx={{
																height: 18,
																fontSize: 9,
																fontWeight: 800,
																color: metricColour,
															}}
														/>
													)}
												</Stack>

												<Typography
													variant='caption'
													sx={{
														color: 'text.secondary',
													}}
												>
													{(
														point.start / 1000
													).toFixed(2)}{' '}
													km along route
												</Typography>
											</Box>

											<Box
												sx={{
													display: 'flex',
													color: metricColour,
												}}
											>
												<Icon
													name='location'
													size={19}
												/>
											</Box>
										</ButtonBase>
									)
								})}
							</Stack>
						</Box>
					))}
				</Stack>
			</Box>
		</Card>
	)
}
