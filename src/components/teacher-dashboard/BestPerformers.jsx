import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const performers = [
	{
		className: "Class IV, C",
		progress: 80,
		avatars: [
			"/img/students/student-01.jpg",
			"/img/students/student-02.jpg",
			"/img/students/student-03.jpg",
		],
		color: "blue",
	},
	{
		className: "Class III, B",
		progress: 68,
		avatars: [
			"/img/students/student-04.jpg",
			"/img/students/student-05.jpg",
			"/img/students/student-06.jpg",
		],
		color: "yellow",
	},
	{
		className: "Class V, A",
		progress: 53,
		avatars: [
			"/img/students/student-07.jpg",
			"/img/students/student-08.jpg",
			"/img/students/student-09.jpg",
		],
		color: "cyan",
	},
];

const progressColorMap = {
	blue: "[&>div]:bg-blue-500",
	yellow: "[&>div]:bg-yellow-400",
	cyan: "[&>div]:bg-cyan-500",
};

export function BestPerformersCard() {
	return (
		<Card className="rounded-sm">
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="font-semibold">
					Best Performers
				</CardTitle>
				<Button variant="link" className="h-auto p-0 text-xs">
					View All
				</Button>
			</CardHeader>

			<CardContent className="space-y-4">
				{performers.map((item, index) => (
					<div key={index} className="flex items-center gap-3">
						{/* Class name */}
						<span className="w-20 shrink-0 text-xs font-medium text-foreground">
							{item.className}
						</span>

						{/* Progress wrapper */}
						<div className="relative flex-1">
							<Progress
								value={item.progress}
								className={`h-6 ${
									progressColorMap[item.color]
								} bg-muted`}
							/>

							{/* Overlay content */}
							<div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2">
								{/* Avatars */}
								<div className="flex -space-x-2">
									{item.avatars.map((img, i) => (
										<img
											key={i}
											src={img}
											alt="student"
											className="h-5 w-5 rounded-full border border-background object-cover"
										/>
									))}
								</div>

								{/* Percentage */}
								<div className="rounded-sm bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-900 shadow">
									{item.progress}%
								</div>
							</div>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
