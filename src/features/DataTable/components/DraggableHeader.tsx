import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { flexRender, Column, Header } from "@tanstack/react-table";
import { DataType } from "@/features/DataContext/DataContext";
import Filter from "./Filter";

interface DraggableHeaderProps {
	header: Header<DataType, unknown>;
	column: Column<DataType>;
}

const DraggableHeader = ({ header, column }: DraggableHeaderProps) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({
			id: column.id,
		});

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
	};

	return (
		<th
			ref={setNodeRef}
			{...attributes}
			colSpan={header.colSpan}
			style={{ ...style, maxWidth: `${header.getSize()}px` }}
			className="border p-2"
		>
			{/* Заголовок с сортировкой */}
			<div
				className={
					column.getCanSort()
						? "cursor-grab select-none flex items-center"
						: "flex items-center"
				}
				{...listeners}
				style={{ maxWidth: `${header.getSize()}px` }}
				onClick={column.getToggleSortingHandler()}
			>
				{flexRender(column.columnDef.header, header.getContext())}
				{{
					asc: " 🔼",
					desc: " 🔽",
				}[column.getIsSorted() as string] ?? null}
			</div>

			{header.column.getCanFilter() ? (
				<div style={{ maxWidth: `${header.getSize()}px` }}>
					<Filter column={header.column} width={header.getSize()} />
				</div>
			) : null}
		</th>
	);
};

export default DraggableHeader;
