import { Box, Divider, Stack, Typography } from '@mui/material'
import Image from 'next/image'

export const DashboardHeader = () => {
	return (
		<Stack
			sx={{
				flexDirection: { xs: 'column', md: 'row' },
				alignItems: { xs: 'flex-start', md: 'center' },
				gap: { xs: 2, md: 3 },
				py: { xs: 0.5, md: 1 },
			}}
		>
			<Box
				sx={{
					width: { xs: 158, sm: 185 },
					height: { xs: 62, sm: 72 },
					position: 'relative',
					flexShrink: 0,
				}}
			>
				<Image
					src='/hds-logo.png'
					alt='Highway Data Systems'
					fill
					priority
					sizes='185px'
					style={{
						objectFit: 'contain',
						objectPosition: 'left center',
					}}
				/>
			</Box>

			<Divider
				orientation='vertical'
				flexItem
				sx={{ display: { xs: 'none', md: 'block' } }}
			/>

			<Box>
				<Typography
					variant='overline'
					sx={{
						display: 'block',
						mb: 0.25,
						color: 'primary.dark',
						fontSize: 11,
						fontWeight: 800,
						letterSpacing: '0.12em',
						lineHeight: 1.4,
					}}
				>
					Road surface survey dashboard
				</Typography>

				<Typography variant='h3'>A602 Road Survey</Typography>

				<Typography
					sx={{
						mt: 0.75,
						maxWidth: 680,
						color: 'text.secondary',
					}}
				>
					Explore MPD and UKRI measurements collected across the
					surveyed route.
				</Typography>
			</Box>
		</Stack>
	)
}
