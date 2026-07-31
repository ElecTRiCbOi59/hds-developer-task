import { jest } from '@jest/globals'
import type { ReactNode } from 'react'

type ChildrenProps = {
	children?: ReactNode
}

export const MapContainer = ({ children }: ChildrenProps) => (
	<div data-testid='map'>{children}</div>
)

export const TileLayer = () => <div data-testid='tile-layer' />

export const Polyline = () => <div data-testid='polyline' />

export const CircleMarker = ({ children }: ChildrenProps) => (
	<div data-testid='circle-marker'>{children}</div>
)

export const Tooltip = ({ children }: ChildrenProps) => <span>{children}</span>

export const useMap = () => ({
	whenReady: jest.fn(),
	getContainer: () => ({
		isConnected: true,
	}),
	invalidateSize: jest.fn(),
	fitBounds: jest.fn(),
	flyTo: jest.fn(),
	getZoom: () => 14,
})
