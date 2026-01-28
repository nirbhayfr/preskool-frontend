import DashboardHeader from "@/components/home/DashboardHeader";
import DashboardMain from "@/components/home/DashboardMain";

import { decryptData } from "@/utils/crypto";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";

function HomePage() {
	const encryptedUser = localStorage.getItem("user");
	if (!encryptedUser) return null;

	let user;
	try {
		user = decryptData(encryptedUser);
	} catch {
		return null;
	}

	switch (user.Role) {
		case "Admin":
			return (
				<section className="p-6">
					<DashboardHeader />
					<DashboardMain />
				</section>
			);

		case "Teacher":
			return <TeacherDashboard />;

		case "Student":
			return <StudentDashboard />;

		default:
			return null;
	}
}

export default HomePage;
