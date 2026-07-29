import type {
	MpdMeasurement,
	RawMpdRow,
	RawUkriRow,
	UkriMeasurement,
} from '@/types/survey'

import { parseCoordinate, parseGps } from './parseCsv'

export const normaliseUkriData = (rows: RawUkriRow[]): UkriMeasurement[] => {
	return rows.map((row) => ({
		track: Number(row.Track),
		segment: Number(row.Segment),
		start: Number(row['Start (m)']),
		end: Number(row['End (m)']),
		ukri: Number(row['UKRI (m/km)']),
		coordinates: parseGps(row.GPS),
	}))
}

export const normaliseMpdData = (rows: RawMpdRow[]): MpdMeasurement[] => {
	return rows.map((row) => {
		const [start, end] = row['Station (m)'].split(' to ').map(Number)

		return {
			section: Number(row['Section #']),
			start,
			end,
			mpd: Number(row['MPD (mm)']),
			coordinates: {
				latitude: parseCoordinate(row.Latitude),
				longitude: parseCoordinate(row.Longitude),
			},
		}
	})
}

export const getMaximum = (values: number[]) => {
	if (values.length === 0) {
		return 0
	}

	return Math.max(...values)
}

export const getAverage = (values: number[]) => {
	if (values.length === 0) {
		return 0
	}

	return values.reduce((total, value) => total + value, 0) / values.length
}
