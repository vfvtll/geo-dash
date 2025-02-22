import { DataProvider } from "@/features/DataContext/DataContext";
import DataTable from "@/features/DataTable/DataTable";
import MapWrapper from "@/features/MapComponent/MapWrapper";
import { getData } from "@/lib/getData";

export default async function Dashboard() {
	const data = await getData();

	return (
		<DataProvider initialData={data}>
			<div className="p-4">
				<h1 className="text-2xl font-bold text-center">Dashboard</h1>

				<div className="flex flex-col items-center gap-4 p-4">
					<div className="w-full min-h-[300px]">
						<DataTable />
					</div>
					<div className="w-full">
						<MapWrapper />
					</div>
				</div>
			</div>
		</DataProvider>
	);
}
