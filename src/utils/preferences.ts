import type { ChartMode } from '@/types/survey'

const CHART_MODE_STORAGE_KEY = 'hds-survey-chart-mode'
const TABLE_PAGE_SIZE_STORAGE_KEY = 'hds-survey-table-page-size'

const DEFAULT_CHART_MODE: ChartMode = 'combined'
const DEFAULT_TABLE_PAGE_SIZE = 10
const TABLE_PAGE_SIZES = [10, 25, 50]

export const getSavedChartMode = (): ChartMode => {
	if (typeof window === 'undefined') {
		return DEFAULT_CHART_MODE
	}

	const mode = localStorage.getItem(CHART_MODE_STORAGE_KEY)

	if (mode === 'mpd' || mode === 'ukri' || mode === 'combined') {
		return mode
	}

	return DEFAULT_CHART_MODE
}

export const saveChartMode = (mode: ChartMode) => {
	localStorage.setItem(CHART_MODE_STORAGE_KEY, mode)
}

export const getSavedTablePageSize = () => {
	if (typeof window === 'undefined') {
		return DEFAULT_TABLE_PAGE_SIZE
	}

	const pageSize = Number(localStorage.getItem(TABLE_PAGE_SIZE_STORAGE_KEY))

	return TABLE_PAGE_SIZES.includes(pageSize)
		? pageSize
		: DEFAULT_TABLE_PAGE_SIZE
}

export const saveTablePageSize = (pageSize: number) => {
	if (!TABLE_PAGE_SIZES.includes(pageSize)) {
		return
	}

	localStorage.setItem(TABLE_PAGE_SIZE_STORAGE_KEY, String(pageSize))
}
