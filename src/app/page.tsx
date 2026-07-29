import { Box, Container, Typography } from '@mui/material'

export default function Home() {
	return (
		<Box component='main' sx={{ py: 6 }}>
			<Container maxWidth='xl'>
				<Typography variant='h4'>HDS Survey Dashboard</Typography>
				<Typography
					variant='body1'
					sx={{ mt: 1, color: 'text.secondary' }}
				>
					MPD and UKRI road survey data.
				</Typography>
			</Container>
		</Box>
	)
}
