'use client'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {
	Box,
	Card,
	Chip,
	IconButton,
	Stack,
	Tooltip,
	Typography,
	useMediaQuery,
} from '@mui/material'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { useTheme } from '@mui/material/styles'

import { MetricSwitch } from '@/components/dashboard/MetricSwitch'
import type {
	MpdMeasurement,
	SurveyMetric,
	UkriMeasurement,
} from '@/types/survey'
import {
	getChartOptions,
	getMpdChartData,
	getUkriChartData,
	UKRI_BUCKET_SIZE,
} from '@/utils/chart'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

type SurveyChartProps = {
	metric: SurveyMetric
	onMetricChange: (metric: SurveyMetric) => void
	selectedStart: number | null
	onSelect: (start: number) => void
	mpdData: MpdMeasurement[]
	ukriData: UkriMeasurement[]
}

export const SurveyChart = ({
	metric,
	onMetricChange,
	selectedStart,
	onSelect,
	mpdData,
	ukriData,
}: SurveyChartProps) => {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const isMpd = metric === 'mpd'
	const label = isMpd ? 'MPD' : 'Average UKRI'
	const unit = isMpd ? 'mm' : 'm/km'
	const info = isMpd
		? 'Mean Profile Depth, measured in millimetres.'
		: 'UK Ride Index, measured in metres per kilometre.'
	const data = useMemo(
		() => (isMpd ? getMpdChartData(mpdData) : getUkriChartData(ukriData)),
		[isMpd, mpdData, ukriData],
	)
	const series = useMemo(() => [{ name: label, data }], [label, data])
	const options = useMemo(
		() =>
			getChartOptions({
				data,
				label,
				unit,
				selectedStart,
				onSelect,
				compact: isMobile,
			}),
		[data, label, unit, selectedStart, onSelect, isMobile],
	)

	const description = isMpd
		? 'Mean Profile Depth measurements across the surveyed route.'
		: `UK Ride Index averaged into ${UKRI_BUCKET_SIZE} metre sections to keep the route overview readable.`

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
							label={unit}
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
							title={info}
							arrow
							enterTouchDelay={0}
							leaveTouchDelay={3500}
						>
							<IconButton
								size='small'
								aria-label={info}
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
						{description}
					</Typography>
				</Box>

				<MetricSwitch value={metric} onChange={onMetricChange} />
			</Stack>

			<Box
				sx={{
					height: { xs: 290, sm: 380 },
					mx: { xs: -1.5, sm: 0 },
				}}
			>
				<Chart
					options={options}
					series={series}
					type='area'
					height='100%'
				/>
			</Box>
		</Card>
	)
}
