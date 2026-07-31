export const icons = {
	overview: 'solar:widget-5-line-duotone',
	measurements: 'solar:chart-2-line-duotone',
	route: 'solar:map-point-wave-line-duotone',
	data: 'solar:database-line-duotone',

	routeLength: 'solar:routing-2-line-duotone',
	ukriReadings: 'solar:chart-square-line-duotone',
	peakUkri: 'solar:graph-up-line-duotone',
	peakMpd: 'solar:layers-minimalistic-line-duotone',

	location: 'solar:map-point-outline',
	resetMap: 'solar:target-outline',
	info: 'solar:info-circle-outline',
} as const

export type IconName = keyof typeof icons
