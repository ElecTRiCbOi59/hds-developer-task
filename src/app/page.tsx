'use client'

import {
	Alert,
	Box,
	CircularProgress,
	Container,
	Grid,
	Stack,
} from '@mui/material'
import dynamic from 'next/dynamic'
import { useState } from 'react'

import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { PointsOfInterest } from '@/components/dashboard/PointsOfInterest'
import { SectionNav } from '@/components/dashboard/SectionNav'
import { SurveyChart } from '@/components/dashboard/SurveyChart'
import { SurveyOverview } from '@/components/dashboard/SurveyOverview'
import { SurveyTable } from '@/components/dashboard/SurveyTable'
import { useSurveyData } from '@/hooks/useSurveyData'
import type { SurveyMetric, SurveySelection } from '@/types/survey'
import { UKRI_BUCKET_SIZE } from '@/utils/chart'

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
	const { mpdData, ukriData, loading, error } = useSurveyData()

	const [metric, setMetric] = useState<SurveyMetric>('mpd')
	const [selected, setSelected] = useState<SurveySelection | null>(null)
	const [highlighted, setHighlighted] = useState<SurveySelection | null>(null)

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
					item.start < start + UKRI_BUCKET_SIZE,
			) ??
			ukriData.find(
				(item) =>
					item.start >= start &&
					item.start < start + UKRI_BUCKET_SIZE,
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

	if (loading) {
		return (
			<Box
				sx={{
					minHeight: '100vh',
					display: 'grid',
					placeItems: 'center',
				}}
			>
				<CircularProgress />
			</Box>
		)
	}

	if (error) {
		return (
			<Container
				maxWidth='xl'
				sx={{
					py: {
						xs: 3,
						md: 5,
					},
				}}
			>
				<Alert severity='error'>{error}</Alert>
			</Container>
		)
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
					<Box
						id='overview'
						sx={{
							scrollMarginTop: 100,
						}}
					>
						<DashboardHeader />
					</Box>

					<SectionNav />

					<SurveyOverview mpdData={mpdData} ukriData={ukriData} />

					<Box
						id='measurements'
						sx={{
							scrollMarginTop: 100,
						}}
					>
						<SurveyChart
							metric={metric}
							onMetricChange={changeMetric}
							selectedStart={selected?.start ?? null}
							onSelect={selectFromChart}
							mpdData={mpdData}
							ukriData={ukriData}
						/>
					</Box>

					<Box
						id='route'
						sx={{
							scrollMarginTop: 100,
						}}
					>
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
					</Box>

					<Box
						id='data'
						sx={{
							scrollMarginTop: 100,
						}}
					>
						<SurveyTable
							metric={metric}
							mpdData={mpdData}
							ukriData={ukriData}
						/>
					</Box>
				</Stack>
			</Container>
		</Box>
	)
}
