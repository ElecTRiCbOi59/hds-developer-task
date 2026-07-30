import { Box, ButtonBase } from '@mui/material'
import { alpha } from '@mui/material/styles'

import { shadows } from '@/theme/theme'
import type { ChartMode } from '@/types/survey'

type MetricSwitchProps = {
	value: ChartMode
	onChange: (value: ChartMode) => void
}

const modes: { label: string; value: ChartMode }[] = [
	{ label: 'Combined', value: 'combined' },
	{ label: 'MPD', value: 'mpd' },
	{ label: 'UKRI', value: 'ukri' },
]

export const MetricSwitch = ({ value, onChange }: MetricSwitchProps) => {
	return (
		<Box
			sx={{
				display: 'flex',
				alignSelf: 'flex-start',
				width: 'fit-content',
				gap: 0.5,
				p: 0.5,
				borderRadius: 1.5,
				bgcolor: 'grey.200',
			}}
		>
			{modes.map((mode) => {
				const active = value === mode.value

				return (
					<ButtonBase
						key={mode.value}
						onClick={() => onChange(mode.value)}
						aria-pressed={active}
						sx={{
							height: 30,
							minWidth: mode.value === 'combined' ? 76 : 58,
							px: 1.25,
							borderRadius: 1,
							color: active ? 'text.primary' : 'text.secondary',
							bgcolor: active
								? 'background.paper'
								: 'transparent',
							boxShadow: active ? shadows.control : 'none',
							fontSize: 12,
							fontWeight: 700,
							transition:
								'background-color 150ms ease, box-shadow 150ms ease, color 150ms ease',
							'&:hover': {
								bgcolor: active
									? 'background.paper'
									: (theme) =>
											alpha(
												theme.palette.background.paper,
												0.55,
											),
								color: 'text.primary',
							},
						}}
					>
						{mode.label}
					</ButtonBase>
				)
			})}
		</Box>
	)
}
