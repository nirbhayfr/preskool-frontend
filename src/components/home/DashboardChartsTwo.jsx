import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
	PieChart,
	Pie,
	Cell,
	Tooltip as ReTooltip,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
	Legend,
} from "recharts";
import { Tooltip } from "@/components/ui/tooltip";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

// Dummy data
const classes = ["Class I", "Class II", "Class III"];

const performanceData = {
	"Class I": { top: 35, average: 15, belowAvg: 5 },
	"Class II": { top: 45, average: 11, belowAvg: 2 },
	"Class III": { top: 28, average: 20, belowAvg: 7 },
};

const areaData = [
	{ month: "Jan", earnings: 50000, expenses: 35000 },
	{ month: "Feb", earnings: 48000, expenses: 30000 },
	{ month: "Mar", earnings: 52000, expenses: 36000 },
	{ month: "Apr", earnings: 58000, expenses: 40000 },
	{ month: "May", earnings: 60000, expenses: 45000 },
	{ month: "Jun", earnings: 57000, expenses: 43000 },
	{ month: "Jul", earnings: 62000, expenses: 47000 },
	{ month: "Aug", earnings: 64000, expenses: 48000 },
];

const PIE_COLORS = ["#3b82f6", "#60a5fa", "#bfdbfe"]; // blue shades

export default function DashboardChartsTwoSection() {
	const [selectedClass, setSelectedClass] = useState("Class II");
	const containerRef = useRef(null);
	const [width, setWidth] = useState(0);
	const resizeTimeout = useRef(null);

	const perf = performanceData[selectedClass];
	const pieData = [
		{ name: "Top", value: perf.top },
		{ name: "Average", value: perf.average },
		{ name: "Below Avg", value: perf.belowAvg },
	];
	const total = pieData.reduce((sum, d) => sum + d.value, 0);
	const pieDataWithTotal = pieData.map((d) => ({ ...d, __total: total }));

	// ResizeObserver for responsive charts
	useEffect(() => {
		if (!containerRef.current) return;

		const handleResize = () => {
			if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
			resizeTimeout.current = setTimeout(() => {
				setWidth(containerRef.current.offsetWidth);
			}, 100);
		};

		const resizeObserver = new ResizeObserver(handleResize);
		resizeObserver.observe(containerRef.current);

		setWidth(containerRef.current.offsetWidth);

		return () => {
			resizeObserver.disconnect();
			if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
		};
	}, []);

	return (
		<div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] gap-4 mt-8 items-stretch min-h-100">
			{/* Left Column – Performance + Pie */}
			<Card className="min-w-0 rounded-sm flex flex-col h-full">
				<CardHeader>
					<CardTitle className="text-base font-semibold">
						Performance
					</CardTitle>

					{/* Dropdown for class selection */}
					<Select
						value={selectedClass}
						onValueChange={(value) => setSelectedClass(value)}
					>
						<SelectTrigger className="mt-2 w-full">
							<SelectValue placeholder="Select Class" />
						</SelectTrigger>
						<SelectContent>
							{classes.map((cls) => (
								<SelectItem key={cls} value={cls}>
									{cls}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{/* Stats */}
					<div className="grid grid-cols-3 gap-2 mt-4">
						<div className="rounded-md border bg-muted/40 p-3 text-center">
							<p className="text-xs text-muted-foreground">
								Top
							</p>
							<p className="text-xl font-semibold text-foreground">
								{perf.top}
							</p>
						</div>
						<div className="rounded-md border bg-muted/40 p-3 text-center">
							<p className="text-xs text-muted-foreground">
								Average
							</p>
							<p className="text-xl font-semibold text-foreground">
								{perf.average}
							</p>
						</div>
						<div className="rounded-md border bg-muted/40 p-3 text-center">
							<p className="text-xs text-muted-foreground">
								Below Avg
							</p>
							<p className="text-xl font-semibold text-foreground">
								{perf.belowAvg}
							</p>
						</div>
					</div>
				</CardHeader>

				<CardContent
					className="flex-1 overflow-hidden min-h-50"
					ref={containerRef}
				>
					{width > 0 && (
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={pieDataWithTotal}
									dataKey="value"
									nameKey="name"
									innerRadius="40%"
									outerRadius="80%"
									paddingAngle={4}
									labelLine={false}
									label={({
										cx,
										cy,
										midAngle,
										innerRadius,
										outerRadius,
										percent,
									}) => {
										const radius =
											innerRadius +
											(outerRadius -
												innerRadius) *
												0.5;
										const x =
											cx +
											radius *
												Math.cos(
													-midAngle *
														(Math.PI /
															180)
												);
										const y =
											cy +
											radius *
												Math.sin(
													-midAngle *
														(Math.PI /
															180)
												);

										return (
											<text
												x={x}
												y={y}
												fill="#1f2937"
												textAnchor="middle"
												dominantBaseline="central"
												fontSize={11}
												fontWeight={600}
											>
												{`${(
													percent * 100
												).toFixed(0)}%`}
											</text>
										);
									}}
								>
									{pieDataWithTotal.map(
										(_, index) => (
											<Cell
												key={index}
												fill={
													PIE_COLORS[
														index
													]
												}
											/>
										)
									)}
								</Pie>
								<ReTooltip
									content={({ active, payload }) => {
										if (
											!active ||
											!payload?.length
										)
											return null;
										const {
											name,
											value,
											payload: data,
										} = payload[0];
										return (
											<div className="rounded-md border bg-background p-2 text-sm shadow-md">
												<p className="font-medium">
													{name}
												</p>
												<p className="text-muted-foreground">
													{value} (
													{Math.round(
														(value /
															data.__total) *
															100
													)}
													%)
												</p>
											</div>
										);
									}}
								/>
							</PieChart>
						</ResponsiveContainer>
					)}
				</CardContent>
			</Card>

			{/* Right Column – Area Chart */}
			<Card className="min-w-0 rounded-sm flex flex-col h-full">
				<CardHeader>
					<CardTitle className="text-base font-semibold">
						Earnings vs Expenses
					</CardTitle>
				</CardHeader>
				<CardContent className="flex-1 overflow-hidden min-h-50">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart
							data={areaData}
							margin={{
								top: 20,
								right: 20,
								left: 0,
								bottom: 0,
							}}
						>
							<defs>
								<linearGradient
									id="earningsGradient"
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="5%"
										stopColor="#3b82f6"
										stopOpacity={0.8}
									/>
									<stop
										offset="95%"
										stopColor="#3b82f6"
										stopOpacity={0}
									/>
								</linearGradient>
								<linearGradient
									id="expensesGradient"
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="5%"
										stopColor="#60a5fa"
										stopOpacity={0.6}
									/>
									<stop
										offset="95%"
										stopColor="#60a5fa"
										stopOpacity={0}
									/>
								</linearGradient>
							</defs>
							<XAxis
								dataKey="month"
								tick={{ fontSize: 11 }}
							/>
							<YAxis tick={{ fontSize: 11 }} />
							<CartesianGrid strokeDasharray="3 3" />
							<Tooltip />
							<Legend verticalAlign="top" height={36} />
							<Area
								type="monotone"
								dataKey="earnings"
								stroke="#3b82f6"
								fill="url(#earningsGradient)"
								isAnimationActive={false}
							/>
							<Area
								type="monotone"
								dataKey="expenses"
								stroke="#60a5fa"
								fill="url(#expensesGradient)"
								isAnimationActive={false}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>
		</div>
	);
}
