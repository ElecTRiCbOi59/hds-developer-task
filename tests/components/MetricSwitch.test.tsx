import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'

import { MetricSwitch } from '@/components/dashboard/MetricSwitch'

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

describe('MetricSwitch', () => {
	it('shows all modes and marks the current one as selected', () => {
		act(() => {
			root.render(<MetricSwitch value='combined' onChange={() => {}} />)
		})

		const buttons = Array.from(container.querySelectorAll('button'))

		expect(buttons.map((button) => button.textContent)).toEqual([
			'Combined',
			'MPD',
			'UKRI',
		])
		expect(buttons[0].getAttribute('aria-pressed')).toBe('true')
	})

	it('calls onChange with the selected mode', () => {
		const onChange = jest.fn()

		act(() => {
			root.render(<MetricSwitch value='combined' onChange={onChange} />)
		})

		const ukriButton = Array.from(container.querySelectorAll('button')).find(
			(button) => button.textContent === 'UKRI',
		)

		act(() => {
			ukriButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
		})

		expect(onChange).toHaveBeenCalledWith('ukri')
	})
})
