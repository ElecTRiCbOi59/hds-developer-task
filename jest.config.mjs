import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
	dir: './',
})

const config = {
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',

		'^next/dynamic$': '<rootDir>/tests/mocks/nextDynamic.tsx',
		'^next/image$': '<rootDir>/tests/mocks/nextImage.tsx',
		'^@iconify/react$': '<rootDir>/tests/mocks/iconify.tsx',
		'^react-leaflet$': '<rootDir>/tests/mocks/reactLeaflet.tsx',
		'^@mui/x-data-grid$': '<rootDir>/tests/mocks/dataGrid.tsx',
	},
}

export default createJestConfig(config)
