import { describe, expect, it } from '@jest/globals'

import { parseCoordinate, parseGps } from '@/utils/parseCsv'

describe('parseCoordinate', () => {
	it('parses north and east coordinates as positive values', () => {
		expect(parseCoordinate('51.123 N')).toBe(51.123)
		expect(parseCoordinate('0.456 E')).toBe(0.456)
	})

	it('parses south and west coordinates as negative values', () => {
		expect(parseCoordinate('51.123 S')).toBe(-51.123)
		expect(parseCoordinate('0.456 W')).toBe(-0.456)
	})

	it('throws for invalid coordinate values', () => {
		expect(() => parseCoordinate('not a coordinate')).toThrow(
			'Invalid coordinate',
		)
	})
})

describe('parseGps', () => {
	it('parses latitude and longitude from a GPS string', () => {
		expect(parseGps('51.9409615218182 N 0.274424911616162 W')).toEqual({
			latitude: 51.9409615218182,
			longitude: -0.274424911616162,
		})
	})

	it('throws for invalid GPS values', () => {
		expect(() => parseGps('invalid')).toThrow('Invalid GPS value')
	})
})
