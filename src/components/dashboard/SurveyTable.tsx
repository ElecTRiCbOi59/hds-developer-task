'use client'

import {
	Box,
	Card,
	Chip,
	FormControl,
	MenuItem,
	Select,
	Stack,
	Typography,
	type SelectChangeEvent,
} from '@mui/material'
import {
	DataGrid,
	type GridColDef,
	type GridPaginationModel,
} from '@mui/x-data-grid'
import { useMemo, useState } from 'react'

import type {
	ChartMode,
	MpdMeasurement,
	SurveyMetric,
	UkriMeasurement,
} from '@/types/survey'
import { getSavedTablePageSize, saveTablePageSize } from '@/utils/preferences'

type SurveyTableProps = {
	mode: ChartMode
	mpdData: MpdMeasurement[]
	ukriData: UkriMeasurement[]
}

type SurveyRow = {
	id: string
	metric: SurveyMetric
	reference: number
	track?: number
	start: number
	end: number
	value: number
	latitude: number
	longitude: number
}

const PAGE_SIZES = [10, 25, 50]

const coordinateColumn = (
	field: 'latitude' | 'longitude',
	label: string,
): GridColDef<SurveyRow> => ({
	field,
	headerName: label,
	flex: 1,
	minWidth: 130,
	valueFormatter: (value) => Number(value).toFixed(6),
})

const getRows = (
	mode: ChartMode,
	mpdData: MpdMeasurement[],
	ukriData: UkriMeasurement[],
): SurveyRow[] => {
	const mpdRows = mpdData.map((item) => ({
		id: `mpd-${item.section}`,
		metric: 'mpd' as const,
		reference: item.section,
		start: item.start,
		end: item.end,
		value: item.mpd,
		latitude: item.coordinates.latitude,
		longitude: item.coordinates.longitude,
	}))

	const ukriRows = ukriData.map((item) => ({
		id: `ukri-${item.track}-${item.segment}`,
		metric: 'ukri' as const,
		reference: item.segment,
		track: item.track,
		start: item.start,
		end: item.end,
		value: item.ukri,
		latitude: item.coordinates.latitude,
		longitude: item.coordinates.longitude,
	}))

	if (mode === 'mpd') return mpdRows
	if (mode === 'ukri') return ukriRows

	return [...mpdRows, ...ukriRows].sort((a, b) => {
		if (a.start !== b.start) return a.start - b.start
		return a.metric.localeCompare(b.metric)
	})
}

