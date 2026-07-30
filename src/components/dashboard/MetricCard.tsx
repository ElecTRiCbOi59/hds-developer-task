import { Box, Card, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

import { colours } from '@/theme/theme'

type MetricCardProps = {
	label: string
	value: string
	description?: string
	icon: ReactNode
}

export const MetricCard = ({
	label,
	value,
	description,
	icon,
}: MetricCardProps) => {
	return (
		<Card
			sx={{
				height: '100%',
				p: 3,
				borderRadius: 3,
			}}
		>
			<Stack
				sx={{
					flexDirection: 'row',
					alignItems: 'flex-start',
					justifyContent: 'space-between',
					gap: 2,
				}}
			>
				<Box>
					<Typography
						variant='body2'
						sx={{
							mb: 1,
							color: 'text.secondary',
							fontWeight: 600,
						}}
					>
						{label}
					</Typography>

					<Typography
						variant='h4'
						sx={{
							fontSize: {
								xs: 26,
								md: 30,
							},
							letterSpacing: '-0.03em',
						}}
					>
						{value}
					</Typography>

					{description && (
						<Typography
							variant='caption'
							sx={{
								display: 'block',
								mt: 1,
								color: 'text.secondary',
							}}
						>
							{description}
						</Typography>
					)}
				</Box>

				<Box
					sx={{
						width: 44,
						height: 44,
						flexShrink: 0,
						display: 'grid',
						placeItems: 'center',
						borderRadius: 2,
						bgcolor: colours.primarySoft,
						color: 'primary.main',
					}}
				>
					{icon}
				</Box>
			</Stack>
		</Card>
	)
}
