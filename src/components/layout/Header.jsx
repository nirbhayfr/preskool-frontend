import { Calendar, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ModeToggle } from "./ModeToggle";
import { FullscreenButton } from "./FullscreenToggle";
import { ProfileMenu } from "./Profile";
import { SidebarTrigger } from "../ui/sidebar";
import { useEffect, useState } from "react";
import AddNew from "./AddNew";

function Header() {
	const [now, setNow] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => {
			setNow(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const formatted = now.toLocaleString("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: true,
	});

	const currentYear = new Date().getFullYear();
	const nextYear = currentYear + 1;
	return (
		<header className="p-3 px-2 md:px-6 flex justify-between md:justify-end items-center w-full ">
			<SidebarTrigger className="md:hidden" />
			<div className="flex gap-2 items-center">
				<Button
					variant="outline"
					size="sm"
					className="gap-2 pointer-events-none max-lg:hidden"
				>
					<Clock className="h-4 w-4 text-muted-foreground" />
					<span className="font-medium">{formatted}</span>
				</Button>

				<Button
					variant="outline"
					size="sm"
					className="gap-2 pointer-events-none"
				>
					<Calendar className="h-4 w-4 text-muted-foreground" />
					<p className="font-medium">
						<span className="hidden sm:inline-block mr-2">
							Academic Year
						</span>
						{currentYear} – {nextYear}
					</p>
				</Button>

				<AddNew />

				<ModeToggle />

				<FullscreenButton />

				<ProfileMenu />
			</div>
		</header>
	);
}

export default Header;
