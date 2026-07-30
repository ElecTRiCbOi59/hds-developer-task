export type RawUkriRow = {
	Track: string
	Segment: string
	'Start (m)': string
	'End (m)': string
	'UKRI (m/km)': string
	GPS: string
}

export type RawMpdRow = {
	'Section #': string
	'Station (m)': string
	'MPD (mm)': string
	Latitude: string
	Longitude: string
}

export type Coordinates = {
	latitude: number
	longitude: number
}

export type UkriMeasurement = {
	track: number
	segment: number
	start: number
	end: number
	ukri: number
	coordinates: Coordinates
}

export type MpdMeasurement = {
	section: number
	start: number
	end: number
	mpd: number
	coordinates: Coordinates
}

export type SurveyMetric = 'mpd' | 'ukri'

export type SurveySelection = {
	id: string
	start: number
	value: number
	coordinates?: Coordinates
}
