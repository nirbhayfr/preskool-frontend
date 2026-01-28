import loaderImg from "/img/logo-small.svg";
import { useEffect, useState } from "react";

export default function RouteLoader() {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => setLoading(false), 1200);
	}, []);

	return loading ? <CircleLoader src={loaderImg} /> : <></>;
}

export function CircleLoader({ size = 64 }) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
			<div className="relative" style={{ width: size, height: size }}>
				{/* Outer blue spinner */}
				<div className="absolute inset-0 rounded-full border-[6px] border-blue-600 dark:border-blue-400 border-t-transparent animate-spin"></div>

				{/* Inner cyan half – counter clockwise */}
				<div
					className="absolute inset-2.5 rounded-full overflow-hidden animate-spin"
					style={{ animationDirection: "reverse" }}
				>
					<div className="absolute bottom-0 h-1/2 w-full bg-cyan-400 dark:bg-cyan-500"></div>
				</div>
			</div>
		</div>
	);
}
