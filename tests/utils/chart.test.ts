import { describe, expect, it } from '@jest/globals'

import type { MpdMeasurement, UkriMeasurement } from '@/types/survey'
import {
	getMpdChartData,
	getUkriChartData,
	UKRI_BUCKET_SIZE,
} from '@/utils/chart'

describe('getMpdChartData', () => {
	it('converts MPD measurements into chart points', () => {
		const data: MpdMeasurement[] = [
			{
				section: 1,
				start: 0,
				end: 10,
				mpd: 0.8,
				coordinates: {
					latitude: 51,
					longitude: 0,
				},
			},
			{
				section: 2,
				start: 10,
				end: 20,
				mpd: 1.1,
				coordinates: {
					latitude: 51,
					longitude: 0,
				},
			},
		]

		expect(getMpdChartData(data)).toEqual([
			{
				x: 0,
				y: 0.8,
			},
			{
				x: 10,
				y: 1.1,
			},
		])
	})
})

describe('getUkriChartData', () => {
	it(`averages UKRI readings into ${UKRI_BUCKET_SIZE} metre sections`, () => {
		const data: UkriMeasurement[] = [
			{
				track: 1,
				segment: 1,
				start: 0,
				end: 5,
				ukri: 1,
				coordinates: {
					latitude: 51,
					longitude: 0,
				},
			},
			{
				track: 1,
				segment: 2,
				start: 10,
				end: 15,
				ukri: 3,
				coordinates: {
					latitude: 51,
					longitude: 0,
				},
			},
			{
				track: 1,
				segment: 3,
				start: 20,
				end: 25,
				ukri: 4,
				coordinates: {
					latitude: 51,
					longitude: 0,
				},
			},
		]

		expect(getUkriChartData(data)).toEqual([
			{
				x: 0,
				y: 2,
			},
			{
				x: 20,
				y: 4,
			},
		])
	})

	it('returns chart points ordered by distance', () => {
		const data: UkriMeasurement[] = [
			{
				track: 1,
				segment: 2,
				start: 40,
				end: 45,
				ukri: 2,
				coordinates: {
					latitude: 51,
					longitude: 0,
				},
			},
			{
				track: 1,
				segment: 1,
				start: 0,
				end: 5,
				ukri: 1,
				coordinates: {
					latitude: 51,
					longitude: 0,
				},
			},
		]

		expect(getUkriChartData(data).map((point) => point.x)).toEqual([0, 40])
	})
})
