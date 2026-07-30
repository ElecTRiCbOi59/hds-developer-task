import type { SurveyMetric } from '@/types/survey'

const METRIC_STORAGE_KEY = 'hds-survey-metric'
const TABLE_PAGE_SIZE_STORAGE_KEY = 'hds-survey-table-page-size'

const DEFAULT_TABLE_PAGE_SIZE = 10
const TABLE_PAGE_SIZES = [10, 25, 50]

export const getSavedMetric = (): SurveyMetric => {
	const metric = localStorage.getItem(METRIC_STORAGE_KEY)

	return metric === 'ukri' ? 'ukri' : 'mpd'
}

export const saveMetric = (metric: SurveyMetric) => {
	localStorage.setItem(METRIC_STORAGE_KEY, metric)
}

export const getSavedTablePageSize = () => {
	const value = Number(localStorage.getItem(TABLE_PAGE_SIZE_STORAGE_KEY))

	return TABLE_PAGE_SIZES.includes(value) ? value : DEFAULT_TABLE_PAGE_SIZE
}

export const saveTablePageSize = (pageSize: number) => {
	if (!TABLE_PAGE_SIZES.includes(pageSize)) return

	localStorage.setItem(TABLE_PAGE_SIZE_STORAGE_KEY, String(pageSize))
}
