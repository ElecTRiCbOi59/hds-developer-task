import { act } from 'react'
import { describe, expect, it, jest } from '@jest/globals'

import { SectionNav } from '@/components/dashboard/SectionNav'
import { renderComponent } from '../helpers/renderComponent'

jest.mock('@/components/icons/Icon', () => ({
	Icon: ({ name }: { name: string }) => <span data-icon={name} />,
}))

describe('SectionNav', () => {
	it('shows each dashboard section and navigates to a selected section', () => {
		const scrollIntoView = jest.fn()

		for (const id of ['overview', 'measurements', 'route', 'data']) {
			const section = document.createElement('div')
			section.id = id
			section.scrollIntoView = scrollIntoView
			document.body.appendChild(section)
		}

		const view = renderComponent(<SectionNav />)
		const buttons = Array.from(view.container.querySelectorAll('button'))

		expect(buttons.map((button) => button.textContent)).toEqual([
			'Overview',
			'Measurements',
			'Route',
			'Data',
		])
		expect(buttons[0].getAttribute('aria-current')).toBe('location')

		act(() => {
			buttons[2].dispatchEvent(new MouseEvent('click', { bubbles: true }))
		})

		expect(scrollIntoView).toHaveBeenCalledWith({
			behavior: 'smooth',
			block: 'start',
		})
		expect(buttons[2].getAttribute('aria-current')).toBe('location')

		view.cleanup()
		for (const id of ['overview', 'measurements', 'route', 'data']) {
			document.getElementById(id)?.remove()
		}
	})
})
