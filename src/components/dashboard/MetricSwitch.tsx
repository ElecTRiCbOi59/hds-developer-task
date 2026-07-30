'use client'

import { Button, Stack } from '@mui/material'
import { alpha } from '@mui/material/styles'

import { shadows } from '@/theme/theme'
import type { SurveyMetric } from '@/types/survey'

type MetricSwitchProps = {
	value: SurveyMetric
	onChange: (metric: SurveyMetric) => void
}

export const MetricSwitch = ({ value, onChange }: MetricSwitchProps) => {
	return (
		<Stack
			sx={{
				flexDirection: 'row',
				alignSelf: 'flex-start',
				gap: 0.5,
				p: 0.5,
				borderRadius: 2,
				bgcolor: 'grey.100',
			}}
		>
			{(['mpd', 'ukri'] as SurveyMetric[]).map((metric) => {
				const active = value === metric

				return (
					<Button
						key={metric}
						onClick={() => onChange(metric)}
						aria-pressed={active}
						sx={{
							minWidth: 72,
							px: 1.5,
							py: 0.75,
							borderRadius: 1.5,
							color: active ? 'text.primary' : 'text.secondary',
							bgcolor: active
								? 'background.paper'
								: 'transparent',
							fontSize: 13,
							fontWeight: 700,
							boxShadow: active ? shadows.control : 'none',
							'&:hover': {
								bgcolor: active
									? 'background.paper'
									: (theme) =>
											alpha(
												theme.palette.common.white,
												0.6,
											),
							},
						}}
					>
						{metric.toUpperCase()}
					</Button>
				)
			})}
		</Stack>
	)
}
