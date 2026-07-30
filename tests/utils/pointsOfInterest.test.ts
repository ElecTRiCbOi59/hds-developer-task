import { describe, expect, it } from '@jest/globals'

import type { MpdMeasurement } from '@/types/survey'
import {
	getMpdPointsOfInterest,
	POINT_OF_INTEREST_PERCENT,
} from '@/utils/pointsOfInterest'

const coordinates = { latitude: 51, longitude: 0 }

describe('getMpdPointsOfInterest', () => {
	it('returns the highest ten percent of readings', () => {
		const data: MpdMeasurement[] = Array.from({ length: 20 }, (_, index) => ({
			section: index + 1,
			start: index * 10,
			end: index * 10 + 10,
			mpd: index + 1,
			coordinates,
		}))

		const points = getMpdPointsOfInterest(data)

		expect(POINT_OF_INTEREST_PERCENT).toBe(0.1)
		expect(points).toHaveLength(2)
		expect(points.map((point) => point.value)).toEqual([20, 19])
	})
})
