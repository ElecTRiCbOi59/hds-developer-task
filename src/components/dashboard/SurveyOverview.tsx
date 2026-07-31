import { Grid } from '@mui/material'

import { MetricCard } from '@/components/dashboard/MetricCard'
import { Icon } from '@/components/icons/Icon'
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
					icon={<Icon name='routeLength' size={22} />}
				/>
			</Grid>

			<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
				<MetricCard
					label='UKRI readings'
					value={ukriData.length.toLocaleString('en-GB')}
					description='Measurements across all tracks'
					icon={<Icon name='ukriReadings' size={22} />}
				/>
			</Grid>

			<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
				<MetricCard
					label='Peak UKRI'
					value={`${peakUkri.toFixed(2)} m/km`}
					description={`Average ${averageUkri.toFixed(2)} m/km`}
					icon={<Icon name='peakUkri' size={22} />}
				/>
			</Grid>

			<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
				<MetricCard
					label='Peak MPD'
					value={`${peakMpd.toFixed(2)} mm`}
					description={`Average ${averageMpd.toFixed(2)} mm`}
					icon={<Icon name='peakMpd' size={22} />}
				/>
			</Grid>
		</Grid>
	)
}
