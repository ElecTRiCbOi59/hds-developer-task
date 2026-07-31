import { describe, expect, it } from '@jest/globals'

import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { renderComponent } from '../helpers/renderComponent'

describe('DashboardHeader', () => {
	it('shows the HDS branding and survey title', () => {
		const view = renderComponent(<DashboardHeader />)

		expect(
			view.container.querySelector('[aria-label="Highway Data Systems"]'),
		).not.toBeNull()

		expect(view.container.textContent).toContain('A602 Road Survey')

		expect(view.container.textContent).toContain(
			'Road surface survey dashboard',
		)

		expect(view.container.textContent).not.toContain('Survey complete')

		view.cleanup()
	})
})
