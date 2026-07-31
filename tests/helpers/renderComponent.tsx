import { act, type ReactElement } from 'react'
import { createRoot } from 'react-dom/client'

export const renderComponent = (element: ReactElement) => {
	const container = document.createElement('div')
	document.body.appendChild(container)
	const root = createRoot(container)

	act(() => {
		root.render(element)
	})

	return {
		container,
		rerender(nextElement: ReactElement) {
			act(() => {
				root.render(nextElement)
			})
		},
		cleanup() {
			act(() => root.unmount())
			container.remove()
		},
	}
}
