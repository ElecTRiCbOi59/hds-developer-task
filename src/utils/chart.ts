import type { ApexOptions } from 'apexcharts'

import { colours, dataColours } from '@/theme/theme'
import type {
	MpdMeasurement,
	SurveyMetric,
	UkriMeasurement,
} from '@/types/survey'

export type ChartPoint = {
	x: number
	y: number
}

export type ChartSeries = {
	name: string
	data: ChartPoint[]
	metric: SurveyMetric
	color: string
	track?: number
}

const UKRI_TRACK_COLOURS = dataColours.ukriTracks

export const getMpdChartData = (data: MpdMeasurement[]): ChartPoint[] =>
	data
		.map((item) => ({ x: item.start, y: item.mpd }))
		.sort((a, b) => a.x - b.x)

export const getUkriTrackSeries = (data: UkriMeasurement[]): ChartSeries[] => {
	const tracks = new Map<number, ChartPoint[]>()

	data.forEach((item) => {
		const points = tracks.get(item.track) ?? []
		points.push({ x: item.start, y: item.ukri })
		tracks.set(item.track, points)
	})

	return Array.from(tracks.entries())
		.sort(([trackA], [trackB]) => trackA - trackB)
		.map(([track, points], index) => ({
			name: `Track ${track}`,
			metric: 'ukri',
			track,
			color: UKRI_TRACK_COLOURS[index % UKRI_TRACK_COLOURS.length],
			data: points.sort((a, b) => a.x - b.x),
		}))
}

export const getAverageUkriChartData = (
	data: UkriMeasurement[],
): ChartPoint[] => {
	const distances = new Map<number, { total: number; count: number }>()

	data.forEach((item) => {
		const reading = distances.get(item.start) ?? { total: 0, count: 0 }
		reading.total += item.ukri
		reading.count += 1
		distances.set(item.start, reading)
	})

	return Array.from(distances.entries())
		.map(([x, reading]) => ({
			x,
			y: reading.total / reading.count,
		}))
		.sort((a, b) => a.x - b.x)
}

export const getCombinedChartSeries = (
	mpdData: MpdMeasurement[],
	ukriData: UkriMeasurement[],
): ChartSeries[] => [
	{
		name: 'MPD (mm)',
		metric: 'mpd',
		color: dataColours.mpd,
		data: getMpdChartData(mpdData),
	},
	{
		name: 'Average UKRI (m/km)',
		metric: 'ukri',
		color: dataColours.ukri,
		data: getAverageUkriChartData(ukriData),
	},
]

const formatValue = (
	value: number | null | undefined,
	decimalPlaces = 2,
	unit?: string,
) => {
	if (typeof value !== 'number' || !Number.isFinite(value)) {
		return ''
	}

	const formatted = value.toFixed(decimalPlaces)

	return unit ? `${formatted} ${unit}` : formatted
}

const formatDistance = (value: string | number | null | undefined) => {
	const distance = Number(value)

	if (!Number.isFinite(distance)) {
		return ''
	}

	return `${(distance / 1000).toFixed(2)} km along route`
}

const sharedOptions = (
	selectedStart: number | null,
	compact: boolean,
): ApexOptions => ({
	chart: {
		toolbar: { show: false },
		zoom: { enabled: false },
		fontFamily: 'inherit',
		animations: {
			enabled: true,
			speed: 300,
		},
	},
	dataLabels: { enabled: false },
	grid: {
		borderColor: colours.grid,
		strokeDashArray: 4,
		padding: compact
			? { top: 6, right: 4, bottom: 6, left: 2 }
			: { top: 8, right: 14, bottom: 14, left: 12 },
	},
	xaxis: {
		type: 'numeric',
		tickAmount: compact ? 4 : 6,
		axisBorder: { show: false },
		axisTicks: { show: false },
		labels: {
			offsetY: 2,
			rotate: 0,
			hideOverlappingLabels: true,
			style: {
				colors: colours.grey[500],
				fontSize: compact ? '11px' : '12px',
			},
			formatter: (value: string) => {
				const distance = Number(value)

				return Number.isFinite(distance)
					? `${(distance / 1000).toFixed(1)} km`
					: ''
			},
		},
		tooltip: { enabled: false },
	},
	annotations: {
		xaxis:
			selectedStart === null
				? []
				: [
						{
							x: selectedStart,
							borderColor: colours.primary,
							strokeDashArray: 4,
						},
					],
	},
	legend: {
		show: false,
	},
})

