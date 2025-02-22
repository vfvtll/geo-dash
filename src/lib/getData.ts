import fs from "fs";
import path from "path";

export async function getData() {
	const filePath = path.join(process.cwd(), "public", "mock.json");
	const jsonData = fs.readFileSync(filePath, "utf-8");
	return JSON.parse(jsonData);
}
