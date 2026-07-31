import { describe, expect, it } from '@jest/globals'

import type { MpdMeasurement, UkriMeasurement } from '@/types/survey'
import { getChartSelection } from '@/utils/selection'

const mpdData: MpdMeasurement[] = [
	{
		section: 1,
		start: 0,
		end: 10,
		mpd: 1.2,
		coordinates: { latitude: 51, longitude: 0 },
	},
]

const ukriData: UkriMeasurement[] = [
	{
		track: 1,
		segment: 1,
		start: 0,
		end: 10,
		ukri: 2,
		coordinates: { latitude: 51, longitude: 0 },
	},
	{
		track: 2,
		segment: 1,
		start: 0,
		end: 10,
		ukri: 4,
		coordinates: { latitude: 53, longitude: 2 },
	},
]

describe('getChartSelection', () => {
	it('returns the matching MPD measurement', () => {
		expect(getChartSelection('mpd', 0, mpdData, ukriData)).toEqual({
			id: 'mpd-1',
			metric: 'mpd',
			start: 0,
			value: 1.2,
			coordinates: { latitude: 51, longitude: 0 },
		})
	})

	it('returns a specific UKRI track when requested', () => {
		expect(getChartSelection('ukri', 0, mpdData, ukriData, 2)).toEqual({
			id: 'ukri-2-1',
			metric: 'ukri',
			start: 0,
			value: 4,
			coordinates: { latitude: 53, longitude: 2 },
		})
	})

	it('averages UKRI values and coordinates for the combined chart', () => {
		expect(getChartSelection('ukri', 0, mpdData, ukriData)).toEqual({
			id: 'ukri-average-0',
			metric: 'ukri',
			start: 0,
			value: 3,
			coordinates: { latitude: 52, longitude: 1 },
		})
	})

	it('returns null when the position cannot be found', () => {
		expect(getChartSelection('mpd', 100, mpdData, ukriData)).toBeNull()
	})
})
