import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Bus, Mail, MapPin, Phone, Route } from "lucide-react";

export default function StudentDetailsAndInfoCard() {
	return (
		<>
			<Card className="rounded-sm py-4">
				<CardContent className="px-3 py-0 space-y-6 my-0">
					{/* Profile Section */}
					<div className="relative z-10 flex items-center gap-5 min-w-0">
						{/* Avatar */}
						<div className="shrink-0">
							<div className="rounded-md border-2 border-white p-1">
								<img
									src="/img/students/student-01.jpg"
									alt="Student Profile"
									className="size-20 rounded-sm object-cover"
								/>
							</div>
						</div>

						<div className="flex w-full min-w-0 flex-col gap-3">
							<div className="min-w-0">
								<Badge className="bg-green-100 text-green-600 rounded-sm mb-2">
									Active
								</Badge>
								<p className="text-[10px] opacity-80">
									#AD1256589
								</p>
								<h2 className="text-lg font-semibold truncate">
									Janet Daniel
								</h2>
							</div>
						</div>
					</div>

					{/* Basic Information */}
					<div className="space-y-4">
						<h3 className="font-semibold text-foreground">
							Basic Information
						</h3>

						<div className="space-y-4 text-sm">
							<InfoRow label="Roll No" value="35013" />
							<InfoRow label="Gender" value="Female" />
							<InfoRow
								label="Date of Birth"
								value="25 Jan 2008"
							/>
							<InfoRow label="Blood Group" value="O +ve" />
							<InfoRow
								label="Religion"
								value="Christianity"
							/>
							<InfoRow label="Caste" value="Catholic" />
							<InfoRow label="Category" value="OBC" />
							<InfoRow
								label="Mother Tongue"
								value="English"
							/>
							<InfoRow
								label="Language"
								value="English, Spanish"
							/>
						</div>
					</div>

					<Button className="w-full">Add Fees</Button>
				</CardContent>
			</Card>

			<Card className="p-0 rounded-sm">
				<div className="p-4 space-y-4">
					<h3 className="font-semibold text-foreground">
						Primary Contact Info
					</h3>

					<ContactRow
						icon={<Phone className="size-4 text-blue-500" />}
						label="Phone Number"
						value="+1 46548 84498"
					/>

					<ContactRow
						icon={<Mail className="size-4 text-blue-500" />}
						label="Email Address"
						value="jan@example.com"
					/>
				</div>
			</Card>

			<Card className="p-0 rounded-sm">
				<div className="p-4 space-y-4">
					<h3 className="font-semibold text-foreground">
						Transportation
					</h3>

					<div className="grid grid-cols-2 gap-4">
						<TransportRow
							icon={
								<Route className="size-4 text-blue-500" />
							}
							label="Route"
							value="Newyork"
						/>

						<TransportRow
							icon={
								<Bus className="size-4 text-blue-500" />
							}
							label="Bus Number"
							value="AM 54548"
						/>

						<TransportRow
							icon={
								<MapPin className="size-4 text-blue-500" />
							}
							label="Pickup Point"
							value="Cincinatti"
						/>
					</div>
				</div>
			</Card>
		</>
	);
}

function InfoRow({ label, value }) {
	return (
		<div className="flex justify-between gap-4">
			<span className="text-foreground">{label}</span>
			<span className="font-medium text-muted-foreground text-right">
				{value}
			</span>
		</div>
	);
}

function ContactRow({ icon, label, value }) {
	return (
		<div className="flex items-start gap-3">
			<div className="mt-1 shrink-0 p-2">{icon}</div>

			<div className="flex flex-col">
				<span className="text-xs text-foreground">{label}</span>
				<span className="text-sm font-medium text-muted-foreground">
					{value}
				</span>
			</div>
		</div>
	);
}

function TransportRow({ icon, label, value }) {
	return (
		<div className="flex items-start gap-3">
			<div className="mt-1 shrink-0">{icon}</div>

			<div className="flex flex-col">
				<span className="text-xs text-muted-foreground">
					{label}
				</span>
				<span className="text-sm font-medium text-foreground">
					{value}
				</span>
			</div>
		</div>
	);
}
