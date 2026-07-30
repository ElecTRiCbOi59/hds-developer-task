'use client'

import { Box, Card, Typography } from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useMemo } from 'react'

import type {
	MpdMeasurement,
	SurveyMetric,
	UkriMeasurement,
} from '@/types/survey'

type SurveyTableProps = {
	metric: SurveyMetric
	mpdData: MpdMeasurement[]
	ukriData: UkriMeasurement[]
}

type SurveyRow = {
	id: string
	track?: number
	section: number
	start: number
	end: number
	value: number
	latitude: number
	longitude: number
}

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

export const SurveyTable = ({
	metric,
	mpdData,
	ukriData,
}: SurveyTableProps) => {
	const isMpd = metric === 'mpd'

	const rows = useMemo<SurveyRow[]>(
		() =>
			isMpd
				? mpdData.map((item) => ({
						id: `mpd-${item.section}`,
						section: item.section,
						start: item.start,
						end: item.end,
						value: item.mpd,
						latitude: item.coordinates.latitude,
						longitude: item.coordinates.longitude,
					}))
				: ukriData.map((item) => ({
						id: `ukri-${item.track}-${item.segment}`,
						track: item.track,
						section: item.segment,
						start: item.start,
						end: item.end,
						value: item.ukri,
						latitude: item.coordinates.latitude,
						longitude: item.coordinates.longitude,
					})),
		[isMpd, mpdData, ukriData],
	)

	const columns = useMemo<GridColDef<SurveyRow>[]>(() => {
		const measurementColumns: GridColDef<SurveyRow>[] = [
			{
				field: 'section',
				headerName: isMpd ? 'Section' : 'Segment',
				flex: 0.7,
				minWidth: 95,
			},
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
				headerName: isMpd ? 'MPD' : 'UKRI',
				flex: 0.9,
				minWidth: 125,
				valueFormatter: (value) =>
					`${Number(value).toFixed(2)} ${isMpd ? 'mm' : 'm/km'}`,
			},
			coordinateColumn('latitude', 'Latitude'),
			coordinateColumn('longitude', 'Longitude'),
		]

		if (isMpd) {
			return measurementColumns
		}

		return [
			{
				field: 'track',
				headerName: 'Track',
				flex: 0.6,
				minWidth: 80,
			},
			...measurementColumns,
		]
	}, [isMpd])

	return (
		<Card sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
			<Box sx={{ mb: 2.5 }}>
				<Typography variant='h6'>Survey data</Typography>

				<Typography
					variant='body2'
					sx={{
						mt: 0.5,
						color: 'text.secondary',
					}}
				>
					View and sort the individual {metric.toUpperCase()}{' '}
					measurements collected across the route.
				</Typography>
			</Box>

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
					initialState={{
						pagination: {
							paginationModel: {
								page: 0,
								pageSize: 10,
							},
						},
					}}
					pageSizeOptions={[10, 25, 50]}
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

						'& .MuiDataGrid-columnSeparator': {
							display: 'none',
						},

						'& .MuiDataGrid-cell': {
							borderBottom: '1px solid',
							borderColor: 'divider',
							fontSize: 13,
							color: 'text.primary',
							outline: 'none',
						},

						'& .MuiDataGrid-row:hover': {
							bgcolor: 'grey.50',
						},

						'& .MuiDataGrid-footerContainer': {
							minHeight: 56,
							borderTop: '1px solid',
							borderColor: 'divider',
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
