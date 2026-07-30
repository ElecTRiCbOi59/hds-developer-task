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
					sx={{
						mt: 1,
						maxWidth: 620,
						color: 'text.secondary',
					}}
				>
					A simple overview of road surface measurements collected
					across the surveyed route.
				</Typography>
			</Box>

			<Chip
				icon={<CheckCircleRoundedIcon />}
				label='Survey complete'
				sx={{
					height: 34,
					px: 0.5,
					borderRadius: 1.5,
					bgcolor: colours.successSoft,
					color: colours.successText,
					fontWeight: 700,
					'& .MuiChip-icon': {
						color: 'success.main',
					},
				}}
			/>
		</Stack>
	)
}
