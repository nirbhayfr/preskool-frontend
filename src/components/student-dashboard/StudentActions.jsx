import { FileText, Send, CreditCard, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StudentActions() {
	return (
		<div className="grid grid-cols-2 gap-4 w-full min-w-0 h-full">
			<Button
				variant="outline"
				className="flex h-full items-center justify-center gap-2 py-4"
			>
				<FileText className="h-5 w-5" />
				<span className="text-sm font-medium">Apply Leave</span>
			</Button>

			<Button
				variant="outline"
				className="flex h-full items-center justify-center gap-2 py-4"
			>
				<Send className="h-5 w-5" />
				<span className="text-sm font-medium">Raise Request</span>
			</Button>

			<Button
				variant="outline"
				className="flex h-full items-center justify-center gap-2 py-4"
			>
				<CreditCard className="h-5 w-5" />
				<span className="text-sm font-medium">Pay Fees</span>
			</Button>

			<Button
				variant="outline"
				className="flex h-full items-center justify-center gap-2 py-4"
			>
				<GraduationCap className="h-5 w-5" />
				<span className="text-sm font-medium">Exam Result</span>
			</Button>
		</div>
	);
}
