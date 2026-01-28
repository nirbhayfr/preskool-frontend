import { CheckCheck, X, Clock, Calendar } from "lucide-react";

export function AttendanceCell({ value }) {
	switch (value) {
		case "P":
			return (
				<span className="flex justify-center">
					<span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-700 text-white">
						<CheckCheck className="h-4 w-4" />
					</span>
				</span>
			);

		case "A":
			return (
				<span className="flex justify-center">
					<span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-700 text-white">
						<X className="h-4 w-4" />
					</span>
				</span>
			);

		case "L":
			return (
				<span className="flex justify-center">
					<span className="flex h-6 w-6 items-center justify-center rounded-md bg-yellow-500 text-white">
						<Clock className="h-4 w-4" />
					</span>
				</span>
			);

		case "H":
			return (
				<span className="flex justify-center">
					<span className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-600 text-white">
						<Clock className="h-4 w-4" />
					</span>
				</span>
			);

		case null:
		case undefined:
			return (
				<span className="flex justify-center">
					<span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-400 text-white">
						<Calendar className="h-4 w-4" />
					</span>
				</span>
			);

		default:
			return null;
	}
}
