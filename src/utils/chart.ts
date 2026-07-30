import type { ApexOptions } from 'apexcharts'

import { colours } from '@/theme/theme'
import type { MpdMeasurement, UkriMeasurement } from '@/types/survey'

export const UKRI_BUCKET_SIZE = 20

export type ChartPoint = {
	x: number
	y: number
}

export const getMpdChartData = (data: MpdMeasurement[]): ChartPoint[] =>
	data.map((item) => ({ x: item.start, y: item.mpd }))

export const getUkriChartData = (data: UkriMeasurement[]): ChartPoint[] => {
	const buckets = new Map<number, { total: number; count: number }>()

	data.forEach((item) => {
		const start =
			Math.floor(item.start / UKRI_BUCKET_SIZE) * UKRI_BUCKET_SIZE
		const bucket = buckets.get(start) ?? { total: 0, count: 0 }

		bucket.total += item.ukri
		bucket.count += 1
		buckets.set(start, bucket)
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
	compact = false,
}: {
	data: ChartPoint[]
	label: string
	unit: string
	selectedStart: number | null
	onSelect: (start: number) => void
	compact?: boolean
}): ApexOptions => ({
	chart: {
		type: 'area',
		toolbar: { show: false },
		zoom: { enabled: false },
		fontFamily: 'inherit',
		animations: { enabled: true, speed: 300 },
		events: {
			dataPointSelection: (_event, _chart, config) => {
				const point = data[config?.dataPointIndex ?? -1]
				if (point) onSelect(point.x)
			},
		},
	},
	colors: [colours.primary],
	stroke: { curve: 'smooth', width: compact ? 2 : 2.5 },
	fill: {
		type: 'gradient',
		gradient: {
			shadeIntensity: 0,
			opacityFrom: 0.24,
			opacityTo: 0.02,
			stops: [0, 90, 100],
		},
	},
	markers: { size: 0, hover: { size: compact ? 4 : 5 } },
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
			formatter: (value: string) =>
				`${(Number(value) / 1000).toFixed(1)} km`,
		},
		tooltip: { enabled: false },
	},
	yaxis: {
		min: 0,
		tickAmount: compact ? 4 : 5,
		labels: {
			offsetX: compact ? 0 : -2,
			minWidth: compact ? 28 : 0,
			maxWidth: compact ? 34 : 160,
			style: {
				colors: colours.grey[500],
				fontSize: compact ? '11px' : '12px',
			},
			formatter: (value: number) => value.toFixed(1),
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
	tooltip: {
		theme: 'light',
		x: {
			formatter: (value: number) =>
				`${(value / 1000).toFixed(2)} km along route`,
		},
		y: {
			formatter: (value: number) => `${value.toFixed(2)} ${unit}`,
			title: { formatter: () => label },
		},
	},
})
