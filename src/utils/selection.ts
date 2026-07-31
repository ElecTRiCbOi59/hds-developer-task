import type {
	Coordinates,
	MpdMeasurement,
	SurveyMetric,
	SurveySelection,
	UkriMeasurement,
} from '@/types/survey'

const averageCoordinates = (coordinates: Coordinates[]): Coordinates => ({
	latitude:
		coordinates.reduce((total, item) => total + item.latitude, 0) /
		coordinates.length,
	longitude:
		coordinates.reduce((total, item) => total + item.longitude, 0) /
		coordinates.length,
})

export const getChartSelection = (
	metric: SurveyMetric,
	start: number,
	mpdData: MpdMeasurement[],
	ukriData: UkriMeasurement[],
	track?: number,
): SurveySelection | null => {
	if (metric === 'mpd') {
		const measurement = mpdData.find((item) => item.start === start)

		return measurement
			? {
					id: `mpd-${measurement.section}`,
					metric: 'mpd',
					start: measurement.start,
					value: measurement.mpd,
					coordinates: measurement.coordinates,
				}
			: null
	}

	if (track) {
		const measurement = ukriData.find(
			(item) => item.start === start && item.track === track,
		)

		return measurement
			? {
					id: `ukri-${measurement.track}-${measurement.segment}`,
					metric: 'ukri',
					start: measurement.start,
					value: measurement.ukri,
					coordinates: measurement.coordinates,
				}
			: null
	}

	const measurements = ukriData.filter((item) => item.start === start)

	if (measurements.length === 0) {
		return null
	}

	return {
		id: `ukri-average-${start}`,
		metric: 'ukri',
		start,
		value:
			measurements.reduce((total, item) => total + item.ukri, 0) /
			measurements.length,
		coordinates: averageCoordinates(
			measurements.map((item) => item.coordinates),
		),
	}
}
