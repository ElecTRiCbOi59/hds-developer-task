# HDS Developer Task

A responsive dashboard for exploring MPD and UKRI road survey data collected along the A602.

The dashboard focuses on making the supplied survey data easy to compare and explore through summary cards, interactive charts, a route map, points of interest and a detailed data table.

## Tech stack

- Next.js
- React
- TypeScript
- Material UI
- MUI Data Grid
- ApexCharts
- React Leaflet
- Papa Parse
- Iconify
- Jest

## Getting started

### Requirements

- Node.js
- Yarn

### Install dependencies

```bash
yarn
```

### Run locally

```bash
yarn dev
```

Open the local URL shown in the terminal.

### Production build

```bash
yarn build
yarn start
```

## Testing and code quality

Run the Jest test suite:

```bash
yarn test
```

Run tests in watch mode:

```bash
yarn test:watch
```

Run ESLint:

```bash
yarn lint
```

Run the TypeScript checks:

```bash
yarn typecheck
```

The test suite covers the data parsing and transformation utilities as well as every application component. Third party rendering libraries such as ApexCharts, Leaflet and MUI Data Grid are mocked in component tests so the tests stay focused on application behaviour.

## Features

### Survey overview

The dashboard summarises the surveyed route, UKRI reading count, peak measurements and averages.

### Survey measurements

The chart has three views:

- **Combined** compares MPD with the average UKRI value at each matching survey position.
- **MPD** shows Mean Profile Depth measurements along the route.
- **UKRI** shows the four UKRI survey tracks separately.

Chart series can be shown or hidden to make comparisons easier. The selected view is saved locally and restored when the user returns.

### Survey route

GPS data is displayed on an interactive map.

The map responds to the selected survey view and can show MPD and UKRI routes together or separately. Selecting a chart value or point of interest highlights its location, and the map can be reset to the full surveyed route.

### Points of interest

The highest 10% of readings are highlighted as points of interest.

Individual readings can be hovered to preview their position, selected to keep them highlighted, or shown together on the map.

### Survey data

The underlying MPD and UKRI readings can be viewed and sorted in the data table.

Combined mode shows both methods together while retaining their original units. UKRI mode also includes the survey track number. The selected rows per page setting is stored locally.

### Responsive UI

The layout, navigation, chart controls, map and table controls adapt for smaller screens. The visual design also uses Highway Data Systems branding while keeping the survey methods and tracks easy to distinguish.

## Data handling

The two CSV files are loaded in the browser, parsed with Papa Parse and normalised into typed MPD and UKRI data structures.

MPD and UKRI are sampled differently. For the Combined chart, UKRI values from the four tracks are averaged at each matching survey position so that the two methods can be compared at the same distance along the route. The individual UKRI view keeps each track separate.

## Project structure

```text
src/
├── app/                    App entry point and global styles
├── components/
│   ├── dashboard/          Dashboard UI
│   └── icons/              Shared Iconify icons
├── hooks/                  Survey data loading
├── theme/                  MUI theme and data colours
├── types/                  Survey types
└── utils/                  Parsing, chart, POI and survey helpers

tests/
├── components/             Component tests
├── helpers/                Shared test helpers
├── mocks/                  Third party component mocks
└── utils/                  Data and utility tests
```

## Future improvements

With more time I would look at:

- Adding table filters for survey method, UKRI track, route position and measurement ranges.
- Improving table pagination with page numbers, first and last page controls, and a jump to page option.
- Adding search and export options for larger survey datasets.
- Retaining chart instances between views so switching modes can reuse rendered chart state rather than reinitialising the chart.
- Adding more map controls, such as toggling individual UKRI tracks and filtering points of interest.
- Adding end to end and further accessibility testing for complete user workflows.

## Task

The original task supplied two CSV files containing MPD and UKRI measurements from the same section of road and asked for a simple, interactive dashboard with a focus on UI and UX, including charts, a map, a table and a way to highlight points of interest.
