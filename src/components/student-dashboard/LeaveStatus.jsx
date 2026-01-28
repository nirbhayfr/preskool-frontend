import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const leaveData = [
	{
		id: 1,
		type: "Emergency Leave",
		date: "15 Jun 2024",
		status: "Pending",
		icon: <AlertCircle className="h-4 w-4" />,
		color: "blue",
	},
	{
		id: 2,
		type: "Medical Leave",
		date: "15 Jun 2024",
		status: "Approved",
		icon: <CheckCircle className="h-4 w-4" />,
		color: "blue",
	},
	{
		id: 3,
		type: "Medical Leave",
		date: "16 Jun 2024",
		status: "Declined",
		icon: <XCircle className="h-4 w-4" />,
		color: "red",
	},
	{
		id: 4,
		type: "Fever",
		date: "16 Jun 2024",
		status: "Approved",
		icon: <CheckCircle className="h-4 w-4" />,
		color: "blue",
	},
];

export function LeaveStatus({ title = "Leave Status" }) {
	return (
		<Card className="h-full rounded-sm w-full">
			<CardHeader className="flex justify-between items-center px-4">
				<CardTitle className="text-sm font-semibold">
					{title}
				</CardTitle>
			</CardHeader>

			<CardContent className="space-y-3 max-h-96 overflow-y-auto overflow-x-hidden px-4">
				{leaveData.map((leave) => (
					<div
						key={leave.id}
						className="flex justify-between items-center gap-3 p-3 rounded-md shadow-sm w-full bg-muted/60 dark:bg-muted/40"
					>
						{/* Left: icon + text */}
						<div className="flex items-center gap-3 flex-1 min-w-0">
							<div
								className={`shrink-0 p-2 rounded-md flex items-center justify-center ${
									leave.color === "blue"
										? "bg-blue-500/20 text-blue-500"
										: "bg-red-500/20 text-red-500"
								}`}
							>
								{leave.icon}
							</div>

							<div className="flex flex-col min-w-0 overflow-hidden">
								<p className="text-sm font-medium truncate">
									{leave.type}
								</p>
								<p className="text-xs text-muted-foreground truncate flex items-center gap-1">
									<Calendar className="h-3 w-3 shrink-0" />{" "}
									{leave.date}
								</p>
							</div>
						</div>

						{/* Right: status */}
						<div className="shrink-0 ml-2">
							<span
								className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap ${
									leave.status === "Declined"
										? "bg-red-500/20 text-red-500"
										: leave.status === "Pending"
										? "bg-yellow-500/20 text-yellow-500"
										: "bg-blue-500/20 text-blue-500"
								}`}
							>
								{leave.status}
							</span>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
