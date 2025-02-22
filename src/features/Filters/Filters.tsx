"use client";

import { useState } from "react";

interface FilterProps {
	onFilterChange: (query: string) => void;
}

const Filters: React.FC<FilterProps> = ({ onFilterChange }) => {
	const [search, setSearch] = useState("");

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
		onFilterChange(event.target.value);
	};

	return (
		<div className="p-4">
			<input
				type="text"
				placeholder="Search by name..."
				value={search}
				onChange={handleChange}
				className="border p-2 rounded w-full"
			/>
		</div>
	);
};

export default Filters;
