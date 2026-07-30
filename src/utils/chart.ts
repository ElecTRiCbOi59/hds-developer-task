import type { ApexOptions } from 'apexcharts'

import { colours } from '@/theme/theme'
import type { MpdMeasurement, UkriMeasurement } from '@/types/survey'

export const UKRI_BUCKET_SIZE = 20

export type ChartPoint = {
	x: number
	y: number
}

type ChartOptions = {
	data: ChartPoint[]
	label: string
	unit: string
	selectedStart: number | null
	onSelect: (start: number) => void
	isMobile: boolean
}

export const getMpdChartData = (data: MpdMeasurement[]): ChartPoint[] => {
	return data.map((item) => ({
		x: item.start,
		y: item.mpd,
	}))
}

export const getUkriChartData = (data: UkriMeasurement[]): ChartPoint[] => {
	const buckets = new Map<
		number,
		{
			total: number
			count: number
		}
	>()

	data.forEach((item) => {
		const start =
			Math.floor(item.start / UKRI_BUCKET_SIZE) * UKRI_BUCKET_SIZE

		const bucket = buckets.get(start)

		if (bucket) {
			bucket.total += item.ukri
			bucket.count += 1
			return
		}

		buckets.set(start, {
			total: item.ukri,
			count: 1,
		})
	})

	return Array.from(buckets.entries())
		.map(([x, bucket]) => ({
			x,
			y: bucket.total / bucket.count,
		}))
		.sort((a, b) => a.x - b.x)
}

export const getChartOptions = ({
	data,
	label,
	unit,
	selectedStart,
	onSelect,
	isMobile,
}: ChartOptions): ApexOptions => ({
	chart: {
		type: 'area',
		toolbar: {
			show: false,
		},
		zoom: {
			enabled: false,
		},
		events: {
			dataPointSelection: (_event, _chart, options) => {
				const index = options?.dataPointIndex

				if (index === undefined || index < 0) {
					return
				}

				const point = data[index]

				if (!point) {
					return
				}

				onSelect(point.x)
			},
		},
	},
	stroke: {
		curve: 'smooth',
		width: isMobile ? 1.75 : 2.25,
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
	markers: {
		size: 0,
		hover: {
			size: isMobile ? 4 : 5,
		},
	},
	dataLabels: {
		enabled: false,
	},
	grid: {
		borderColor: colours.grid,
		padding: {
			left: isMobile ? 4 : 8,
			right: isMobile ? 4 : 8,
		},
	},
	xaxis: {
		type: 'numeric',
		tickAmount: isMobile ? 3 : 6,
		labels: {
			formatter: (value) => `${(Number(value) / 1000).toFixed(1)} km`,
			style: {
				colors: colours.axis,
				fontSize: isMobile ? '10px' : '12px',
			},
		},
	},
	yaxis: {
		tickAmount: isMobile ? 3 : 5,
		labels: {
			formatter: (value) => value.toFixed(1),
			style: {
				colors: colours.axis,
				fontSize: isMobile ? '10px' : '12px',
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
	colors: [colours.primary],
})
