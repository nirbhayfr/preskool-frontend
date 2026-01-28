import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Phone, Mail } from "lucide-react";

function StudentDetailsTabContent() {
	return (
		<div className="space-y-6">
			<Card className="rounded-sm">
				<CardHeader className="">
					<CardTitle className="font-semibold text-lg">
						Parents Information
					</CardTitle>
				</CardHeader>

				<CardContent className="pt-0 space-y-6">
					{/* Father */}
					<div className="flex items-start gap-4">
						<img
							src="/img/parents/parent-01.jpg"
							alt="Father"
							className="size-14 rounded-sm object-cover"
						/>

						<div className="flex w-full items-start justify-between">
							{/* Name + Role */}
							<div>
								<p className="text-sm font-medium">
									Jerald Vicinius
								</p>
								<p className="text-xs text-muted-foreground">
									Father
								</p>
							</div>

							{/* Contact */}
							<div className="space-y-1 text-xs text-muted-foreground text-right">
								<div className="flex items-center justify-end gap-2">
									<Phone className="size-3.5" />
									<span>+1 45545 46464</span>
								</div>
								<div className="flex items-center justify-end gap-2">
									<Mail className="size-3.5" />
									<span>jera@example.com</span>
								</div>
							</div>
						</div>
					</div>

					{/* Mother */}
					<div className="flex items-start gap-4">
						<img
							src="/img/parents/parent-02.jpg"
							alt="Mother"
							className="size-14 rounded-sm object-cover"
						/>

						<div className="flex w-full items-start justify-between">
							{/* Name + Role */}
							<div>
								<p className="text-sm font-medium">
									Roberta Webber
								</p>
								<p className="text-xs text-muted-foreground">
									Mother
								</p>
							</div>

							{/* Contact */}
							<div className="space-y-1 text-xs text-muted-foreground text-right">
								<div className="flex items-center justify-end gap-2">
									<Phone className="size-3.5" />
									<span>+1 46499 24357</span>
								</div>
								<div className="flex items-center justify-end gap-2">
									<Mail className="size-3.5" />
									<span>robe@example.com</span>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				{/* Address Card */}
				<Card className="rounded-sm">
					<CardHeader>
						<CardTitle className="font-semibold">
							Address
						</CardTitle>
					</CardHeader>

					<CardContent className="pt-0 space-y-4">
						<div>
							<p className="text-xs text-muted-foreground">
								Current Address
							</p>
							<p className="mt-1 text-sm">
								3495 Red Hawk Road, Buffalo Lake, MN
								55314
							</p>
						</div>

						<div>
							<p className="text-xs text-muted-foreground">
								Permanent Address
							</p>
							<p className="mt-1 text-sm">
								3495 Red Hawk Road, Buffalo Lake, MN
								55314
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Previous School Card */}
				<Card className="rounded-sm">
					<CardHeader>
						<CardTitle className="font-semibold">
							Previous School Details
						</CardTitle>
					</CardHeader>

					<CardContent className="pt-0 space-y-4">
						<div>
							<p className="text-xs text-muted-foreground">
								Previous School Name
							</p>
							<p className="mt-1 text-sm">
								Oxford Matriculation, USA
							</p>
						</div>

						<div>
							<p className="text-xs text-muted-foreground">
								School Address
							</p>
							<p className="mt-1 text-sm">
								1852 Barnes Avenue, Cincinnati, OH 45202
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card className="rounded-sm">
				<CardHeader>
					<CardTitle className="font-semibold">
						Other Info
					</CardTitle>
				</CardHeader>

				<CardContent className="pt-0">
					<p className="text-sm text-muted-foreground leading-relaxed">
						Depending on the specific needs of your
						organization or system, additional information may
						be collected or tracked. It&apos;s important to
						ensure that any data collected complies with
						privacy regulations and policies to protect
						students&apos; sensitive information.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}

export default StudentDetailsTabContent;
