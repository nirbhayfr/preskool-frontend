import { FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNotices } from "@/hooks/useNoticeBoard";

// const notices = [
// 	{ id: 1, title: "New Syllabus Instructions", date: "11 Mar 2024" },
// 	{
// 		id: 2,
// 		title: "World Environment Day Program.....!!!",
// 		date: "21 Apr 2024",
// 	},
// 	{ id: 3, title: "Exam Preparation Notification!", date: "13 Mar 2024" },
// 	{ id: 4, title: "Online Classes Preparation", date: "24 May 2024" },
// 	{ id: 5, title: "Exam Time Table Release", date: "24 May 2024" },
// 	{ id: 6, title: "English Exam Preparation", date: "23 Mar 2024" },
// ];

export function NoticeBoard({ title = "Notice Board" }) {
	const { data:notice } = useNotices()
	return (
		<Card className="h-full rounded-sm w-full">
			<CardHeader className="flex justify-between items-center px-4">
				<CardTitle className="text-sm font-semibold">
					{title}
				</CardTitle>
				<Button variant="ghost" size="sm" className="text-xs">
					View All
				</Button>
			</CardHeader>

			<CardContent className="space-y-3 px-4 py-2 max-h-96 overflow-y-auto">
				{notice?.data?.map((notice) => (
					<div
						key={notice.NoticeID}
						className="flex gap-2 items-start p-3 bg-muted/60 dark:bg-muted/40 rounded-md shadow"
					>
						<div className="shrink-0 flex items-center justify-center h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-500">
							<FileText className="h-4 w-4" />
						</div>

						<div className="flex flex-col min-w-0">
							<p className="text-sm font-medium truncate">
								{notice.Description}
							</p>
							<p className="text-xs text-muted-foreground truncate">
								Classess: {notice.Classes}
							</p>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
