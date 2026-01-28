import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Trash2, Clock } from "lucide-react";

const items = [
	{
		id: 1,
		title: "Vacation Meeting",
		startDate: "07 July 2024",
		endDate: "07 July 2024",
		time: "09:10 AM - 10:50 PM",
		type: "primary",
		participants: [
			"/img/profile/avatar-01.jpg",
			"/img/profile/avatar-02.jpg",
		],
	},
	{
		id: 2,
		title: "Parents, Teacher Meet",
		startDate: "15 July 2024",
		time: "09:10 AM - 10:50 PM",
		type: "cyan",
		participants: [
			"/img/profile/avatar-06.jpg",
			"/img/profile/avatar-07.jpg",
			"/img/profile/avatar-08.jpg",
		],
	},
	{
		id: 3,
		title: "Staff Meeting",
		startDate: "10 July 2024",
		time: "09:10 AM - 10:50 PM",
		type: "primary",
		participants: [
			"/img/profile/avatar-03.jpg",
			"/img/profile/avatar-04.jpg",
			"/img/profile/avatar-05.jpg",
		],
	},
	{
		id: 4,
		title: "Admission Camp",
		startDate: "12 July 2024",
		time: "09:10 AM - 10:50 PM",
		type: "danger",
		participants: ["/img/profile/avatar-08.jpg"],
	},
];

export function UpcomingEvents({ title = "Upcoming Events" }) {
	return (
		<Card className="h-full w-full max-w-full min-w-0 overflow-hidden rounded-sm">
			<CardHeader className="flex flex-row items-center justify-between w-full min-w-0">
				<CardTitle className="text-sm font-semibold truncate">
					{title}
				</CardTitle>

				<Button
					variant="ghost"
					size="sm"
					className="text-xs shrink-0"
				>
					+ Add New
				</Button>
			</CardHeader>

			<CardContent className="space-y-4 max-h-76 overflow-y-auto overflow-x-hidden w-full min-w-0">
				{items.map((item) => (
					<div
						key={item.id}
						className={`w-full max-w-full min-w-0 overflow-hidden
						rounded-md border-l-4 p-4
						bg-muted/60 dark:bg-muted/40
						shadow-sm
						${
							item.type === "primary"
								? "border-blue-500"
								: item.type === "danger"
								? "border-red-500"
								: "border-cyan-500"
						}`}
					>
						{/* Header row */}
						<div className="flex items-start justify-between gap-4 w-full min-w-0">
							{/* Left */}
							<div className="flex-1 min-w-0 space-y-2">
								<h4 className="truncate text-sm font-semibold text-foreground">
									{item.title}
								</h4>

								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									<Calendar className="h-3.5 w-3.5 shrink-0" />
									<span className="truncate">
										{item.startDate}
										{item.endDate &&
											` - ${item.endDate}`}
									</span>
								</div>

								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									<Clock className="h-3.5 w-3.5 shrink-0" />
									<span className="truncate">
										{item.time}
									</span>
								</div>
							</div>

							{/* Right */}
							<Button
								variant="ghost"
								size="icon"
								className="h-7 w-7 shrink-0"
							>
								<Trash2 className="h-4 w-4 text-red-500" />
							</Button>
						</div>

						{/* Participants */}
						{item.participants?.length > 0 && (
							<div className="mt-3 w-full max-w-full overflow-hidden">
								<div className="flex -space-x-2">
									{item.participants.map(
										(img, i) => (
											<img
												key={i}
												src={img}
												alt=""
												className="h-8 w-8 shrink-0 rounded-full border-2 border-background object-cover"
											/>
										)
									)}
								</div>
							</div>
						)}
					</div>
				))}
			</CardContent>
		</Card>
	);
}
