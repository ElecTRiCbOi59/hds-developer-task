import { describe, expect, it, jest } from '@jest/globals'

import { SurveyOverview } from '@/components/dashboard/SurveyOverview'
import type { MpdMeasurement, UkriMeasurement } from '@/types/survey'
import { renderComponent } from '../helpers/renderComponent'

jest.mock('@/components/icons/Icon', () => ({
	Icon: ({ name }: { name: string }) => <span data-icon={name} />,
}))

const coordinates = { latitude: 51, longitude: 0 }

const mpdData: MpdMeasurement[] = [
	{ section: 1, start: 0, end: 10, mpd: 1, coordinates },
	{ section: 2, start: 10, end: 20, mpd: 3, coordinates },
]

const ukriData: UkriMeasurement[] = [
	{ track: 1, segment: 1, start: 0, end: 10, ukri: 2, coordinates },
	{ track: 1, segment: 2, start: 10, end: 20, ukri: 4, coordinates },
]

describe('SurveyOverview', () => {
	it('summarises the supplied survey measurements', () => {
		const view = renderComponent(
			<SurveyOverview mpdData={mpdData} ukriData={ukriData} />,
		)

		expect(view.container.textContent).toContain('0.02 km')
		expect(view.container.textContent).toContain('UKRI readings')
		expect(view.container.textContent).toContain('Peak UKRI')
		expect(view.container.textContent).toContain('4.00 m/km')
		expect(view.container.textContent).toContain('Average 3.00 m/km')
		expect(view.container.textContent).toContain('3.00 mm')
		expect(view.container.textContent).toContain('Average 2.00 mm')

		view.cleanup()
	})
})
