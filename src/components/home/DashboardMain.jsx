import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Schedules } from "./Schedules";
import { Notices } from "./Notices";
import AddNewCard from "./AddNewCard";
import DashboardChartsSection from "./DashboardCharts";
import DashboardChartsTwoSection from "./DashboardChartsTwo";
import { useTodayAttendanceCount } from "@/hooks/useAttendance";
import { useEvents } from "@/hooks/useEvent";
import { useNotices } from "@/hooks/useNoticeBoard";
import { CircleLoader } from "../layout/RouteLoader";

const entityMap = {
	Student: {
		img: "/img/icons/student.svg",
		color: "emerald",
	},
	Teacher: {
		img: "/img/icons/teacher.svg",
		color: "blue",
	},
	Staff: {
		img: "/img/icons/staff.svg",
		color: "amber",
	},
};

// const scheduleData = [
// 	{
// 		id: 1,
// 		title: "Teacher Training Workshop",
// 		startDate: "Aug 15, 2025",
// 		endDate: "Aug 16, 2025",
// 		time: "12:00 AM - 12:00 AM",
// 		type: "primary",
// 		participants: [
// 			"/img/profile/avatar-01.jpg",
// 			"/img/profile/avatar-02.jpg",
// 			"/img/profile/avatar-03.jpg",
// 		],
// 	},
// 	{
// 		id: 2,
// 		title: "Independence Day Celebration",
// 		startDate: "Aug 15, 2025",
// 		time: "12:00 AM - 12:00 AM",
// 		type: "info",
// 		participants: [
// 			"/img/profile/avatar-04.jpg",
// 			"/img/profile/avatar-05.jpg",
// 		],
// 	},
// 	{
// 		id: 3,
// 		title: "Science Fair",
// 		startDate: "Aug 20, 2025",
// 		endDate: "Aug 21, 2025",
// 		time: "12:00 AM - 12:00 AM",
// 		type: "danger",
// 		participants: [
// 			"/img/profile/avatar-06.jpg",
// 			"/img/profile/avatar-07.jpg",
// 			"/img/profile/avatar-08.jpg",
// 		],
// 	},
// 	{
// 		id: 4,
// 		title: "Teacher Training Workshop",
// 		startDate: "Aug 15, 2025",
// 		endDate: "Aug 16, 2025",
// 		time: "12:00 AM - 12:00 AM",
// 		type: "primary",
// 		participants: [
// 			"/img/profile/avatar-01.jpg",
// 			"/img/profile/avatar-02.jpg",
// 			"/img/profile/avatar-03.jpg",
// 		],
// 	},
// 	{
// 		id: 5,
// 		title: "Independence Day Celebration",
// 		startDate: "Aug 15, 2025",
// 		time: "12:00 AM - 12:00 AM",
// 		type: "info",
// 		participants: [
// 			"/img/profile/avatar-04.jpg",
// 			"/img/profile/avatar-05.jpg",
// 		],
// 	},
// 	{
// 		id: 6,
// 		title: "Science Fair",
// 		startDate: "Aug 20, 2025",
// 		endDate: "Aug 21, 2025",
// 		time: "12:00 AM - 12:00 AM",
// 		type: "danger",
// 		participants: [
// 			"/img/profile/avatar-06.jpg",
// 			"/img/profile/avatar-07.jpg",
// 			"/img/profile/avatar-08.jpg",
// 		],
// 	},
// ];

// const noticeData = [
// 	{
// 		id: 1,
// 		title: "Do not wear white uniform",
// 		description: "Do not wear white uniform on Saturday.",
// 		level: "notice",
// 		classes: ["All"],
// 	},
// 	{
// 		id: 2,
// 		title: "Computer Lab Maintenance",
// 		description: "Computer lab maintenance — classes shifted to Room 15.",
// 		level: "important",
// 		classes: ["2A", "2B", "2C"],
// 	},
// 	{
// 		id: 3,
// 		title: "Drawing Competition",
// 		description: "Drawing competition for Class 6 on Wednesday.",
// 		level: "alert",
// 		classes: ["6A", "6B"],
// 	},
// 	{
// 		id: 4,
// 		title: "Special Physics Work",
// 		description:
// 			"Special physics assignment submission for senior classes.",
// 		level: "notice",
// 		classes: ["11Sci", "12Sci"],
// 	},
// ];

export default function DashboardMain() {
	const { data: attendanceData, isLoading } = useTodayAttendanceCount();
	const { data: scheduleData } = useEvents();
	const { data: noticeData } = useNotices();
	console.log(
		"scheduleData",scheduleData
	)
	if (isLoading) return <CircleLoader />;

	const enrichedDataArray = attendanceData.Data.map((item) => {
		const inactivePercent = (item.absent / item.total) * 100;

		return {
			...item,
			img: entityMap[item.entity]?.img || "/img/default.png",
			color: entityMap[item.entity]?.color || "#000000",
			inactivePercent: inactivePercent,
		};
	});

	const badgeColors = {
		emerald: "bg-emerald-600",
		blue: "bg-blue-600",
		amber: "bg-amber-600",
		red: "bg-red-600",
	};

	const imgColors = {
		emerald: "bg-emerald-300",
		blue: "bg-blue-300",
		amber: "bg-amber-300",
	};

	return (
		<>
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 mt-8">
				{enrichedDataArray.map((item, i) => (
					<Card
						key={i}
						className="relative overflow-hidden rounded-xs py-3"
					>
						<CardContent className="px-4 space-y-3">
							{/* Top Row */}
							<div className="flex items-start justify-between">
								<div className="flex gap-4">
									<div
										className={`h-12 w-12 flex items-center justify-center ${
											imgColors[item.color]
										}`}
									>
										<img
											src={item.img}
											alt=""
											className="h-10 w-10"
										/>
									</div>

									<div>
										<h2 className="text-2xl font-semibold">
											{item.total}
										</h2>
										<p className="text-sm text-muted-foreground">
											Total {item.entity}
										</p>
									</div>
								</div>

								<Badge
									variant="secondary"
									className={`${
										badgeColors[item.color]
									} rounded-sm text-white/90 font-semibold`}
								>
									{item.inactivePercent.toFixed(2)}%
								</Badge>
							</div>

							{/* Bottom Row */}
							<div className="grid grid-cols-2 text-sm mt-6 divide-x border-t py-2">
								<p className="font-semibold pr-4">
									Present:{" "}
									<span className="text-green-600">
										{item.present}
									</span>
								</p>

								<p className="font-semibold ml-auto">
									Absent:{" "}
									<span className="text-red-600">
										{item.absent}
									</span>
								</p>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
			<DashboardChartsSection attendanceData={attendanceData.Data} />
			<div className="grid gap-4 md:grid-cols-1 xl:grid-cols-3 mt-6">
				<Schedules items={scheduleData.data} />
				<Notices items={noticeData.data} />
				<AddNewCard />
			</div>
			<DashboardChartsTwoSection />
		</>
	);
}
