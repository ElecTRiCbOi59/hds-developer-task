'use client'

import { Box, Container, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import type {
	MpdMeasurement,
	RawMpdRow,
	RawUkriRow,
	UkriMeasurement,
} from '@/types/survey'
import { parseCsv } from '@/utils/parseCsv'
import { normaliseMpdData, normaliseUkriData } from '@/utils/survey'

export default function Home() {
	const [mpdData, setMpdData] = useState<MpdMeasurement[]>([])
	const [ukriData, setUkriData] = useState<UkriMeasurement[]>([])

	useEffect(() => {
		const loadData = async () => {
			const [mpdRows, ukriRows] = await Promise.all([
				parseCsv<RawMpdRow>('/data/mpd.csv'),
				parseCsv<RawUkriRow>('/data/ukri.csv'),
			])

			setMpdData(normaliseMpdData(mpdRows))
			setUkriData(normaliseUkriData(ukriRows))
		}

		loadData()
	}, [])

	return (
		<Box component='main' sx={{ py: 6 }}>
			<Container maxWidth='xl'>
				<Typography variant='h4'>HDS Survey Dashboard</Typography>

				<Typography sx={{ mt: 2 }}>
					MPD readings: {mpdData.length}
				</Typography>

				<Typography>UKRI readings: {ukriData.length}</Typography>
			</Container>
		</Box>
	)
}
