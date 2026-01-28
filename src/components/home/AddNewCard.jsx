import { Plus, UserPlus, BookOpen, Users, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const actions = [
	{
		label: "Student",
		icon: UserPlus,
		color: "bg-blue-600",
		path: "/add-student",
	},
	{
		label: "Teacher",
		icon: BookOpen,
		color: "bg-indigo-600",
		path: "/add-teacher",
	},
	{
		label: "Staff",
		icon: Briefcase,
		color: "bg-emerald-600",
		path: "/add-staff",
	},
];

export default function AddNewCard() {
	return (
		<div className="flex flex-col gap-4 h-full">
			{/* Add New Card */}
			<Card className="rounded-sm flex flex-col gap-3 py-4">
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle className="text-base font-semibold">
						Add New
					</CardTitle>
					<Button variant="ghost" size="sm">
						<Plus className="h-4 w-4 text-muted-foreground" />
					</Button>
				</CardHeader>

				<CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					{actions.map((item) => (
						<Link
							to={item.path}
							key={item.label}
							className="group flex flex-col items-center justify-center gap-2 rounded-lg border p-3 sm:p-4 transition hover:bg-muted perspective:[900px]"
						>
							<div
								className={cn(
									"flex h-9 w-9 items-center justify-center rounded-full",
									"transform-gpu transition-transform duration-500 ease-out",
									"group-hover:transform-[rotateY(180deg)]",
									item.color,
								)}
							>
								<item.icon className="h-4 w-4 text-white" />
							</div>

							<span className="text-sm font-medium">
								{item.label}
							</span>
						</Link>
					))}
				</CardContent>
			</Card>

			{/* Overview Card */}
			<Card className="rounded-sm flex flex-col gap-3">
				<CardHeader>
					<CardTitle className="text-base font-semibold">
						Overview
					</CardTitle>
				</CardHeader>

				<CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
					<Stat
						label="Total Fees Collected"
						value="$25,000.02"
						change="1.2%"
					/>
					<Stat
						label="Fine Collected"
						value="$4,56.64"
						change="1.2%"
					/>
					<Stat
						label="Student Not Paid"
						value="$545"
						change="1.2%"
						type="low"
					/>
					<Stat
						label="Total Outstanding"
						value="$4,56.64"
						change="1.2%"
					/>
				</CardContent>
			</Card>
		</div>
	);
}

function Stat({ label, value, change, type = "high" }) {
	return (
		<div className="rounded-md border bg-muted/40 p-2 sm:p-3">
			<p className="text-xs text-muted-foreground">{label}</p>
			<p className="text-lg font-semibold">{value}</p>
			<p
				className={cn(
					"text-xs mt-2 sm:mt-3 font-semibold inline-block p-1 rounded-sm",
					type !== "low"
						? "bg-green-100 text-green-700"
						: "bg-red-100 text-red-700",
				)}
			>
				{type === "low" ? "↓" : "↑"} {change}
			</p>
		</div>
	);
}
