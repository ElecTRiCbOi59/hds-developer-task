type IconProps = {
	icon: string
	width?: number | string
	height?: number | string
	className?: string
}

export const Icon = ({ icon, width, height, className }: IconProps) => (
	<span
		data-icon={icon}
		data-width={width}
		data-height={height}
		className={className}
	/>
)
