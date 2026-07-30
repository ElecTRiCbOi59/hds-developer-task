import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined'
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined'
import TextureOutlinedIcon from '@mui/icons-material/TextureOutlined'
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined'
import { Grid } from '@mui/material'

import { MetricCard } from '@/components/dashboard/MetricCard'
import type { MpdMeasurement, UkriMeasurement } from '@/types/survey'
import { getAverage, getMaximum } from '@/utils/survey'

type SurveyOverviewProps = {
	mpdData: MpdMeasurement[]
	ukriData: UkriMeasurement[]
}

export const SurveyOverview = ({ mpdData, ukriData }: SurveyOverviewProps) => {
	const totalDistance = ukriData.length
		? Math.max(...ukriData.map((item) => item.end))
		: 0
	const peakUkri = getMaximum(ukriData.map((item) => item.ukri))
	const peakMpd = getMaximum(mpdData.map((item) => item.mpd))
	const averageUkri = getAverage(ukriData.map((item) => item.ukri))
	const averageMpd = getAverage(mpdData.map((item) => item.mpd))

	return (
		<Grid container spacing={3}>
			<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
				<MetricCard
					label='Route length'
					value={`${(totalDistance / 1000).toFixed(2)} km`}
					description='Full surveyed distance'
					icon={<RouteOutlinedIcon sx={{ fontSize: 22 }} />}
				/>
			</Grid>
			<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
				<MetricCard
					label='UKRI readings'
					value={ukriData.length.toLocaleString('en-GB')}
					description='Measurements across all tracks'
					icon={<TimelineOutlinedIcon sx={{ fontSize: 22 }} />}
				/>
			</Grid>
			<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
				<MetricCard
					label='Peak UKRI'
					value={`${peakUkri.toFixed(2)} m/km`}
					description={`Average ${averageUkri.toFixed(2)} m/km`}
					icon={<ShowChartOutlinedIcon sx={{ fontSize: 22 }} />}
				/>
			</Grid>
			<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
				<MetricCard
					label='Peak MPD'
					value={`${peakMpd.toFixed(2)} mm`}
					description={`Average ${averageMpd.toFixed(2)} mm`}
					icon={<TextureOutlinedIcon sx={{ fontSize: 22 }} />}
				/>
			</Grid>
		</Grid>
	)
}
