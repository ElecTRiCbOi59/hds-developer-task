import type { SurveyMetric } from '@/types/survey'

const METRIC_STORAGE_KEY = 'hds-survey-metric'

export const getSavedMetric = (): SurveyMetric => {
	const metric = localStorage.getItem(METRIC_STORAGE_KEY)

	return metric === 'ukri' ? 'ukri' : 'mpd'
}

export const saveMetric = (metric: SurveyMetric) => {
	localStorage.setItem(METRIC_STORAGE_KEY, metric)
}
