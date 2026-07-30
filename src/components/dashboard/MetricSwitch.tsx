import { Box, ButtonBase } from '@mui/material'
import { alpha } from '@mui/material/styles'

import { shadows } from '@/theme/theme'

import type { SurveyMetric } from '@/types/survey'

type MetricSwitchProps = {
	value: SurveyMetric
	onChange: (value: SurveyMetric) => void
}

const metrics: { label: string; value: SurveyMetric }[] = [
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
			{metrics.map((metric) => {
				const active = value === metric.value

				return (
					<ButtonBase
						key={metric.value}
						onClick={() => onChange(metric.value)}
						aria-pressed={active}
						sx={{
							height: 30,
							minWidth: 58,
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
						{metric.label}
					</ButtonBase>
				)
			})}
		</Box>
	)
}
