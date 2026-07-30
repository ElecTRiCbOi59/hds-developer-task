import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { Box, Chip, Stack, Typography } from '@mui/material'

import { colours } from '@/theme/theme'

export const DashboardHeader = () => {
	return (
		<Stack
			sx={{
				flexDirection: {
					xs: 'column',
					md: 'row',
				},
				justifyContent: 'space-between',
				alignItems: {
					xs: 'flex-start',
					md: 'center',
				},
				gap: 2,
			}}
		>
			<Box>
				<Typography variant='h3'>A602 Road Survey</Typography>

				<Typography
					variant='body1'
					sx={{
						mt: 0.75,
						color: 'text.secondary',
					}}
				>
					Explore road surface measurements across the surveyed route.
				</Typography>
			</Box>

			<Chip
				icon={<CheckCircleRoundedIcon />}
				label='Survey complete'
				size='small'
				sx={{
					bgcolor: colours.successSoft,
					color: colours.successText,
					fontWeight: 700,
					'& .MuiChip-icon': {
						color: colours.success,
					},
				}}
			/>
		</Stack>
	)
}
