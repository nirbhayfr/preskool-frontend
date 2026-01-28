import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Trash2, Clock } from "lucide-react";

export function Schedules({ title = "Schedules", items = [] }) {
	return (
		<Card className="h-full rounded-sm">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>{title}</CardTitle>
				<Button variant="ghost" size="sm">
					+ Add New
				</Button>
			</CardHeader>

			<CardContent className="space-y-4 max-h-130 overflow-y-auto">
				{items.length === 0 && (
					<p className="text-sm text-muted-foreground">
						No upcoming events.
					</p>
				)}

				{items.map((item) => (
					<div
						key={item.id}
						className={`relative rounded-lg border-l-4 p-4 bg-background shadow-sm
              ${
				item.type === "primary"
					? "border-blue-500"
					: item.type === "danger"
					? "border-red-500"
					: "border-cyan-500"
			}
            `}
					>
						<div className="flex justify-between items-start">
							<div className="space-y-1">
								<h4 className="font-medium">
									{item.title}
								</h4>

								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									<Calendar className="h-4 w-4" />
									<span>
										{item.startDate}
										{item.endDate &&
											` - ${item.endDate}`}
									</span>
								</div>

								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									<Clock className="h-4 w-4" />
									<span>{item.time}</span>
								</div>
							</div>

							<Button variant="ghost" size="icon">
								<Trash2 className="h-4 w-4 text-red-500" />
							</Button>
						</div>

						{item.participants?.length > 0 && (
							<div className="mt-3 flex -space-x-2">
								{item.participants.map((img, i) => (
									<img
										key={i}
										src={img}
										alt=""
										className="h-8 w-8 rounded-full border-2 border-background"
									/>
								))}
							</div>
						)}
					</div>
				))}
			</CardContent>
		</Card>
	);
}
