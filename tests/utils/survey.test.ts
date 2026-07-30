import { describe, expect, it } from '@jest/globals'

import type { RawMpdRow, RawUkriRow } from '@/types/survey'
import {
	getAverage,
	getMaximum,
	normaliseMpdData,
	normaliseUkriData,
} from '@/utils/survey'

describe('normaliseMpdData', () => {
	it('converts a raw MPD row into a measurement', () => {
		const rows: RawMpdRow[] = [
			{
				'Section #': '1',
				'Station (m)': '0 to 10',
				'MPD (mm)': '0.82',
				Latitude: '51.940961 N',
				Longitude: '0.274424 W',
			},
		]

		expect(normaliseMpdData(rows)).toEqual([
			{
				section: 1,
				start: 0,
				end: 10,
				mpd: 0.82,
				coordinates: {
					latitude: 51.940961,
					longitude: -0.274424,
				},
			},
		])
	})
})

describe('normaliseUkriData', () => {
	it('converts a raw UKRI row into a measurement', () => {
		const rows: RawUkriRow[] = [
			{
				Track: '1',
				Segment: '2',
				'Start (m)': '10',
				'End (m)': '20',
				'UKRI (m/km)': '0.65',
				GPS: '51.940961 N 0.274424 W',
			},
		]

		expect(normaliseUkriData(rows)).toEqual([
			{
				track: 1,
				segment: 2,
				start: 10,
				end: 20,
				ukri: 0.65,
				coordinates: {
					latitude: 51.940961,
					longitude: -0.274424,
				},
			},
		])
	})
})

describe('getMaximum', () => {
	it('returns the highest value', () => {
		expect(getMaximum([0.4, 1.2, 0.9])).toBe(1.2)
	})

	it('returns zero for an empty array', () => {
		expect(getMaximum([])).toBe(0)
	})
})

describe('getAverage', () => {
	it('returns the average value', () => {
		expect(getAverage([1, 2, 3])).toBe(2)
	})

	it('returns zero for an empty array', () => {
		expect(getAverage([])).toBe(0)
	})
})
