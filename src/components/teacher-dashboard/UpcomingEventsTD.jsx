/* eslint-disable react-hooks/preserve-manual-memoization */
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Trash2, Clock } from "lucide-react";
import { useMemo, useState } from "react";
import { useDeleteEvent, useEvents } from "@/hooks/useEvent";
import moment from "moment";

// const items = [
// 	{
// 		id: 1,
// 		title: "Vacation Meeting",
// 		startDate: "07 July 2024",
// 		endDate: "07 July 2024",
// 		time: "09:10 AM - 10:50 PM",
// 		type: "primary",
// 		participants: [
// 			"/img/profile/avatar-01.jpg",
// 			"/img/profile/avatar-02.jpg",
// 		],
// 	},
// 	{
// 		id: 2,
// 		title: "Parents, Teacher Meet",
// 		startDate: "15 July 2024",
// 		time: "09:10 AM - 10:50 PM",
// 		type: "cyan",
// 		participants: [
// 			"/img/profile/avatar-06.jpg",
// 			"/img/profile/avatar-07.jpg",
// 			"/img/profile/avatar-08.jpg",
// 		],
// 	},
// 	{
// 		id: 3,
// 		title: "Staff Meeting",
// 		startDate: "10 July 2024",
// 		time: "09:10 AM - 10:50 PM",
// 		type: "primary",
// 		participants: [
// 			"/img/profile/avatar-03.jpg",
// 			"/img/profile/avatar-04.jpg",
// 			"/img/profile/avatar-05.jpg",
// 		],
// 	},
// 	{
// 		id: 4,
// 		title: "Admission Camp",
// 		startDate: "12 July 2024",
// 		time: "09:10 AM - 10:50 PM",
// 		type: "danger",
// 		participants: ["/img/profile/avatar-08.jpg"],
// 	},
// ];


const BORDER_COLORS = [
  'border-blue-500',
  'border-red-500',
  'border-cyan-500',
  'border-emerald-500',
  'border-amber-500',
  'border-purple-500',
]

export function UpcomingEvents({ title = "Upcoming Events" }) {
	const { data, isLoading } = useEvents()
	  const { mutate: deleteEvent } = useDeleteEvent()
	  const [deletingId, setDeletingId] = useState(null)
	
	  const items = useMemo(() => {
		if (!data?.data) return []
	
		return data.data.slice().sort((a, b) => moment(a.StartDate).diff(moment(b.StartDate)))
	  }, [data?.data])
	
	  const colorMap = useMemo(() => {
		const map = {}
	
		items.forEach((item) => {
		  map[item.EventID] = BORDER_COLORS[item.EventID % BORDER_COLORS.length]
		})
	
		return map
	  }, [items])
	
	  if (isLoading) {
		return <p className="text-sm text-muted-foreground">Loading...</p>
	  }
	


	return (
		 <Card className="h-full rounded-sm">
			  <CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>{title}</CardTitle>
				<Button variant="ghost" size="sm">
				  + Add New
				</Button>
			  </CardHeader>
		
			  <CardContent className="space-y-4 max-h-130 overflow-y-auto">
				{items.length === 0 && (
				  <p className="text-sm text-muted-foreground">No upcoming events.</p>
				)}
		
				{items.map((item) => (
				  <div
					key={item.EventID}
					className={`relative rounded-lg border-l-4 p-4 shadow-sm
					  bg-muted/40 dark:bg-muted/30
					  ${colorMap[item.EventID]}
					`}
				  >
					<div className="flex justify-between items-start">
					  <div className="space-y-1">
						<h4 className="font-medium truncate">{item.EventName}</h4>
		
						<div className="flex items-center gap-2 text-xs text-muted-foreground">
						  <Calendar className="h-4 w-4" />
						  <span>
							{moment(item.StartDate).format('DD-MM-YYYY')}
							{item.EndDate && ` - ${moment(item.EndDate).format('DD-MM-YYYY')}`}
						  </span>
						</div>
		
						<div className="flex items-center gap-2 text-xs text-muted-foreground">
						  <Clock className="h-4 w-4" />
						  <span>{moment(item.PublishedDate).format('DD-MM-YYYY')}</span>
						</div>
					  </div>
		
					  <Button
						variant="ghost"
						size="icon"
						disabled={deletingId === item.EventID}
						onClick={() => {
						  setDeletingId(item.EventID)
						  deleteEvent(item.EventID, {
							onSettled: () => setDeletingId(null),
						  })
						}}
					  >
						{deletingId === item.EventID ? (
						  '...'
						) : (
						  <Trash2 className="h-4 w-4 text-red-500" />
						)}
					  </Button>
					</div>
				  </div>
				))}
			  </CardContent>
			</Card>
	);
}
