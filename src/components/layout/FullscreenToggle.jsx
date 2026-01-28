import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function FullscreenButton() {
	const [isFullscreen, setIsFullscreen] = useState(
		!!document.fullscreenElement
	);

	useEffect(() => {
		const handler = () => {
			setIsFullscreen(!!document.fullscreenElement);
		};

		document.addEventListener("fullscreenchange", handler);
		return () =>
			document.removeEventListener("fullscreenchange", handler);
	}, []);

	const toggleFullscreen = async () => {
		if (!document.fullscreenElement) {
			await document.documentElement.requestFullscreen();
		} else {
			await document.exitFullscreen();
		}
	};

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={toggleFullscreen}
			aria-label="Toggle fullscreen"
			className="hidden md:flex"
		>
			{isFullscreen ? (
				<Minimize className="h-5 w-5" />
			) : (
				<Maximize className="h-5 w-5" />
			)}
		</Button>
	);
}
