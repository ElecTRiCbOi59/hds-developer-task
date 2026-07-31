import { describe, expect, it } from '@jest/globals'

import { Icon } from '@/components/icons/Icon'
import { icons } from '@/components/icons/icons'
import { renderComponent } from '../helpers/renderComponent'

describe('Icon', () => {
	it('renders only registered application icons', () => {
		const view = renderComponent(
			<Icon name='route' size={18} className='route-icon' />,
		)

		const icon = view.container.querySelector('[data-icon]')

		expect(icon?.getAttribute('data-icon')).toBe(icons.route)
		expect(icon?.getAttribute('data-width')).toBe('18')
		expect(icon?.getAttribute('data-height')).toBe('18')
		expect(icon?.className).toBe('route-icon')

		view.cleanup()
	})
})
