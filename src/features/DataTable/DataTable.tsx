"use client";

import { flexRender } from "@tanstack/react-table";
import {
	DndContext,
	useSensor,
	useSensors,
	MouseSensor,
	TouchSensor,
	KeyboardSensor,
	closestCenter,
} from "@dnd-kit/core";
import {
	SortableContext,
	horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useData } from "../DataContext/DataContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DraggableHeader from "./components/DraggableHeader";

const DataTable: React.FC = () => {
	const { handleDragEnd, table, columnOrder } = useData();

	const sensors = useSensors(
		useSensor(MouseSensor),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor)
	);
	if (typeof window === "undefined") return;
	return (
		<DndContext
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
			sensors={sensors}
		>
			<table
				className="w-full border border-gray-300"
				style={{
					maxWidth: `${table
						.getHeaderGroups()?.[0]
						.headers.reduce((result, item) => result + item.getSize(), 0)}px`,
				}}
			>
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id} className="border-b border-gray-300">
							<SortableContext
								items={columnOrder}
								strategy={horizontalListSortingStrategy}
							>
								{headerGroup.headers.map((header) => (
									<th
										key={header.id}
										className="border-r border-blue-400 p-2 bg-gray-100 text-left"
									>
										<DraggableHeader header={header} column={header.column} />
									</th>
								))}
							</SortableContext>
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id} className="border-b border-gray-300">
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id} className="border-r border-blue-400 p-2">
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
			<div className="flex items-center justify-between mt-4 border-t pt-4">
				{/* 🔹 Пагинация */}
				<div className="flex items-center gap-4">
					<button
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
						className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg 
				hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
					>
						<ChevronLeft className="w-5 h-5" />
					</button>

					<span className="text-gray-700 font-medium">
						Page {table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()}
					</span>

					<button
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
						className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg 
				hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
					>
						<ChevronRight className="w-5 h-5" />
					</button>
				</div>
			</div>
		</DndContext>
	);
};

export default DataTable;
