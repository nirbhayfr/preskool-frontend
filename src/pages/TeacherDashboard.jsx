import { BestPerformersCard } from "@/components/teacher-dashboard/BestPerformers";
import { ClassSlider } from "@/components/teacher-dashboard/ClassSlider";
import { StudentMarksTable } from "@/components/teacher-dashboard/StudentMarksTableTD";
import SyllabusCard from "@/components/teacher-dashboard/SyllabusCard";
import SyllabusSlider from "@/components/teacher-dashboard/SyllabusSlider";
import TeacherProfilecard from "@/components/teacher-dashboard/TeacherProfilecard";
import { UpcomingEvents } from "@/components/teacher-dashboard/UpcomingEventsTD";

function TeacherDashboard() {
	return (
		<section className="p-6 space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-foreground">
					Dashboard
				</h1>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-[4fr_2fr_4fr] md:grid-cols-2">
				<TeacherProfilecard />
				<SyllabusCard />
				<ClassSlider />
				<BestPerformersCard />
				<div className="md:col-span-2">
					<SyllabusSlider />
				</div>
			</div>
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
				<StudentMarksTable />
				<UpcomingEvents />
			</div>
		</section>
	);
}

export default TeacherDashboard;
