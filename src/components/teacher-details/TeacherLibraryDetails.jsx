import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const books = [
	{
		title: "Teaching Excellence",
		img: "/img/books/book-01.jpg",
		takenOn: "25 Jan 2024",
		lastDate: "25 Jan 2024",
	},
	{
		title: "Advanced Pedagogy",
		img: "/img/books/book-02.jpg",
		takenOn: "22 Jan 2024",
		lastDate: "25 Jan 2024",
	},
	{
		title: "Classroom Management",
		img: "/img/books/book-03.jpg",
		takenOn: "30 Jan 2024",
		lastDate: "10 Feb 2024",
	},
	{
		title: "Educational Psychology",
		img: "/img/books/book-04.jpg",
		takenOn: "10 Feb 2024",
		lastDate: "20 Feb 2024",
	},
	{
		title: "Curriculum Design",
		img: "/img/books/book-05.jpg",
		takenOn: "12 Feb 2024",
		lastDate: "22 Feb 2024",
	},
	{
		title: "Assessment Strategies",
		img: "/img/books/book-06.jpg",
		takenOn: "15 Feb 2024",
		lastDate: "25 Feb 2024",
	},
];

function TeacherLibraryTabContent() {
	return (
		<Card className="rounded-sm">
			<CardHeader>
				<CardTitle className="text-lg font-semibold">
					Library
				</CardTitle>
			</CardHeader>

			<CardContent>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{books.map((book, idx) => (
						<div
							key={idx}
							className="overflow-hidden rounded-sm border"
						>
							<img
								src={book.img}
								alt={book.title}
								className="h-48 w-full object-cover"
							/>

							<div className="space-y-2 p-4">
								<p className="text-sm font-medium">
									{book.title}
								</p>

								<div className="text-xs text-muted-foreground space-y-1">
									<p>
										<span className="font-medium text-foreground">
											Book issued on:
										</span>{" "}
										{book.takenOn}
									</p>
									<p>
										<span className="font-medium text-foreground">
											Return by:
										</span>{" "}
										{book.lastDate}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export default TeacherLibraryTabContent;
