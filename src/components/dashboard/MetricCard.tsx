import { Box, Card, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

import { colours } from '@/theme/theme'

type MetricCardProps = {
	label: string
	value: string
	description: string
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
				p: 2.5,
				borderRadius: 3,
			}}
		>
			<Stack sx={{ gap: 2 }}>
				<Stack
					sx={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: 2,
					}}
				>
					<Typography
						variant='body2'
						sx={{
							color: 'text.secondary',
							fontWeight: 600,
						}}
					>
						{label}
					</Typography>

					<Box
						sx={{
							width: 38,
							height: 38,
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

				<Box>
					<Typography variant='h5'>{value}</Typography>

					<Typography
						variant='body2'
						sx={{
							mt: 0.5,
							color: 'text.secondary',
						}}
					>
						{description}
					</Typography>
				</Box>
			</Stack>
		</Card>
	)
}
