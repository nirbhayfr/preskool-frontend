"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const events = [
	{
		id: 1,
		title: "Parents, Teacher Meet",
		date: "15 July 2024",
		type: "Full Day",
		img: "/img/events/event-01.jpg",
	},
	{
		id: 2,
		title: "Farewell",
		date: "11 Mar 2024",
		type: "Half Day",
		img: "/img/events/event-02.jpg",
	},
	{
		id: 3,
		title: "Annual Day",
		date: "11 Mar 2024",
		type: "Half Day",
		img: "/img/events/event-03.jpg",
	},
	{
		id: 4,
		title: "Holi Celebration",
		date: "15 July 2024",
		type: "Full Day",
		img: "/img/events/event-04.jpg",
	},
	{
		id: 5,
		title: "Exam Result",
		date: "16 July 2024",
		type: "Half Day",
		img: "/img/events/event-05.jpg",
	},
];

export function EventsList({ title = "Events List" }) {
	return (
		<Card className="h-full rounded-sm w-full">
			<CardHeader className="flex justify-between items-center">
				<CardTitle className="text-sm font-semibold">
					{title}
				</CardTitle>
				<Button variant="link" size="sm" className="text-xs">
					View All
				</Button>
			</CardHeader>

			<CardContent className="space-y-3 max-h-100 overflow-y-auto">
				{events.map((event) => (
					<div
						key={event.id}
						className="flex flex-row items-center justify-between gap-3 p-3 rounded-md bg-muted/60 dark:bg-muted/40 shadow-sm w-full"
					>
						<div className="flex items-center gap-3 min-w-0">
							<img
								src={event.img}
								alt={event.title}
								className="h-10 w-10 rounded-lg border-2 border-background object-cover shrink-0"
							/>

							<div className="flex flex-col min-w-0">
								<p className="text-sm font-medium truncate">
									{event.title}
								</p>
								<p className="text-xs text-muted-foreground truncate">
									{event.date}
								</p>
							</div>
						</div>

						<span
							className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 whitespace-nowrap
                ${
					event.type === "Full Day"
						? "bg-green-500/20 text-green-500"
						: "bg-blue-500/20 text-blue-500"
				}`}
						>
							{event.type}
						</span>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
