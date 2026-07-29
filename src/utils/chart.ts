import type { MpdMeasurement, UkriMeasurement } from '@/types/survey'

export const UKRI_BUCKET_SIZE = 20

export type ChartPoint = {
	x: number
	y: number
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
