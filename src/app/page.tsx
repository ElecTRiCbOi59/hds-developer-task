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
import type { ChartMode, SurveyMetric, SurveySelection } from '@/types/survey'
import { getSavedChartMode, saveChartMode } from '@/utils/preferences'
import { getChartSelection } from '@/utils/selection'

const SurveyMap = dynamic(
	() =>
		import('@/components/dashboard/SurveyMap').then(
			(module) => module.SurveyMap,
		),
	{ ssr: false },
)

export default function Home() {
	const { mpdData, ukriData, loading, error } = useSurveyData()
	const [mode, setMode] = useState<ChartMode>(() => getSavedChartMode())
	const [selected, setSelected] = useState<SurveySelection | null>(null)
	const [highlighted, setHighlighted] = useState<SurveySelection | null>(null)
	const [showPointsOfInterest, setShowPointsOfInterest] = useState(false)

	const changeMode = (nextMode: ChartMode) => {
		setMode(nextMode)
		setSelected(null)
		setHighlighted(null)
		setShowPointsOfInterest(false)
		saveChartMode(nextMode)
	}

	const selectChartPoint = (
		metric: SurveyMetric,
		start: number,
		track?: number,
	) => {
		const selection = getChartSelection(
			metric,
			start,
			mpdData,
			ukriData,
			track,
		)

		if (!selection) return

		setSelected((current) =>
			current?.id === selection.id ? null : selection,
		)
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
				<CircularProgress size={32} />
			</Box>
		)
	}

	if (error) {
		return (
			<Container maxWidth='xl' sx={{ py: { xs: 3, md: 5 } }}>
				<Alert severity='error'>{error}</Alert>
			</Container>
		)
	}

	return (
		<Box
			component='main'
			sx={{
				minHeight: '100vh',
				py: { xs: 3, md: 5 },
			}}
		>
			<Container maxWidth='xl'>
				<Stack sx={{ gap: { xs: 3, md: 4 } }}>
					<DashboardHeader />
					<SectionNav />

					<Box id='overview' sx={{ scrollMarginTop: 92 }}>
						<SurveyOverview mpdData={mpdData} ukriData={ukriData} />
					</Box>

					<Box id='measurements' sx={{ scrollMarginTop: 92 }}>
						<SurveyChart
							mode={mode}
							onModeChange={changeMode}
							selectedStart={selected?.start ?? null}
							onSelect={selectChartPoint}
							mpdData={mpdData}
							ukriData={ukriData}
						/>
					</Box>

					<Box id='route' sx={{ scrollMarginTop: 92 }}>
						<Grid container spacing={3}>
							<Grid size={{ xs: 12, lg: 8 }}>
								<SurveyMap
									mode={mode}
									selected={selected}
									highlighted={highlighted}
									mpdData={mpdData}
									ukriData={ukriData}
									showPointsOfInterest={showPointsOfInterest}
									onSelect={setSelected}
								/>
							</Grid>

							<Grid size={{ xs: 12, lg: 4 }}>
								<PointsOfInterest
									mode={mode}
									selected={selected}
									mpdData={mpdData}
									ukriData={ukriData}
									showAllOnMap={showPointsOfInterest}
									onShowAllOnMapChange={
										setShowPointsOfInterest
									}
									onSelect={setSelected}
									onHover={setHighlighted}
								/>
							</Grid>
						</Grid>
					</Box>

					<Box id='data' sx={{ scrollMarginTop: 92 }}>
						<SurveyTable
							key={mode}
							mode={mode}
							mpdData={mpdData}
							ukriData={ukriData}
						/>
					</Box>
				</Stack>
			</Container>
		</Box>
	)
}
