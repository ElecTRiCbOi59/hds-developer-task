import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'

import { PointsOfInterest } from '@/components/dashboard/PointsOfInterest'
import type { MpdMeasurement, UkriMeasurement } from '@/types/survey'

jest.mock('@/components/icons/Icon', () => ({
	Icon: () => <span data-testid='icon' />,
}))

const coordinates = { latitude: 51, longitude: 0 }

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

let container: HTMLDivElement
let root: Root

beforeEach(() => {
	container = document.createElement('div')
	document.body.appendChild(container)
	root = createRoot(container)
})

afterEach(() => {
	act(() => root.unmount())
	container.remove()
})

describe('PointsOfInterest', () => {
	it('toggles showing all points on the map', () => {
		const onShowAllOnMapChange = jest.fn()

		act(() => {
			root.render(
				<PointsOfInterest
					mode='combined'
					selected={null}
					mpdData={mpdData}
					ukriData={ukriData}
					showAllOnMap={false}
					onShowAllOnMapChange={onShowAllOnMapChange}
					onSelect={() => {}}
					onHover={() => {}}
				/>,
			)
		})

		const button = Array.from(container.querySelectorAll('button')).find(
			(item) => item.textContent?.includes('Show all on map'),
		)

		expect(container.textContent).toContain('Points of interest')
		expect(container.textContent).toContain('Highest measurements in the active view.')

		act(() => {
			button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
		})

		expect(onShowAllOnMapChange).toHaveBeenCalledWith(true)

		act(() => {
			root.render(
				<PointsOfInterest
					mode='combined'
					selected={null}
					mpdData={mpdData}
					ukriData={ukriData}
					showAllOnMap
					onShowAllOnMapChange={onShowAllOnMapChange}
					onSelect={() => {}}
					onHover={() => {}}
				/>,
			)
		})

		const hideButton = Array.from(container.querySelectorAll('button')).find(
			(item) => item.textContent?.includes('Hide from map'),
		)

		act(() => {
			hideButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
		})

		expect(onShowAllOnMapChange).toHaveBeenCalledWith(false)
	})

	it('selects an individual point of interest', () => {
		const onSelect = jest.fn()

		act(() => {
			root.render(
				<PointsOfInterest
					mode='mpd'
					selected={null}
					mpdData={mpdData}
					ukriData={ukriData}
					showAllOnMap={false}
					onShowAllOnMapChange={() => {}}
					onSelect={onSelect}
					onHover={() => {}}
				/>,
			)
		})

		const pointButton = Array.from(container.querySelectorAll('button')).find(
			(item) => item.textContent?.includes('10.00 mm'),
		)

		act(() => {
			pointButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
		})

		expect(onSelect).toHaveBeenCalledWith(
			expect.objectContaining({ metric: 'mpd', value: 10 }),
		)
	})
})
