import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

const statisticsData = [
	{ month: "Jan", avgScore: 35, avgAttendance: 95 },
	{ month: "Feb", avgScore: 78, avgAttendance: 60 },
	{ month: "Mar", avgScore: 92, avgAttendance: 88 },
	{ month: "Apr", avgScore: 50, avgAttendance: 72 },
	{ month: "May", avgScore: 40, avgAttendance: 98 },
	{ month: "Jun", avgScore: 100, avgAttendance: 55 },
];

export function StatisticsCard() {
	return (
		<Card className="col-span-1 sm:col-span-2 h-full rounded-sm">
			<CardHeader className="flex items-center justify-between">
				<CardTitle>Statistics</CardTitle>
				<span className="text-xs text-muted-foreground">
					Jan - Jun 2024
				</span>
			</CardHeader>

			<CardContent className="h-full min-h-72">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart
						data={statisticsData}
						margin={{
							top: 20,
							right: 20,
							left: 0,
							bottom: 0,
						}}
					>
						<CartesianGrid
							stroke="#e0e0e0"
							strokeDasharray="3 3"
							className="dark:stroke-gray-700"
						/>
						<XAxis
							dataKey="month"
							stroke="#64748b"
							className="dark:stroke-slate-400"
						/>
						<YAxis
							stroke="#64748b"
							className="dark:stroke-slate-400"
						/>
						<Tooltip
							contentStyle={{ backgroundColor: "white" }}
							itemStyle={{ color: "black" }}
						/>

						<Line
							type="monotone"
							dataKey="avgScore"
							stroke="#3B82F6"
							strokeWidth={3}
							dot={{ r: 3 }}
						/>
						<Line
							type="monotone"
							dataKey="avgAttendance"
							stroke="#06b6d4"
							strokeWidth={3}
							dot={{ r: 3 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
