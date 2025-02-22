"use client";

import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
	AccessorKeyColumnDefBase,
	ColumnDef,
	ColumnFiltersState,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	PaginationState,
	Row,
	SortingState,
	Table,
	useReactTable,
} from "@tanstack/react-table";
import {
	createContext,
	useContext,
	useState,
	ReactNode,
	useMemo,
	useEffect,
} from "react";
import { format } from "date-fns";

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

	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const formatPhoneNumber = (phone: string) => {
		const cleaned = phone.replace(/\D/g, "");

		if (cleaned.length === 10) {
			return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(
				6,
				8
			)}-${cleaned.slice(8)}`;
		}

		return phone;
	};
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
				header: "Ad",
				size: 150,
				minSize: 100,
				maxSize: 200,
			},
			{
				accessorKey: "last_name",
				header: "Soyad",
				size: 150,
				minSize: 100,
				maxSize: 200,
			},
			{
				accessorKey: "phone_number",
				header: "Telefon",
				size: 130,
				minSize: 120,
				maxSize: 180,
				cell: ({ row }) => (
					<a
						href={`tel:${row.original.phone_number}`}
						className="text-blue-600 underline"
					>
						{formatPhoneNumber(row.original.phone_number)}
					</a>
				),
			},
			{
				accessorKey: "gps_code",
				header: "GPS Kodu",
				size: 120,
				minSize: 100,
				maxSize: 150,
			},
			{
				accessorKey: "birth_year",
				header: "Doğum ili",
				size: 120,
				minSize: 100,
				maxSize: 120,
			},
			{
				accessorKey: "datetime",
				header: "Tarix və Saat",
				size: 180,
				minSize: 150,
				maxSize: 250,
				meta: {
					filterVariant: "datepicker",
				},
				sortingFn: "datetime",
				cell: ({ row }) => (
					<span className="text-gray-700">
						{format(new Date(row.original.datetime), "dd.MM.yyyy HH:mm")}
					</span>
				),
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
		initialColumns.map(
			(col) => (col as AccessorKeyColumnDefBase<DataType>).accessorKey as string
		)
	);

	useEffect(() => {
		const newSorting = columnFilters.map((filter) => ({
			id: filter.id,
			desc: false,
		}));

		setSorting(newSorting);
	}, [columnFilters]);

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
				(colId) =>
					initialColumns.find(
						(col) =>
							(col as AccessorKeyColumnDefBase<DataType>).accessorKey === colId
					)!
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
		getSortedRowModel: getSortedRowModel(),
		state: {
			columnOrder,
			pagination,
			columnFilters,
			sorting,
		},
		onPaginationChange: setPagination,
		onColumnFiltersChange: setColumnFilters,
		onColumnOrderChange: setColumnOrder,
		onSortingChange: setSorting,
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
