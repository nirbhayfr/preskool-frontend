import { useRef } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const todayClasses = [
	{ time: "09:00 - 09:45", className: "Class V, B", color: "blue" },
	{ time: "10:00 - 10:45", className: "Class IV, C", color: "red" },
	{ time: "11:00 - 11:45", className: "Class III, A", color: "blue" },
	{ time: "12:00 - 12:45", className: "Class VI, D", color: "red" },
	{ time: "01:00 - 01:45", className: "Class II, A", color: "blue" },
];

export function ClassSlider() {
	const sliderRef = useRef(null);

	const scroll = (dir) => {
		if (!sliderRef.current) return;
		sliderRef.current.scrollBy({
			left: dir === "left" ? -200 : 200,
			behavior: "smooth",
		});
	};

	const today = new Date().toLocaleDateString("en-US", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});

	return (
		<Card className="rounded-sm p-4 space-y-1 overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<h3 className="text-sm font-semibold text-foreground">
						Today’s Class
					</h3>

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

				<span className="text-xs text-muted-foreground">
					{today}
				</span>
			</div>

			{/* Slider */}
			<div
				ref={sliderRef}
				className="flex gap-3 overflow-x-auto scroll-smooth"
				style={{ scrollbarWidth: "none" }}
			>
				{todayClasses.map((item, index) => (
					<div
						key={index}
						className="shrink-0 w-45 rounded-md bg-muted p-3 space-y-3"
					>
						{/* Time badge */}
						<div
							className={`inline-flex items-center gap-1 rounded-sm px-2 py-1 text-[10px] font-medium text-white ${
								item.color === "blue"
									? "bg-blue-500"
									: "bg-red-500"
							}`}
						>
							<Clock className="h-3 w-3" />
							{item.time}
						</div>

						{/* Class */}
						<p className="text-sm font-semibold text-foreground">
							{item.className}
						</p>
					</div>
				))}
			</div>
		</Card>
	);
}
