'use client'

import {
	Box,
	Card,
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
import { useEffect, useMemo, useState } from 'react'

import type {
	MpdMeasurement,
	SurveyMetric,
	UkriMeasurement,
} from '@/types/survey'
import { getSavedTablePageSize, saveTablePageSize } from '@/utils/preferences'

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

export const SurveyTable = ({
	metric,
	mpdData,
	ukriData,
}: SurveyTableProps) => {
	const isMpd = metric === 'mpd'

	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(
		{
			page: 0,
			pageSize: 10,
		},
	)

	useEffect(() => {
		setPaginationModel({
			page: 0,
			pageSize: getSavedTablePageSize(),
		})
	}, [])

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

		if (isMpd) return measurementColumns

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

	const changePageSize = (pageSize: number) => {
		setPaginationModel({
			page: 0,
			pageSize,
		})

		saveTablePageSize(pageSize)
	}

	const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
		changePageSize(Number(event.target.value))
	}

	return (
		<Card
			sx={{
				p: {
					xs: 2,
					sm: 3,
				},
				borderRadius: 3,
			}}
		>
			<Stack
				sx={{
					flexDirection: {
						xs: 'column',
						sm: 'row',
					},
					alignItems: {
						xs: 'stretch',
						sm: 'flex-end',
					},
					justifyContent: 'space-between',
					gap: 2,
					mb: 2.5,
				}}
			>
				<Box>
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

				<Stack
					sx={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'flex-start',
						alignSelf: {
							xs: 'flex-start',
							sm: 'auto',
						},
						gap: 1,
					}}
				>
					<Typography
						variant='body2'
						sx={{
							color: 'text.secondary',
							whiteSpace: 'nowrap',
						}}
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
