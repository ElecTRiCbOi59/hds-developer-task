import { act } from 'react'
import { describe, expect, it, jest } from '@jest/globals'

import { SurveyChart } from '@/components/dashboard/SurveyChart'
import type { MpdMeasurement, UkriMeasurement } from '@/types/survey'
import { renderComponent } from '../helpers/renderComponent'

const coordinates = {
	latitude: 51,
	longitude: 0,
}

const mpdData: MpdMeasurement[] = [
	{
		section: 1,
		start: 0,
		end: 10,
		mpd: 1,
		coordinates,
	},
]

const ukriData: UkriMeasurement[] = [
	{
		track: 1,
		segment: 1,
		start: 0,
		end: 10,
		ukri: 2,
		coordinates,
	},
	{
		track: 2,
		segment: 1,
		start: 0,
		end: 10,
		ukri: 4,
		coordinates,
	},
]

describe('SurveyChart', () => {
	it('shows the combined comparison and lets a series be hidden', () => {
		const view = renderComponent(
			<SurveyChart
				mode='combined'
				onModeChange={() => {}}
				selectedStart={null}
				onSelect={() => {}}
				mpdData={mpdData}
				ukriData={ukriData}
			/>,
		)

		expect(view.container.textContent).toContain(
			'Compare both survey methods',
		)

		expect(
			view.container.querySelector('[data-testid="chart"]')?.textContent,
		).toBe('MPD (mm),Average UKRI (m/km)')

		const averageUkriButton = Array.from(
			view.container.querySelectorAll('button'),
		).find((button) => button.textContent === 'Average UKRI (m/km)')

		act(() => {
			averageUkriButton?.dispatchEvent(
				new MouseEvent('click', {
					bubbles: true,
				}),
			)
		})

		expect(
			view.container.querySelector('[data-testid="chart"]')?.textContent,
		).toBe('MPD (mm)')

		view.cleanup()
	})

	it('passes chart mode changes back to the dashboard', () => {
		const onModeChange = jest.fn()

		const view = renderComponent(
			<SurveyChart
				mode='combined'
				onModeChange={onModeChange}
				selectedStart={null}
				onSelect={() => {}}
				mpdData={mpdData}
				ukriData={ukriData}
			/>,
		)

		const ukriButton = Array.from(
			view.container.querySelectorAll('button'),
		).find((button) => button.textContent === 'UKRI')

		act(() => {
			ukriButton?.dispatchEvent(
				new MouseEvent('click', {
					bubbles: true,
				}),
			)
		})

		expect(onModeChange).toHaveBeenCalledWith('ukri')

		view.cleanup()
	})
})
