import { describe, expect, it } from '@jest/globals'

import { SurveyTable } from '@/components/dashboard/SurveyTable'
import type { MpdMeasurement, UkriMeasurement } from '@/types/survey'
import { renderComponent } from '../helpers/renderComponent'

const coordinates = { latitude: 51, longitude: 0 }
const mpdData: MpdMeasurement[] = [
	{ section: 1, start: 0, end: 10, mpd: 1, coordinates },
]
const ukriData: UkriMeasurement[] = [
	{ track: 1, segment: 1, start: 0, end: 10, ukri: 2, coordinates },
]

describe('SurveyTable', () => {
	it('shows both methods and the track column in combined mode', () => {
		const view = renderComponent(
			<SurveyTable
				mode='combined'
				mpdData={mpdData}
				ukriData={ukriData}
			/>,
		)

		expect(
			view.container.querySelector('[data-testid="row-count"]')
				?.textContent,
		).toBe('2')
		expect(
			view.container.querySelector('[data-testid="columns"]')
				?.textContent,
		).toContain('Method')
		expect(
			view.container.querySelector('[data-testid="columns"]')
				?.textContent,
		).toContain('Track')
		expect(view.container.textContent).toContain(
			'Values keep their original units',
		)

		view.cleanup()
	})

	it('uses the simpler MPD column set in MPD mode', () => {
		const view = renderComponent(
			<SurveyTable mode='mpd' mpdData={mpdData} ukriData={ukriData} />,
		)

		const columns =
			view.container.querySelector('[data-testid="columns"]')
				?.textContent ?? ''
		expect(columns).toContain('Section')
		expect(columns).not.toContain('Method')
		expect(columns).not.toContain('Track')

		view.cleanup()
	})
})
