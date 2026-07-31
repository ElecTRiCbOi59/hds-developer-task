import { describe, expect, it } from '@jest/globals'

import { MetricCard } from '@/components/dashboard/MetricCard'
import { renderComponent } from '../helpers/renderComponent'

describe('MetricCard', () => {
	it('renders its metric content and icon', () => {
		const view = renderComponent(
			<MetricCard
				label='Route length'
				value='4.12 km'
				description='Full surveyed distance'
				icon={<span data-testid='metric-icon'>icon</span>}
			/>,
		)

		expect(view.container.textContent).toContain('Route length')
		expect(view.container.textContent).toContain('4.12 km')
		expect(view.container.textContent).toContain('Full surveyed distance')
		expect(
			view.container.querySelector('[data-testid="metric-icon"]'),
		).not.toBeNull()

		view.cleanup()
	})
})
