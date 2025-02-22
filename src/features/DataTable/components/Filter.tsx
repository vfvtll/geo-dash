import { DataType } from "@/features/DataContext/DataContext";
import { Column } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

function DebouncedInput({
	value: initialValue,
	onChange,
	debounce = 500,
	...props
}: {
	value: string | number;
	onChange: (value: string | number) => void;
	debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value);
		}, debounce);

		return () => clearTimeout(timeout);
	}, [value]);

	return (
		<input
			{...props}
			value={value}
			onChange={(e) => setValue(e.target.value)}
		/>
	);
}

export default function Filter({
	column,
	width,
}: {
	column: Column<DataType, unknown>;
	width: number;
}) {
	const columnFilterValue = column.getFilterValue();
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	const { filterVariant } = column.columnDef.meta ?? {};
	return filterVariant === "range" ? (
		<div>
			<div className="flex space-x-2">
				{/* See faceted column filters example for min max values functionality */}
				<DebouncedInput
					type="number"
					value={(columnFilterValue as [number, number])?.[0] ?? ""}
					onChange={(value) =>
						column.setFilterValue((old: [number, number]) => [value, old?.[1]])
					}
					placeholder={`Min`}
					className="w-24 border shadow rounded"
				/>
				<DebouncedInput
					type="number"
					value={(columnFilterValue as [number, number])?.[1] ?? ""}
					onChange={(value) =>
						column.setFilterValue((old: [number, number]) => [old?.[0], value])
					}
					placeholder={`Max`}
					className="w-24 border shadow rounded"
				/>
			</div>
			<div className="h-1" />
		</div>
	) : filterVariant === "select" ? (
		<select
			onChange={(e) => column.setFilterValue(e.target.value)}
			value={columnFilterValue?.toString()}
		>
			{/* See faceted column filters example for dynamic select options */}
			<option value="">All</option>
			<option value="complicated">complicated</option>
			<option value="relationship">relationship</option>
			<option value="single">single</option>
		</select>
	) : filterVariant === "datepicker" ? (
		<DatePicker
			value={(columnFilterValue ?? "") as string}
			onChange={(value) => column.setFilterValue(value?.toISOString())}
			placeholderText="Search..."
			dateFormat="yyyy-MM-dd"
			timeFormat="HH:mm"
			showTimeSelect
			timeIntervals={15}
			className="p-2 border rounded-md"
		/>
	) : (
		<DebouncedInput
			className="w-36 border shadow rounded"
			onChange={(value) => column.setFilterValue(value)}
			placeholder={`Search...`}
			type="text"
			value={(columnFilterValue ?? "") as string}
			style={{
				maxWidth: `${width}px`,
				width: `${width - 5}px`,
				paddingRight: "5px",
			}}
		/>
	);
}
