'use client'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {
	Box,
	ButtonBase,
	Card,
	Chip,
	IconButton,
	Stack,
	Tooltip,
	Typography,
	useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'

import { MetricSwitch } from '@/components/dashboard/MetricSwitch'
import type {
	ChartMode,
	MpdMeasurement,
	SurveyMetric,
	UkriMeasurement,
} from '@/types/survey'
import {
	type ChartSeries,
	getCombinedChartOptions,
	getCombinedChartSeries,
	getMpdChartData,
	getMpdChartOptions,
	getUkriChartOptions,
	getUkriTrackSeries,
} from '@/utils/chart'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

type SurveyChartProps = {
	mode: ChartMode
	onModeChange: (mode: ChartMode) => void
	selectedStart: number | null
	onSelect: (metric: SurveyMetric, start: number, track?: number) => void
	mpdData: MpdMeasurement[]
	ukriData: UkriMeasurement[]
}

type ChartLegendProps = {
	series: ChartSeries[]
	hiddenSeries: string[]
	onToggle: (name: string) => void
}

const ChartLegend = ({ series, hiddenSeries, onToggle }: ChartLegendProps) => {
	if (series.length <= 1) return null

	return (
		<Stack
			sx={{
				flexDirection: 'row',
				alignItems: 'center',
				flexWrap: 'wrap',
				gap: 0.75,
				mb: 1.5,
			}}
		>
			{series.map((item) => {
				const hidden = hiddenSeries.includes(item.name)

				return (
					<ButtonBase
						key={item.name}
						onClick={() => onToggle(item.name)}
						aria-pressed={!hidden}
						sx={{
							gap: 0.75,
							px: 1,
							py: 0.5,
							borderRadius: 1,
							color: hidden ? 'text.disabled' : 'text.secondary',
							fontSize: 12,
							fontWeight: 600,
							transition:
								'background-color 150ms ease, color 150ms ease',
							'&:hover': {
								bgcolor: 'grey.100',
								color: hidden
									? 'text.secondary'
									: 'text.primary',
							},
						}}
					>
						<Box
							sx={{
								width: 16,
								height: 3,
								borderRadius: 999,
								bgcolor: item.color,
								opacity: hidden ? 0.25 : 1,
							}}
						/>
						{item.name}
					</ButtonBase>
				)
			})}
		</Stack>
	)
}

export const SurveyChart = ({
	mode,
	onModeChange,
	selectedStart,
	onSelect,
	mpdData,
	ukriData,
}: SurveyChartProps) => {
	const theme = useTheme()
	const compact = useMediaQuery(theme.breakpoints.down('sm'))
	const [hiddenSeries, setHiddenSeries] = useState<string[]>([])

	const mpdDataPoints = useMemo(() => getMpdChartData(mpdData), [mpdData])
	const mpdSeries = useMemo<ChartSeries[]>(
		() => [
			{
				name: 'MPD',
				metric: 'mpd',
				color: theme.palette.primary.main,
				data: mpdDataPoints,
			},
		],
		[mpdDataPoints, theme.palette.primary.main],
	)
	const ukriSeries = useMemo(() => getUkriTrackSeries(ukriData), [ukriData])
	const combinedSeries = useMemo(
		() => getCombinedChartSeries(mpdData, ukriData),
		[mpdData, ukriData],
	)

	const allSeries =
		mode === 'combined'
			? combinedSeries
			: mode === 'ukri'
				? ukriSeries
				: mpdSeries

	const visibleSeries = allSeries.filter(
		(item) => !hiddenSeries.includes(item.name),
	)

	const options = useMemo(() => {
		if (mode === 'combined') {
			return getCombinedChartOptions({
				series: visibleSeries,
				selectedStart,
				onSelect,
				compact,
			})
		}

		if (mode === 'ukri') {
			return getUkriChartOptions({
				series: visibleSeries,
				selectedStart,
				onSelect: (start, track) => onSelect('ukri', start, track),
				compact,
			})
		}

		return getMpdChartOptions({
			data: mpdDataPoints,
			selectedStart,
			onSelect: (start) => onSelect('mpd', start),
			compact,
		})
	}, [compact, mode, mpdDataPoints, onSelect, selectedStart, visibleSeries])

	const content = {
		combined: {
			unit: 'mm | m/km',
			info: 'MPD is compared with the average UKRI value at each matching survey position. UKRI is averaged across the four supplied tracks only for this comparison.',
			description:
				'Compare both survey methods at the same positions along the route.',
		},
		mpd: {
			unit: 'mm',
			info: 'Mean Profile Depth, measured in millimetres.',
			description:
				'Mean Profile Depth measurements across the surveyed route.',
		},
		ukri: {
			unit: 'm/km',
			info: 'UK Ride Index, measured in metres per kilometre. The four supplied survey tracks are shown separately.',
			description:
				'All four UKRI tracks using the original supplied readings.',
		},
	}[mode]

	const toggleSeries = (name: string) => {
		setHiddenSeries((current) => {
			const hidden = current.includes(name)

			if (hidden) {
				return current.filter((item) => item !== name)
			}

			if (visibleSeries.length <= 1) {
				return current
			}

			return [...current, name]
		})
	}

	const changeMode = (nextMode: ChartMode) => {
		setHiddenSeries([])
		onModeChange(nextMode)
	}

	const chartSeries = visibleSeries.map(({ name, data }) => ({
		name,
		data,
	}))

	const chartKey = `${mode}-${visibleSeries
		.map((item) => item.name)
		.join('-')}`

	return (
		<Card sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 3 }}>
			<Stack
				sx={{
					flexDirection: { xs: 'column', sm: 'row' },
					justifyContent: 'space-between',
					alignItems: 'flex-start',
					gap: 2,
					mb: 2,
				}}
			>
				<Box>
					<Stack
						sx={{
							flexDirection: 'row',
							alignItems: 'center',
							gap: 0.75,
						}}
					>
						<Typography variant='h6'>
							Survey measurements
						</Typography>

						<Chip
							label={content.unit}
							size='small'
							sx={{
								height: 22,
								bgcolor: 'grey.100',
								color: 'text.secondary',
								fontSize: 11,
								fontWeight: 700,
							}}
						/>

						<Tooltip
							title={content.info}
							arrow
							enterTouchDelay={0}
							leaveTouchDelay={3500}
						>
							<IconButton
								size='small'
								aria-label={content.info}
								sx={{ color: 'text.secondary' }}
							>
								<InfoOutlinedIcon sx={{ fontSize: 18 }} />
							</IconButton>
						</Tooltip>
					</Stack>

					<Typography
						variant='body2'
						sx={{ mt: 0.5, color: 'text.secondary' }}
					>
						{content.description}
					</Typography>
				</Box>

				<MetricSwitch value={mode} onChange={changeMode} />
			</Stack>

			<ChartLegend
				series={allSeries}
				hiddenSeries={hiddenSeries}
				onToggle={toggleSeries}
			/>

			<Box
				sx={{
					height: { xs: mode === 'mpd' ? 290 : 310, sm: 380 },
					mx: { xs: -1.5, sm: 0 },
				}}
			>
				<Chart
					key={chartKey}
					options={options}
					series={chartSeries}
					type='line'
					height='100%'
				/>
			</Box>
		</Card>
	)
}
