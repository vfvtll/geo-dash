import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { flexRender, Column, Header } from "@tanstack/react-table";
import { DataType } from "@/features/DataContext/DataContext";
import Filter from "./Filter";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react"; // Используем иконки

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

	// Определяем иконку для сортировки
	const SortingIcon = column.getIsSorted()
		? column.getIsSorted() === "asc"
			? ChevronUp
			: ChevronDown
		: ChevronsUpDown; // Если сортировка не активна — показываем "двойную стрелку"

	return (
		<th
			ref={setNodeRef}
			{...attributes}
			colSpan={header.colSpan}
			style={{ ...style, maxWidth: `${header.getSize()}px` }}
			className="border p-2"
		>
			<div
				className="cursor-grab select-none flex items-center justify-between gap-2"
				{...listeners}
				style={{ maxWidth: `${header.getSize()}px`, cursor: "pointer" }}
				onClick={column.getToggleSortingHandler()}
			>
				{flexRender(column.columnDef.header, header.getContext())}
				<SortingIcon className="w-4 h-4 text-gray-600" />
			</div>

			{/* Фильтр */}
			{header.column.getCanFilter() ? (
				<div style={{ maxWidth: `${header.getSize()}px` }}>
					<Filter column={header.column} width={header.getSize()} />
				</div>
			) : null}
		</th>
	);
};

export default DraggableHeader;
