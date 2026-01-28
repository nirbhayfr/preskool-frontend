import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ProfileMenu() {
	const navigate = useNavigate();
	function handleLogout() {
		localStorage.removeItem("user");
		localStorage.removeItem("token");

		navigate("/login", { replace: true });
	}
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring">
					<Avatar className="h-9 w-9">
						<AvatarImage src="/img/avatar.jpg" alt="User" />
						<AvatarFallback>NC</AvatarFallback>
					</Avatar>
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-56">
				{/* User info */}
				<DropdownMenuLabel className="flex gap-3 items-center">
					<Avatar className="h-10 w-10">
						<AvatarImage src="/img/avatar.jpg" />
						<AvatarFallback>NC</AvatarFallback>
					</Avatar>

					<div className="flex flex-col leading-tight">
						<span className="font-medium">
							Nirbhay Chauhan
						</span>
						<span className="text-xs text-muted-foreground">
							Administrator
						</span>
					</div>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				{/* Actions */}
				<DropdownMenuItem>
					<User className="mr-2 h-4 w-4" />
					My Profile
				</DropdownMenuItem>

				<DropdownMenuItem>
					<Settings className="mr-2 h-4 w-4" />
					Settings
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					className="text-destructive focus:text-destructive"
					onClick={handleLogout}
				>
					<LogOut className="mr-2 h-4 w-4" />
					Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
