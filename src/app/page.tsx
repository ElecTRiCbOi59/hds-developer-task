'use client'

import { Box, Container, Stack } from '@mui/material'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { SurveyChart } from '@/components/dashboard/SurveyChart'
import { SurveyOverview } from '@/components/dashboard/SurveyOverview'
import type {
	MpdMeasurement,
	RawMpdRow,
	RawUkriRow,
	UkriMeasurement,
} from '@/types/survey'
import { parseCsv } from '@/utils/parseCsv'
import { normaliseMpdData, normaliseUkriData } from '@/utils/survey'

const SurveyMap = dynamic(
	() =>
		import('@/components/dashboard/SurveyMap').then(
			(module) => module.SurveyMap,
		),
	{ ssr: false },
)

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
		<Box
			component='main'
			sx={{
				minHeight: '100vh',
				py: {
					xs: 3,
					md: 5,
				},
			}}
		>
			<Container maxWidth='xl'>
				<Stack sx={{ gap: 4 }}>
					<DashboardHeader />

					<SurveyOverview mpdData={mpdData} ukriData={ukriData} />

					<SurveyChart mpdData={mpdData} ukriData={ukriData} />

					<SurveyMap mpdData={mpdData} ukriData={ukriData} />
				</Stack>
			</Container>
		</Box>
	)
}
