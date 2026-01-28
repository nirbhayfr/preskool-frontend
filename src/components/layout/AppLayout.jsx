import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Header from "./Header";

function AppLayout() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="flex flex-col flex-1 min-w-0">
				<Header />
				<Outlet />
			</main>
		</SidebarProvider>
	);
}
export default AppLayout;
