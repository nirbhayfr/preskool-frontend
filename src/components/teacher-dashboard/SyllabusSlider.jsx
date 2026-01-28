import { useRef } from "react";
import { ChevronLeft, ChevronRight, CalendarClock, Share2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const lessons = [
	{
		className: "Class V",
		topic: "Introduction to Light",
		progress: 70,
		color: "green",
	},
	{
		className: "Class IV",
		topic: "Fractions & Decimals",
		progress: 45,
		color: "yellow",
	},
	{
		className: "Class VI",
		topic: "Motion & Speed",
		progress: 85,
		color: "blue",
	},
	{
		className: "Class III",
		topic: "Basic Grammar",
		progress: 30,
		color: "red",
	},
];

const colorMap = {
	green: {
		badge: "bg-green-100 text-green-700",
		progress: "[&>div]:bg-green-500",
	},
	yellow: {
		badge: "bg-yellow-100 text-yellow-700",
		progress: "[&>div]:bg-yellow-400",
	},
	blue: {
		badge: "bg-blue-100 text-blue-700",
		progress: "[&>div]:bg-blue-500",
	},
	red: {
		badge: "bg-red-100 text-red-700",
		progress: "[&>div]:bg-red-500",
	},
};

export default function SyllabusSlider() {
	const sliderRef = useRef(null);

	const scroll = (dir) => {
		if (!sliderRef.current) return;
		sliderRef.current.scrollBy({
			left: dir === "left" ? -260 : 260,
			behavior: "smooth",
		});
	};

	return (
		<Card className="rounded-sm">
			{/* Header */}
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<div className="flex items-center gap-2">
					<CardTitle className="text-sm font-semibold">
						Syllabus / Lesson Plan
					</CardTitle>

					<div className="flex gap-1">
						<Button
							size="icon"
							variant="outline"
							className="h-6 w-6"
							onClick={() => scroll("left")}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button
							size="icon"
							variant="outline"
							className="h-6 w-6"
							onClick={() => scroll("right")}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>

				<Button variant="link" className="h-auto p-0 text-xs">
					View All
				</Button>
			</CardHeader>

			{/* Slider */}
			<CardContent>
				<div
					ref={sliderRef}
					className="flex gap-4 overflow-x-auto scroll-smooth pr-1"
					style={{ scrollbarWidth: "none" }}
				>
					{lessons.map((item, i) => (
						<div
							key={i}
							className="min-w-60 rounded-md border bg-background p-4 space-y-3 dark:bg-muted"
						>
							{/* Class badge */}
							<span
								className={`inline-block rounded-sm px-2 py-0.5 text-xs font-medium ${
									colorMap[item.color].badge
								}`}
							>
								{item.className}
							</span>

							{/* Topic */}
							<h4 className="text-sm font-semibold text-foreground">
								{item.topic}
							</h4>

							{/* Progress */}
							<Progress
								value={item.progress}
								className={`h-2 bg-muted ${
									colorMap[item.color].progress
								}`}
							/>

							{/* Actions */}
							<div className="flex items-center justify-between pt-2">
								<Button
									size="sm"
									variant="outline"
									className="h-7 text-xs"
								>
									<CalendarClock className="mr-1 h-3.5 w-3.5" />
									Reschedule
								</Button>

								<Button
									size="icon"
									variant="ghost"
									className="h-7 w-7"
								>
									<Share2 className="h-4 w-4" />
								</Button>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
