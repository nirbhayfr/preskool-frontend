import { EventsList } from "@/components/student-dashboard/EventsList";
import { FeesReminder } from "@/components/student-dashboard/FeesReminder";
import { LeaveStatus } from "@/components/student-dashboard/LeaveStatus";
import { NoticeBoard } from "@/components/student-dashboard/NoticeBoard";
import { StatisticsCard } from "@/components/student-dashboard/StatisticsCard";
import { StudentActions } from "@/components/student-dashboard/StudentActions";
import StudentProfileCard from "@/components/student-dashboard/StudentProfileCard";

function StudentDashboard() {
	return (
		<section className="p-6">
			<div>
				<h1 className="text-2xl font-semibold text-foreground">
					Dashboard
				</h1>
			</div>

			<div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<StudentProfileCard />
				</div>
				<StudentActions />

				<FeesReminder />
				<div className="lg:col-span-2">
					<StatisticsCard />
				</div>

				<EventsList />
				<LeaveStatus />
				<NoticeBoard />
			</div>
		</section>
	);
}

export default StudentDashboard;
