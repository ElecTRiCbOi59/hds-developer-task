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
} from '@mui/material'
import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'

import { MetricSwitch } from '@/components/dashboard/MetricSwitch'
import type {
	MpdMeasurement,
	SurveyMetric,
	UkriMeasurement,
} from '@/types/survey'
import {
	getMpdChartData,
	getUkriChartData,
	UKRI_BUCKET_SIZE,
} from '@/utils/chart'

const Chart = dynamic(() => import('react-apexcharts'), {
	ssr: false,
})

type SurveyChartProps = {
	mpdData: MpdMeasurement[]
	ukriData: UkriMeasurement[]
}

export const SurveyChart = ({ mpdData, ukriData }: SurveyChartProps) => {
	const [metric, setMetric] = useState<SurveyMetric>('mpd')
	const isMpd = metric === 'mpd'

	const data = useMemo(
		() => (isMpd ? getMpdChartData(mpdData) : getUkriChartData(ukriData)),
		[isMpd, mpdData, ukriData],
	)

	const label = isMpd ? 'MPD' : 'Average UKRI'
	const unit = isMpd ? 'mm' : 'm/km'

	const options = useMemo(
		() => ({
			chart: {
				type: 'area' as const,
				toolbar: {
					show: false,
				},
				zoom: {
					enabled: false,
				},
			},
			stroke: {
				curve: 'smooth' as const,
				width: 2.25,
			},
			fill: {
				type: 'gradient',
				gradient: {
					shadeIntensity: 0,
					opacityFrom: 0.28,
					opacityTo: 0.02,
					stops: [0, 90, 100],
				},
			},
			dataLabels: {
				enabled: false,
			},
			grid: {
				borderColor: '#EEF0F3',
			},
			xaxis: {
				type: 'numeric' as const,
				labels: {
					formatter: (value: string) =>
						`${(Number(value) / 1000).toFixed(1)} km`,
					style: {
						colors: '#919EAB',
						fontSize: '12px',
					},
				},
			},
			yaxis: {
				labels: {
					formatter: (value: number) => value.toFixed(1),
					style: {
						colors: '#919EAB',
						fontSize: '12px',
					},
				},
			},
			tooltip: {
				x: {
					formatter: (value: number) =>
						`${(value / 1000).toFixed(2)} km along route`,
				},
				y: {
					formatter: (value: number) => `${value.toFixed(2)} ${unit}`,
				},
			},
			colors: ['#1877F2'],
		}),
		[unit],
	)

	const description = isMpd
		? 'Mean Profile Depth measurements across the surveyed route.'
		: `UK Ride Index averaged into ${UKRI_BUCKET_SIZE} metre sections to keep the route overview readable.`

	return (
		<Card sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 3 }}>
			<Stack
				sx={{
					flexDirection: {
						xs: 'column',
						sm: 'row',
					},
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
							title={
								isMpd
									? 'Mean Profile Depth, measured in millimetres.'
									: 'UK Ride Index, measured in metres per kilometre.'
							}
							arrow
						>
							<IconButton
								size='small'
								sx={{
									color: 'text.secondary',
								}}
							>
								<InfoOutlinedIcon
									sx={{
										fontSize: 18,
									}}
								/>
							</IconButton>
						</Tooltip>
					</Stack>

					<Typography
						variant='body2'
						sx={{
							mt: 0.5,
							color: 'text.secondary',
						}}
					>
						{description}
					</Typography>
				</Box>

				<MetricSwitch value={metric} onChange={setMetric} />
			</Stack>

			<Box
				sx={{
					height: {
						xs: 300,
						sm: 380,
					},
				}}
			>
				<Chart
					options={options}
					series={[
						{
							name: label,
							data,
						},
					]}
					type='area'
					height='100%'
				/>
			</Box>
		</Card>
	)
}
