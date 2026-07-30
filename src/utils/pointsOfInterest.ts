import type {
	ChartMode,
	MpdMeasurement,
	SurveyMetric,
	SurveySelection,
	UkriMeasurement,
} from '@/types/survey'

export const POINT_OF_INTEREST_PERCENT = 0.1

export type PointOfInterest = SurveySelection & {
	unit: string
}

export type PointOfInterestGroup = {
	metric: SurveyMetric
	label: string
	points: PointOfInterest[]
}

const topCount = (length: number) =>
	Math.max(1, Math.ceil(length * POINT_OF_INTEREST_PERCENT))

export const getMpdPointsOfInterest = (
	data: MpdMeasurement[],
): PointOfInterest[] =>
	[...data]
		.sort((a, b) => b.mpd - a.mpd)
		.slice(0, topCount(data.length))
		.map((item) => ({
			id: `mpd-${item.section}`,
			metric: 'mpd',
			start: item.start,
			value: item.mpd,
			coordinates: item.coordinates,
			unit: 'mm',
		}))

export const getUkriPointsOfInterest = (
	data: UkriMeasurement[],
): PointOfInterest[] =>
	[...data]
		.sort((a, b) => b.ukri - a.ukri)
		.slice(0, topCount(data.length))
		.map((item) => ({
			id: `ukri-${item.track}-${item.segment}`,
			metric: 'ukri',
			start: item.start,
			value: item.ukri,
			coordinates: item.coordinates,
			unit: 'm/km',
		}))

export const getPointOfInterestGroups = (
	mode: ChartMode,
	mpdData: MpdMeasurement[],
	ukriData: UkriMeasurement[],
): PointOfInterestGroup[] => {
	const mpdGroup: PointOfInterestGroup = {
		metric: 'mpd',
		label: 'MPD',
		points: getMpdPointsOfInterest(mpdData),
	}
	const ukriGroup: PointOfInterestGroup = {
		metric: 'ukri',
		label: 'UKRI',
		points: getUkriPointsOfInterest(ukriData),
	}

	if (mode === 'mpd') return [mpdGroup]
	if (mode === 'ukri') return [ukriGroup]

	return [mpdGroup, ukriGroup]
}
