import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const books = [
	{
		title: "The Small-Town Library",
		img: "/img/books/book-01.jpg",
		takenOn: "25 Jan 2024",
		lastDate: "25 Jan 2024",
	},
	{
		title: "Apex Time",
		img: "/img/books/book-02.jpg",
		takenOn: "22 Jan 2024",
		lastDate: "25 Jan 2024",
	},
	{
		title: "The Cobalt Guitar",
		img: "/img/books/book-03.jpg",
		takenOn: "30 Jan 2024",
		lastDate: "10 Feb 2024",
	},
	{
		title: "Shard and the Tomb",
		img: "/img/books/book-04.jpg",
		takenOn: "10 Feb 2024",
		lastDate: "20 Feb 2024",
	},
	{
		title: "Shard and the Tomb 2",
		img: "/img/books/book-05.jpg",
		takenOn: "12 Feb 2024",
		lastDate: "22 Feb 2024",
	},
	{
		title: "Plague of Fear",
		img: "/img/books/book-06.jpg",
		takenOn: "15 Feb 2024",
		lastDate: "25 Feb 2024",
	},
];

function LibraryTabContent() {
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
											Book taken on:
										</span>{" "}
										{book.takenOn}
									</p>
									<p>
										<span className="font-medium text-foreground">
											Last Date:
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

export default LibraryTabContent;
