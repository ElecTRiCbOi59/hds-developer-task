import { Icon as Iconify } from '@iconify/react'

import { icons, type IconName } from './icons'

type IconProps = {
	name: IconName
	size?: number
	className?: string
}

export const Icon = ({ name, size = 20, className }: IconProps) => (
	<Iconify
		icon={icons[name]}
		width={size}
		height={size}
		className={className}
	/>
)
