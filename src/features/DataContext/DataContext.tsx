"use client";

import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
	ColumnDef,
	ColumnFiltersState,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	PaginationState,
	Row,
	Table,
	useReactTable,
} from "@tanstack/react-table";
import { createContext, useContext, useState, ReactNode, useMemo } from "react";

export interface DataType {
	id: number;
	first_name: string;
	last_name: string;
	phone_number: string;
	longitude: number;
	latitude: number;
	gps_code: string;
	birth_year: number;
	datetime: string;
}

interface DataContextType {
	table: Table<DataType>;
	handleDragEnd: (event: DragEndEvent) => void;
	columnOrder: string[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({
	children,
	initialData,
}: {
	children: ReactNode;
	initialData: DataType[];
}) {
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const initialColumns = useMemo<ColumnDef<DataType>[]>(
		() => [
			{
				accessorKey: "id",
				header: "ID",
				size: 80,
				minSize: 50,
				maxSize: 80,
				filterFn: (
					{ original }: Row<DataType>,
					columnId: string,
					filterValue: string
				): boolean => {
					return original[columnId as keyof DataType] == filterValue;
				},
			},
			{
				accessorKey: "first_name",
				header: "First Name",
				size: 150,
				minSize: 100,
				maxSize: 200,
			},
			{
				accessorKey: "last_name",
				header: "Last Name",
				size: 150,
				minSize: 100,
				maxSize: 200,
			},
			{
				accessorKey: "phone_number",
				header: "Phone",
				size: 130,
				minSize: 120,
				maxSize: 180,
			},
			{
				accessorKey: "gps_code",
				header: "GPS Code",
				size: 120,
				minSize: 100,
				maxSize: 150,
			},
			{
				accessorKey: "birth_year",
				header: "Birth Year",
				size: 80,
				minSize: 70,
				maxSize: 100,
			},
			{
				accessorKey: "datetime",
				header: "Datetime",
				size: 180,
				minSize: 150,
				maxSize: 250,
				meta: {
					filterVariant: "datepicker",
				},
				filterFn: (
					{ original }: Row<DataType>,
					columnId: string,
					filterValue: string
				): boolean => {
					const rowValue = new Date(original[columnId as keyof DataType]);
					const filterDate = new Date(filterValue);

					return rowValue >= filterDate;
				},
			},
		],
		[]
	);

	const [columnOrder, setColumnOrder] = useState<string[]>(
		initialColumns.map((col) => col.accessorKey as string)
	);
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		setColumnOrder((prevOrder) => {
			const oldIndex = prevOrder.indexOf(active.id as string);
			const newIndex = prevOrder.indexOf(over.id as string);
			return arrayMove(prevOrder, oldIndex, newIndex);
		});
	};

	const orderedColumns = useMemo(
		() =>
			columnOrder.map(
				(colId) => initialColumns.find((col) => col.accessorKey === colId)!
			),
		[columnOrder, initialColumns]
	);
	const table = useReactTable({
		data: initialData,
		columns: orderedColumns,
		filterFns: {},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			columnOrder,
			pagination,
			columnFilters,
		},
		onPaginationChange: setPagination,
		onColumnFiltersChange: setColumnFilters,
		onColumnOrderChange: setColumnOrder,
	});

	return (
		<DataContext.Provider value={{ table, handleDragEnd, columnOrder }}>
			{children}
		</DataContext.Provider>
	);
}

export function useData() {
	const context = useContext(DataContext);
	if (!context) throw new Error("useData must be used within a DataProvider");
	return context;
}
