import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, Trash2 } from "lucide-react";
import {useDeleteNotice} from "@/hooks/useNoticeBoard";

// const levelConfig = {
// 	notice: {
// 		icon: Bell,
// 		color: "border-blue-500",
// 		badge: "Notice",
// 	},
// 	important: {
// 		icon: Bell,
// 		color: "border-cyan-500",
// 		badge: "Important",
// 	},
// 	alert: {
// 		icon: AlertTriangle,
// 		color: "border-red-500",
// 		badge: "Alert",
// 	},
// };

export function Notices({ title = "Notices", items = [], onAdd, }) {
	 const { mutate: deleteNotice, isPending } = useDeleteNotice();

	return (
		<Card className="h-full rounded-sm text-sm">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>{title}</CardTitle>
				<Button variant="ghost" size="sm" onClick={onAdd}>
					+ Add Notice
				</Button>
			</CardHeader>

			<CardContent className="space-y-4 max-h-130 overflow-y-auto">
				{items.map((item) => {
					// const config = levelConfig[item.level];
					// const Icon = config.icon;

					return (
						<div
							key={item?.noticeID}
							className={`relative rounded-lg border-l-4 p-4 bg-background shadow-sm `}
						>
							<div className="flex justify-between items-start gap-3">
								<div className="flex gap-3">
									<div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
										{/* <Icon className="h-5 w-5" /> */}
									</div>

									<div className="space-y-1 max-w-[calc(100%-3rem)] wrap-break-word">
										<div className="flex items-center gap-2 flex-wrap">
											<h4 className="font-medium wrap-break-words">
												{item?.Classes}
											</h4>
											
										</div>

										{/* <p className="text-sm text-muted-foreground wrap-break-word">
											• Classes:{" "}
											{item?.classes.join(", ")}
										</p> */}

										<p className="text-xs text-muted-foreground wrap-break-word">
											{item?.Description}
										</p>
									</div>
								</div>

								<Button
									variant="ghost"
									size="icon"
									onClick={() => {deleteNotice(item?.noticeID)}}
								>
									{isPending ? "Deleting..." : <Trash2 className="h-4 w-4 text-red-500" />}	
								</Button>
							</div>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
