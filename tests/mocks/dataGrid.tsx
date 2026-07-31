type Column = {
	field: string
	headerName?: string
}

type DataGridProps = {
	rows: unknown[]
	columns: Column[]
}

export const DataGrid = ({ rows, columns }: DataGridProps) => (
	<div data-testid='data-grid'>
		<span data-testid='row-count'>{rows.length}</span>

		<span data-testid='columns'>
			{columns
				.map((column) => column.headerName ?? column.field)
				.join(',')}
		</span>
	</div>
)
