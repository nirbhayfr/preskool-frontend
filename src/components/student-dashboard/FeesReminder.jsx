import { Bus, BookOpen, GraduationCap, Utensils, Home } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const fees = [
	{
		title: "Transport Fees",
		amount: "$2500",
		date: "25 May 2024",
		icon: Bus,
		color: "blue",
	},
	{
		title: "Book Fees",
		amount: "$2500",
		date: "25 May 2024",
		icon: BookOpen,
		color: "cyan",
	},
	{
		title: "Exam Fees",
		amount: "$2500",
		date: "25 May 2024",
		icon: GraduationCap,
		color: "green",
	},
	{
		title: "Mess Fees",
		amount: "$2500 + $150",
		status: "Due",
		icon: Utensils,
		color: "red",
	},
	{
		title: "Hostel",
		amount: "$2500",
		date: "25 May 2024",
		icon: Home,
		color: "blue",
	},
];

const colorMap = {
	blue: "bg-blue-500/15 text-blue-500",
	green: "bg-green-500/15 text-green-500",
	cyan: "bg-cyan-500/15 text-cyan-500",
	red: "bg-red-500/15 text-red-500",
};

export function FeesReminder() {
	return (
		<Card className="w-full min-w-0 rounded-sm">
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-sm font-semibold">
					Fees Reminder
				</CardTitle>

				<Button variant="link" className="h-auto p-0 text-xs">
					View All
				</Button>
			</CardHeader>

			<CardContent className="space-y-3">
				{fees.map((item, index) => {
					const Icon = item.icon;

					return (
						<div
							key={index}
							className="flex items-center justify-between gap-3 rounded-md bg-muted/60 dark:bg-muted/40 p-3"
						>
							{/* Left */}
							<div className="flex items-center gap-3 min-w-0">
								{/* Icon */}
								<div
									className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
										colorMap[item.color]
									}`}
								>
									<Icon className="h-5 w-5" />
								</div>

								{/* Text */}
								<div className="space-y-1 min-w-0">
									<p className="text-sm font-medium text-foreground truncate">
										{item.title}
									</p>

									{item.status ? (
										<span className="inline-flex rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-medium text-red-500">
											{item.status}
										</span>
									) : (
										<p className="text-xs text-muted-foreground">
											Last Date
										</p>
									)}

									{item.date && (
										<p className="text-xs font-medium text-foreground">
											{item.date}
										</p>
									)}
								</div>
							</div>

							{/* Right */}
							<p className="text-sm font-semibold text-foreground whitespace-nowrap">
								{item.amount}
							</p>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
