'use client'

import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined'
import { Box, ButtonBase, Stack } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

const sections = [
	{ label: 'Overview', id: 'overview', icon: AssessmentOutlinedIcon },
	{ label: 'Measurements', id: 'measurements', icon: InsightsOutlinedIcon },
	{ label: 'Route', id: 'route', icon: MapOutlinedIcon },
	{ label: 'Data', id: 'data', icon: TableRowsOutlinedIcon },
]

const SCROLL_OFFSET = 120

export const SectionNav = () => {
	const [activeSection, setActiveSection] = useState('overview')
	const scrollingTo = useRef<string | null>(null)
	const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(() => {
		const updateActiveSection = () => {
			if (scrollingTo.current) {
				return
			}

			if (window.scrollY < 80) {
				setActiveSection('overview')
				return
			}

			const sectionPositions = sections
				.map(({ id }) => {
					const element = document.getElementById(id)

					if (!element) {
						return null
					}

					return {
						id,
						top: element.getBoundingClientRect().top,
					}
				})
				.filter(
					(
						section,
					): section is {
						id: string
						top: number
					} => section !== null,
				)

			if (sectionPositions.length === 0) {
				return
			}

			const currentSection = sectionPositions.reduce(
				(closest, section) => {
					const closestDistance = Math.abs(
						closest.top - SCROLL_OFFSET,
					)

					const sectionDistance = Math.abs(
						section.top - SCROLL_OFFSET,
					)

					return sectionDistance < closestDistance ? section : closest
				},
			)

			setActiveSection(currentSection.id)
		}

		updateActiveSection()

		window.addEventListener('scroll', updateActiveSection, {
			passive: true,
		})

		window.addEventListener('resize', updateActiveSection)

		return () => {
			window.removeEventListener('scroll', updateActiveSection)
			window.removeEventListener('resize', updateActiveSection)
		}
	}, [])

	useEffect(() => {
		return () => {
			if (scrollTimeout.current) {
				clearTimeout(scrollTimeout.current)
			}
		}
	}, [])

	const goTo = (id: string) => {
		const element = document.getElementById(id)

		if (!element) {
			return
		}

		if (scrollTimeout.current) {
			clearTimeout(scrollTimeout.current)
		}

		scrollingTo.current = id
		setActiveSection(id)

		element.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		})

		// Keep the clicked section active while smooth scrolling passes the others.
		scrollTimeout.current = setTimeout(() => {
			scrollingTo.current = null
		}, 800)
	}

	return (
		<Box
			component='nav'
			aria-label='Dashboard sections'
			sx={{
				position: 'sticky',
				top: 12,
				zIndex: 1200,
				mx: {
					xs: -1,
					sm: 0,
				},
				p: 0.75,
				border: '1px solid',
				borderColor: 'divider',
				borderRadius: 2.5,
				bgcolor: 'rgba(255, 255, 255, 0.92)',
				boxShadow: '0 8px 24px rgba(145, 158, 171, 0.12)',
				backdropFilter: 'blur(12px)',
			}}
		>
			<Stack
				sx={{
					flexDirection: 'row',
					overflowX: 'auto',
					gap: 0.5,
					'&::-webkit-scrollbar': {
						display: 'none',
					},
				}}
			>
				{sections.map(({ label, id, icon: Icon }) => {
					const active = activeSection === id

					return (
						<ButtonBase
							key={id}
							onClick={() => goTo(id)}
							aria-current={active ? 'location' : undefined}
							sx={{
								flexShrink: 0,
								gap: 0.75,
								px: 1.5,
								py: 0.9,
								borderRadius: 1.5,
								color: active
									? 'primary.main'
									: 'text.secondary',
								bgcolor: active
									? 'rgba(24, 119, 242, 0.08)'
									: 'transparent',
								fontSize: 13,
								fontWeight: 700,
								transition:
									'background-color 150ms ease, color 150ms ease',
								'&:hover': {
									bgcolor: active
										? 'rgba(24, 119, 242, 0.1)'
										: 'grey.100',
									color: active
										? 'primary.main'
										: 'text.primary',
								},
							}}
						>
							<Icon sx={{ fontSize: 18 }} />
							{label}
						</ButtonBase>
					)
				})}
			</Stack>
		</Box>
	)
}
