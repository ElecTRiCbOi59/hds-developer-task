import { describe, expect, it } from '@jest/globals'

import { SurveyMap } from '@/components/dashboard/SurveyMap'
import type { MpdMeasurement, UkriMeasurement } from '@/types/survey'
import { renderComponent } from '../helpers/renderComponent'

const coordinates = {
	latitude: 51,
	longitude: 0,
}

const mpdData: MpdMeasurement[] = Array.from({ length: 10 }, (_, index) => ({
	section: index + 1,
	start: index * 10,
	end: index * 10 + 10,
	mpd: index + 1,
	coordinates,
}))

const ukriData: UkriMeasurement[] = Array.from({ length: 10 }, (_, index) => ({
	track: 1,
	segment: index + 1,
	start: index * 10,
	end: index * 10 + 10,
	ukri: index + 1,
	coordinates,
}))

describe('SurveyMap', () => {
	it('shows both route types and all POIs in combined mode', () => {
		const view = renderComponent(
			<SurveyMap
				mode='combined'
				selected={null}
				highlighted={null}
				mpdData={mpdData}
				ukriData={ukriData}
				showPointsOfInterest
				onSelect={() => {}}
			/>,
		)

		expect(view.container.textContent).toContain(
			'MPD route and all four UKRI tracks.',
		)

		expect(
			view.container.querySelectorAll('[data-testid="polyline"]'),
		).toHaveLength(2)

		expect(
			view.container.querySelectorAll('[data-testid="circle-marker"]'),
		).toHaveLength(2)

		expect(view.container.textContent).toContain('MPD')
		expect(view.container.textContent).toContain('UKRI')

		view.cleanup()
	})
})
