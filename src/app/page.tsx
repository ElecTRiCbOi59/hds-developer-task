'use client'

import { Box, Container, Grid, Stack } from '@mui/material'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { PointsOfInterest } from '@/components/dashboard/PointsOfInterest'
import { SurveyChart } from '@/components/dashboard/SurveyChart'
import { SurveyOverview } from '@/components/dashboard/SurveyOverview'
import { SurveyTable } from '@/components/dashboard/SurveyTable'
import type {
	MpdMeasurement,
	RawMpdRow,
	RawUkriRow,
	SurveyMetric,
	SurveySelection,
	UkriMeasurement,
} from '@/types/survey'
import { parseCsv } from '@/utils/parseCsv'
import { normaliseMpdData, normaliseUkriData } from '@/utils/survey'

const SurveyMap = dynamic(
	() =>
		import('@/components/dashboard/SurveyMap').then(
			(module) => module.SurveyMap,
		),
	{
		ssr: false,
	},
)

export default function Home() {
	const [mpdData, setMpdData] = useState<MpdMeasurement[]>([])
	const [ukriData, setUkriData] = useState<UkriMeasurement[]>([])
	const [metric, setMetric] = useState<SurveyMetric>('mpd')
	const [selected, setSelected] = useState<SurveySelection | null>(null)
	const [highlighted, setHighlighted] = useState<SurveySelection | null>(null)

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

	const changeMetric = (value: SurveyMetric) => {
		setMetric(value)
		setSelected(null)
		setHighlighted(null)
	}

	const selectFromChart = (start: number) => {
		if (metric === 'mpd') {
			const measurement = mpdData.find((item) => item.start === start)

			if (!measurement) {
				return
			}

			const selection: SurveySelection = {
				id: `mpd-${measurement.section}`,
				start: measurement.start,
				value: measurement.mpd,
				coordinates: measurement.coordinates,
			}

			setSelected(selected?.id === selection.id ? null : selection)

			return
		}

		const measurement =
			ukriData.find(
				(item) =>
					item.track === 1 &&
					item.start >= start &&
					item.start < start + 20,
			) ??
			ukriData.find(
				(item) => item.start >= start && item.start < start + 20,
			)

		if (!measurement) {
			return
		}

		const selection: SurveySelection = {
			id: `ukri-${measurement.track}-${measurement.segment}`,
			start,
			value: measurement.ukri,
			coordinates: measurement.coordinates,
		}

		setSelected(selected?.id === selection.id ? null : selection)
	}

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

					<SurveyChart
						metric={metric}
						onMetricChange={changeMetric}
						selectedStart={selected?.start ?? null}
						onSelect={selectFromChart}
						mpdData={mpdData}
						ukriData={ukriData}
					/>

					<Grid container spacing={3}>
						<Grid size={{ xs: 12, lg: 8 }}>
							<SurveyMap
								metric={metric}
								selected={selected}
								highlighted={highlighted}
								mpdData={mpdData}
								ukriData={ukriData}
								onSelect={setSelected}
							/>
						</Grid>

						<Grid size={{ xs: 12, lg: 4 }}>
							<PointsOfInterest
								metric={metric}
								mpdData={mpdData}
								ukriData={ukriData}
								selected={selected}
								onSelect={setSelected}
								onHighlight={setHighlighted}
							/>
						</Grid>
					</Grid>

					<SurveyTable
						metric={metric}
						mpdData={mpdData}
						ukriData={ukriData}
					/>
				</Stack>
			</Container>
		</Box>
	)
}
