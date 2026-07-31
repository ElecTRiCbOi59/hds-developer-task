type ChartSeries = {
	name: string
}

type ChartProps = {
	series?: ChartSeries[]
}

const DynamicChart = ({ series = [] }: ChartProps) => (
	<div data-testid='chart'>{series.map((item) => item.name).join(',')}</div>
)

const dynamic = () => DynamicChart

export default dynamic