const distanceTooltip = {
	x: {
		formatter: (value: string | number) => formatDistance(value),
	},
}

export const getMpdChartOptions = ({
	data,
	selectedStart,
	onSelect,
	compact = false,
}: {
	data: ChartPoint[]
	selectedStart: number | null
	onSelect: (start: number) => void
	compact?: boolean
}): ApexOptions => ({
	...sharedOptions(selectedStart, compact),
	chart: {
		...sharedOptions(selectedStart, compact).chart,
		type: 'line',
		events: {
			dataPointSelection: (_event, _chart, config) => {
				const point = data[config?.dataPointIndex ?? -1]

				if (point) onSelect(point.x)
			},
		},
	},
	colors: [dataColours.mpd],
	stroke: {
		curve: 'smooth',
		width: compact ? 2 : 2.5,
	},
	markers: {
		size: 0,
		hover: { size: compact ? 4 : 5 },
	},
	yaxis: {
		min: 0,
		tickAmount: compact ? 4 : 5,
		labels: {
			style: {
				colors: colours.grey[500],
				fontSize: compact ? '11px' : '12px',
			},
			formatter: (value?: number) => formatValue(value, 1),
		},
	},
	tooltip: {
		...distanceTooltip,
		theme: 'light',
		y: {
			formatter: (value?: number) => formatValue(value, 2, 'mm'),
		},
	},
})

export const getUkriChartOptions = ({
	series,
	selectedStart,
	onSelect,
	compact = false,
}: {
	series: ChartSeries[]
	selectedStart: number | null
	onSelect: (start: number, track: number) => void
	compact?: boolean
}): ApexOptions => ({
	...sharedOptions(selectedStart, compact),
	chart: {
		...sharedOptions(selectedStart, compact).chart,
		type: 'line',
		events: {
			dataPointSelection: (_event, _chart, config) => {
				const activeSeries = series[config?.seriesIndex ?? -1]
				const point = activeSeries?.data[config?.dataPointIndex ?? -1]

				if (point && activeSeries.track) {
					onSelect(point.x, activeSeries.track)
				}
			},
		},
	},
	colors: series.map((item) => item.color),
	stroke: {
		curve: 'smooth',
		width: compact ? 1.75 : 2.25,
	},
	markers: {
		size: 0,
		hover: { size: compact ? 4 : 5 },
	},
	yaxis: {
		min: 0,
		tickAmount: compact ? 4 : 5,
		labels: {
			style: {
				colors: colours.grey[500],
				fontSize: compact ? '11px' : '12px',
			},
			formatter: (value?: number) => formatValue(value, 1),
		},
	},
	tooltip: {
		...distanceTooltip,
		theme: 'light',
		shared: true,
		intersect: false,
		y: {
			formatter: (value?: number) => formatValue(value, 2, 'm/km'),
		},
	},
})

export const getCombinedChartOptions = ({
	series,
	selectedStart,
	onSelect,
	compact = false,
}: {
	series: ChartSeries[]
	selectedStart: number | null
	onSelect: (metric: SurveyMetric, start: number) => void
	compact?: boolean
}): ApexOptions => {
	const showBothAxes = series.length > 1

	return {
		...sharedOptions(selectedStart, compact),
		chart: {
			...sharedOptions(selectedStart, compact).chart,
			type: 'line',
			events: {
				dataPointSelection: (_event, _chart, config) => {
					const activeSeries = series[config?.seriesIndex ?? -1]
					const point =
						activeSeries?.data[config?.dataPointIndex ?? -1]

					if (point && activeSeries) {
						onSelect(activeSeries.metric, point.x)
					}
				},
			},
		},
		colors: series.map((item) => item.color),
		stroke: {
			curve: 'smooth',
			width: compact ? 2 : 2.5,
		},
		markers: {
			size: 0,
			hover: { size: compact ? 4 : 5 },
		},
		yaxis: series.map((item) => ({
			seriesName: item.name,
			opposite: showBothAxes && item.metric === 'ukri',
			min: 0,
			tickAmount: compact ? 4 : 5,
			labels: {
				style: {
					colors: item.color,
					fontSize: compact ? '11px' : '12px',
				},
				formatter: (value?: number) => formatValue(value, 1),
			},
		})),
		tooltip: {
			...distanceTooltip,
			theme: 'light',
			shared: true,
			intersect: false,
			// The series names carry the units, so one safe formatter works
			// whether both series are visible or one has been hidden.
			y: {
				formatter: (value?: number) => formatValue(value, 2),
			},
		},
	}
}
