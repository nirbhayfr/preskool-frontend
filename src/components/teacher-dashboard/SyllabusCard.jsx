import { Pie, PieChart } from "recharts";
import { Card } from "@/components/ui/card";

export default function SyllabusDonutCard() {
	const completed = 85;
	const pending = 100 - completed;

	const data = [
		{ name: "Completed", value: completed, fill: "#3B82F6" },
		{ name: "Pending", value: pending, fill: "#8EC5FF" },
	];

	return (
		<Card className="flex flex-row items-center justify-center gap-4 rounded-sm p-4">
			{/* Donut */}
			<div className="relative flex h-16 w-16 items-center justify-center">
				<PieChart width={64} height={64}>
					<Pie
						data={data}
						dataKey="value"
						innerRadius={20}
						outerRadius={28}
						startAngle={90}
						endAngle={-270}
						stroke="none"
					/>
				</PieChart>

				{/* Center text */}
				<span className="absolute text-xs font-semibold text-foreground">
					{completed}%
				</span>
			</div>

			{/* Text */}
			<div className="flex flex-col justify-center">
				<h4 className="text-sm font-semibold text-foreground">
					Syllabus
				</h4>

				<div className="mt-1 space-y-0.5 text-xs font-medium">
					<p>
						Completed:{" "}
						<span className="text-blue-500">
							{completed}%
						</span>
					</p>
					<p>
						Pending:{" "}
						<span className="text-blue-300">{pending}%</span>
					</p>
				</div>
			</div>
		</Card>
	);
}
