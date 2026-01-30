import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Home } from "lucide-react";

export default function TeacherDetailsAndInfoCard() {
	return (
		<>
			{/* Profile + Basic Info */}
			<Card className="rounded-sm py-4">
				<CardContent className="px-3 py-0 space-y-6 my-0">
					{/* Profile Section */}
					<div className="relative z-10 flex items-center gap-5 min-w-0">
						{/* Avatar */}
						<div className="shrink-0">
							<div className="rounded-md border-2 border-white p-1">
								<img
									src="/img/teachers/teacher-01.jpg"
									alt="Teacher Profile"
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
									T849126
								</p>
								<h2 className="text-lg font-semibold truncate">
									Teresa
								</h2>
								<p className="text-xs text-muted-foreground">
									Joined : 25 May 24
								</p>
							</div>
						</div>
					</div>

					{/* Basic Information */}
					<div className="space-y-4">
						<h3 className="font-semibold text-foreground">
							Basic Information
						</h3>

						<div className="space-y-4 text-sm">
							<InfoRow
								label="Class & Section"
								value="III, A"
							/>
							<InfoRow label="Subject" value="Physics" />
							<InfoRow label="Gender" value="Female" />
							<InfoRow label="Blood Group" value="O +ve" />
							<InfoRow label="House" value="Red" />
							<InfoRow
								label="Language Known"
								value="English"
							/>
							<InfoRow
								label="Language"
								value="English, Spanish"
							/>
						</div>
					</div>

					<Button className="w-full">Edit Details</Button>
				</CardContent>
			</Card>

			{/* Primary Contact Info */}
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

					<ContactRow
						icon={<MapPin className="size-4 text-blue-500" />}
						label="PAN Number / ID Number"
						value="343445954908"
					/>
				</div>
			</Card>

			{/* Hostel / Transportation */}
			<Card className="p-0 rounded-sm">
				<div className="p-4 space-y-4">
					<h3 className="font-semibold text-foreground">
						Hostel / Transportation
					</h3>

					<TransportRow
						icon={<Home className="size-4 text-blue-500" />}
						label="Hostel"
						value="HI-Hostel, Floor"
					/>

					<TransportRow
						icon={<Home className="size-4 text-blue-500" />}
						label="Room No"
						value="25"
					/>
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
