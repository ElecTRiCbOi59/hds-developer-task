import { describe, expect, it } from '@jest/globals'

import type { MpdMeasurement, UkriMeasurement } from '@/types/survey'
import {
	getAverageUkriChartData,
	getCombinedChartSeries,
	getMpdChartData,
	getUkriTrackSeries,
} from '@/utils/chart'

const coordinates = {
	latitude: 51,
	longitude: 0,
}

describe('getMpdChartData', () => {
	it('converts MPD measurements into ordered chart points', () => {
		const data: MpdMeasurement[] = [
			{
				section: 2,
				start: 10,
				end: 20,
				mpd: 1.1,
				coordinates,
			},
			{
				section: 1,
				start: 0,
				end: 10,
				mpd: 0.8,
				coordinates,
			},
		]

		expect(getMpdChartData(data)).toEqual([
			{ x: 0, y: 0.8 },
			{ x: 10, y: 1.1 },
		])
	})
})

describe('getUkriTrackSeries', () => {
	it('keeps the supplied UKRI tracks as separate series', () => {
		const data: UkriMeasurement[] = [
			{
				track: 2,
				segment: 2,
				start: 10,
				end: 20,
				ukri: 2.4,
				coordinates,
			},
			{
				track: 1,
				segment: 1,
				start: 0,
				end: 10,
				ukri: 1.2,
				coordinates,
			},
			{
				track: 2,
				segment: 1,
				start: 0,
				end: 10,
				ukri: 2,
				coordinates,
			},
		]

		const series = getUkriTrackSeries(data)

		expect(
			series.map(({ name, metric, track, data: points }) => ({
				name,
				metric,
				track,
				data: points,
			})),
		).toEqual([
			{
				name: 'Track 1',
				metric: 'ukri',
				track: 1,
				data: [{ x: 0, y: 1.2 }],
			},
			{
				name: 'Track 2',
				metric: 'ukri',
				track: 2,
				data: [
					{ x: 0, y: 2 },
					{ x: 10, y: 2.4 },
				],
			},
		])
	})
})

describe('getAverageUkriChartData', () => {
	it('averages UKRI tracks at each original survey position', () => {
		const data: UkriMeasurement[] = [
			{
				track: 1,
				segment: 1,
				start: 0,
				end: 10,
				ukri: 1,
				coordinates,
			},
			{
				track: 2,
				segment: 1,
				start: 0,
				end: 10,
				ukri: 3,
				coordinates,
			},
			{
				track: 1,
				segment: 2,
				start: 10,
				end: 20,
				ukri: 4,
				coordinates,
			},
		]

		expect(getAverageUkriChartData(data)).toEqual([
			{ x: 0, y: 2 },
			{ x: 10, y: 4 },
		])
	})
})

describe('getCombinedChartSeries', () => {
	it('uses matching route positions for MPD and average UKRI', () => {
		const mpdData: MpdMeasurement[] = [
			{
				section: 1,
				start: 0,
				end: 10,
				mpd: 0.8,
				coordinates,
			},
			{
				section: 2,
				start: 10,
				end: 20,
				mpd: 1,
				coordinates,
			},
		]

		const ukriData: UkriMeasurement[] = [
			{
				track: 1,
				segment: 1,
				start: 0,
				end: 10,
				ukri: 1,
				coordinates,
			},
			{
				track: 2,
				segment: 1,
				start: 0,
				end: 10,
				ukri: 3,
				coordinates,
			},
			{
				track: 1,
				segment: 2,
				start: 10,
				end: 20,
				ukri: 4,
				coordinates,
			},
		]

		const series = getCombinedChartSeries(mpdData, ukriData)

		expect(
			series.map(({ name, metric, data }) => ({ name, metric, data })),
		).toEqual([
			{
				name: 'MPD (mm)',
				metric: 'mpd',
				data: [
					{ x: 0, y: 0.8 },
					{ x: 10, y: 1 },
				],
			},
			{
				name: 'Average UKRI (m/km)',
				metric: 'ukri',
				data: [
					{ x: 0, y: 2 },
					{ x: 10, y: 4 },
				],
			},
		])
	})
})
