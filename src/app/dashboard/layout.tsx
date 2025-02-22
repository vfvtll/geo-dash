export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col h-screen h-max-screen">
			<header className="bg-blue-500 text-white p-4">Geo-Dash Dashboard</header>
			<main className="flex-1 p-4">{children}</main>
		</div>
	);
}
