'use client'

import { useEffect, useState } from 'react'

import type {
	MpdMeasurement,
	RawMpdRow,
	RawUkriRow,
	UkriMeasurement,
} from '@/types/survey'
import { parseCsv } from '@/utils/parseCsv'
import { normaliseMpdData, normaliseUkriData } from '@/utils/survey'

export const useSurveyData = () => {
	const [mpdData, setMpdData] = useState<MpdMeasurement[]>([])
	const [ukriData, setUkriData] = useState<UkriMeasurement[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const loadData = async () => {
			try {
				const [mpdRows, ukriRows] = await Promise.all([
					parseCsv<RawMpdRow>('/data/mpd.csv'),
					parseCsv<RawUkriRow>('/data/ukri.csv'),
				])

				setMpdData(normaliseMpdData(mpdRows))
				setUkriData(normaliseUkriData(ukriRows))
			} catch (error) {
				setError(
					error instanceof Error
						? error.message
						: 'Unable to load survey data.',
				)
			} finally {
				setLoading(false)
			}
		}

		loadData()
	}, [])

	return {
		mpdData,
		ukriData,
		loading,
		error,
	}
}
