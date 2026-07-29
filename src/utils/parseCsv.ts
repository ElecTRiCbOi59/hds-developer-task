import Papa from 'papaparse'

export const parseCsv = async <T>(path: string) => {
	const response = await fetch(path)

	if (!response.ok) {
		throw new Error(`Failed to load CSV: ${path}`)
	}

	const csv = await response.text()

	const result = Papa.parse<T>(csv, {
		header: true,
		skipEmptyLines: true,
		transformHeader: (header) => header.trim(),
	})

	if (result.errors.length > 0) {
		throw new Error(result.errors[0].message)
	}

	return result.data
}

export const parseCoordinate = (value: string) => {
	const trimmedValue = value.trim()
	const direction = trimmedValue.at(-1)
	const coordinate = Number.parseFloat(trimmedValue)

	if (Number.isNaN(coordinate)) {
		throw new Error(`Invalid coordinate: ${value}`)
	}

	if (direction === 'S' || direction === 'W') {
		return -coordinate
	}

	return coordinate
}

export const parseGps = (value: string) => {
	const match = value.trim().match(/^([\d.]+)\s+([NS])\s+([\d.]+)\s+([EW])$/)

	if (!match) {
		throw new Error(`Invalid GPS value: ${value}`)
	}

	const [, latitude, latitudeDirection, longitude, longitudeDirection] = match

	return {
		latitude: Number(latitude) * (latitudeDirection === 'S' ? -1 : 1),
		longitude: Number(longitude) * (longitudeDirection === 'W' ? -1 : 1),
	}
}
