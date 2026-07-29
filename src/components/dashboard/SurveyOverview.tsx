import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined'
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined'
import TextureOutlinedIcon from '@mui/icons-material/TextureOutlined'
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined'
import { Grid } from '@mui/material'

import type { MpdMeasurement, UkriMeasurement } from '@/types/survey'
import { getAverage, getMaximum } from '@/utils/survey'

import { MetricCard } from './MetricCard'

type SurveyOverviewProps = {
	mpdData: MpdMeasurement[]
	ukriData: UkriMeasurement[]
}

export const SurveyOverview = ({ mpdData, ukriData }: SurveyOverviewProps) => {
	const routeDistance = ukriData.length
		? Math.max(...ukriData.map((item) => item.end))
		: 0

	const maxUkri = getMaximum(ukriData.map((item) => item.ukri))
	const avgUkri = getAverage(ukriData.map((item) => item.ukri))

	const maxMpd = getMaximum(mpdData.map((item) => item.mpd))
	const avgMpd = getAverage(mpdData.map((item) => item.mpd))

	return (
		<Grid container spacing={2}>
			<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
				<MetricCard
					label='Route length'
					value={`${(routeDistance / 1000).toFixed(2)} km`}
					description='Full surveyed distance'
					icon={<RouteOutlinedIcon sx={{ fontSize: 20 }} />}
				/>
			</Grid>

			<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
				<MetricCard
					label='UKRI readings'
					value={ukriData.length.toLocaleString('en-GB')}
					description='Measurements recorded'
					icon={<TimelineOutlinedIcon sx={{ fontSize: 20 }} />}
				/>
			</Grid>

			<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
				<MetricCard
					label='Peak UKRI'
					value={`${maxUkri.toFixed(2)} m/km`}
					description={`Average ${avgUkri.toFixed(2)} m/km`}
					icon={<ShowChartOutlinedIcon sx={{ fontSize: 20 }} />}
				/>
			</Grid>

			<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
				<MetricCard
					label='Peak MPD'
					value={`${maxMpd.toFixed(2)} mm`}
					description={`Average ${avgMpd.toFixed(2)} mm`}
					icon={<TextureOutlinedIcon sx={{ fontSize: 20 }} />}
				/>
			</Grid>
		</Grid>
	)
}