export const SurveyTable = ({ mode, mpdData, ukriData }: SurveyTableProps) => {
	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(
		() => ({
			page: 0,
			pageSize: getSavedTablePageSize(),
		}),
	)

	const rows = useMemo(
		() => getRows(mode, mpdData, ukriData),
		[mode, mpdData, ukriData],
	)

	const columns = useMemo<GridColDef<SurveyRow>[]>(() => {
		const referenceColumn: GridColDef<SurveyRow> = {
			field: 'reference',
			headerName:
				mode === 'ukri'
					? 'Segment'
					: mode === 'mpd'
						? 'Section'
						: 'Ref',
			flex: 0.7,
			minWidth: 90,
		}

		const commonColumns: GridColDef<SurveyRow>[] = [
			referenceColumn,
			{
				field: 'start',
				headerName: 'Start',
				flex: 0.8,
				minWidth: 105,
				valueFormatter: (value) => `${Number(value).toFixed(1)} m`,
			},
			{
				field: 'end',
				headerName: 'End',
				flex: 0.8,
				minWidth: 105,
				valueFormatter: (value) => `${Number(value).toFixed(1)} m`,
			},
			{
				field: 'value',
				headerName: 'Value',
				flex: 0.9,
				minWidth: 125,
				sortable: mode !== 'combined',
				renderCell: (params) =>
					`${Number(params.value).toFixed(2)} ${params.row.metric === 'mpd' ? 'mm' : 'm/km'}`,
			},
			coordinateColumn('latitude', 'Latitude'),
			coordinateColumn('longitude', 'Longitude'),
		]

		if (mode === 'mpd') return commonColumns

		const trackColumn: GridColDef<SurveyRow> = {
			field: 'track',
			headerName: 'Track',
			flex: 0.55,
			minWidth: 78,
			valueFormatter: (value) => value ?? '—',
		}

		if (mode === 'ukri') {
			return [trackColumn, ...commonColumns]
		}

		const methodColumn: GridColDef<SurveyRow> = {
			field: 'metric',
			headerName: 'Method',
			flex: 0.7,
			minWidth: 100,
			renderCell: (params) => (
				<Chip
					label={params.row.metric.toUpperCase()}
					size='small'
					color={params.row.metric === 'ukri' ? 'success' : 'primary'}
					variant='outlined'
					sx={{ height: 22, fontSize: 10, fontWeight: 800 }}
				/>
			),
		}

		return [methodColumn, trackColumn, ...commonColumns]
	}, [mode])

	const changePageSize = (pageSize: number) => {
		setPaginationModel({ page: 0, pageSize })
		saveTablePageSize(pageSize)
	}

	const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
		changePageSize(Number(event.target.value))
	}

	const description =
		mode === 'combined'
			? 'View MPD and UKRI readings together. Values keep their original units.'
			: `View and sort the individual ${mode.toUpperCase()} measurements collected across the route.`

	return (
		<Card sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
			<Stack
				sx={{
					flexDirection: { xs: 'column', sm: 'row' },
					alignItems: { xs: 'stretch', sm: 'flex-end' },
					justifyContent: 'space-between',
					gap: 2,
					mb: 2.5,
				}}
			>
				<Box>
					<Typography variant='h6'>Survey data</Typography>
					<Typography
						variant='body2'
						sx={{ mt: 0.5, color: 'text.secondary' }}
					>
						{description}
					</Typography>
				</Box>

				<Stack
					sx={{
						flexDirection: 'row',
						alignItems: 'center',
						alignSelf: { xs: 'flex-start', sm: 'auto' },
						gap: 1,
					}}
				>
					<Typography
						variant='body2'
						sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}
					>
						Rows per page
					</Typography>

					<FormControl size='small'>
						<Select
							value={paginationModel.pageSize}
							onChange={handlePageSizeChange}
							aria-label='Rows per page'
							sx={{
								minWidth: 72,
								fontSize: 13,
								bgcolor: 'background.paper',
							}}
						>
							{PAGE_SIZES.map((size) => (
								<MenuItem key={size} value={size}>
									{size}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Stack>
			</Stack>

			<Box
				sx={{
					height: 520,
					overflow: 'hidden',
					border: '1px solid',
					borderColor: 'divider',
					borderRadius: 2.5,
				}}
			>
				<DataGrid
					rows={rows}
					columns={columns}
					paginationModel={paginationModel}
					onPaginationModelChange={setPaginationModel}
					pageSizeOptions={PAGE_SIZES}
					disableRowSelectionOnClick
					disableColumnMenu
					sx={{
						border: 0,
						bgcolor: 'background.paper',
						'& .MuiDataGrid-columnHeaders': {
							bgcolor: 'grey.50',
							borderBottom: '1px solid',
							borderColor: 'divider',
						},
						'& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {
							px: 2,
						},
						'& .MuiDataGrid-columnHeaderTitle': {
							fontSize: 13,
							fontWeight: 700,
							color: 'text.secondary',
						},
						'& .MuiDataGrid-columnSeparator': { display: 'none' },
						'& .MuiDataGrid-cell': {
							borderBottom: '1px solid',
							borderColor: 'divider',
							fontSize: 13,
							color: 'text.primary',
							outline: 'none',
						},
						'& .MuiDataGrid-row:hover': { bgcolor: 'grey.50' },
						'& .MuiDataGrid-footerContainer': {
							minHeight: 56,
							borderTop: '1px solid',
							borderColor: 'divider',
						},
						'& .MuiTablePagination-selectLabel, & .MuiTablePagination-select':
							{
								display: 'none',
							},
						'& .MuiTablePagination-root': {
							color: 'text.secondary',
						},
					}}
				/>
			</Box>
		</Card>
	)
}
