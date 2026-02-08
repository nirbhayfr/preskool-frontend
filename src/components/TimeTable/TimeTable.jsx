/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import TimeTableCard from "./TimeTableCard";
import { ChevronDown, Funnel } from "lucide-react";
import FilterDropdown from "./FilterDropdown";
// import { getTimeTable } from "../services/timetableApi";

const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const data = [
    {
        "TimeTableID": 1,
        "TeacherID": 101,
        "DayOfWeek": "Monday",
        "PeriodNo": 1,
        "StartTime": "09:00",
        "EndTime": "09:45",
        "ClassID": 10,
        "SectionID": "A",
        "SubjectID": 201,
        "RoomID": 301,
        "IsActive": true,
        "CreatedAt": "2026-02-01T08:30:00Z",
        "UpdatedAt": "2026-02-01T08:30:00Z"
    },
    
    {
        "TimeTableID": 2,
        "TeacherID": 102,
        "DayOfWeek": "Monday",
        "PeriodNo": 2,
        "StartTime": "09:45",
        "EndTime": "10:30",
        "ClassID": 10,
        "SectionID": "A",
        "SubjectID": 202,
        "RoomID": 302,
        "IsActive": true,
        "CreatedAt": "2026-02-01T08:30:00Z",
        "UpdatedAt": "2026-02-01T08:30:00Z"
    },
    {
        "TimeTableID": 3,
        "TeacherID": 103,
        "DayOfWeek": "Monday",
        "PeriodNo": 3,
        "StartTime": "10:45",
        "EndTime": "11:30",
        "ClassID": 10,
        "SectionID": "A",
        "SubjectID": 203,
        "RoomID": 303,
        "IsActive": true,
        "CreatedAt": "2026-02-01T08:30:00Z",
        "UpdatedAt": "2026-02-01T08:30:00Z"
    },
    {
        "TimeTableID": 4,
        "TeacherID": 104,
        "DayOfWeek": "Tuesday",
        "PeriodNo": 1,
        "StartTime": "09:00",
        "EndTime": "09:45",
        "ClassID": 10,
        "SectionID": "A",
        "SubjectID": 204,
        "RoomID": 301,
        "IsActive": true,
        "CreatedAt": "2026-02-01T08:30:00Z",
        "UpdatedAt": "2026-02-01T08:30:00Z"
    },
    {
        "TimeTableID": 5,
        "TeacherID": 105,
        "DayOfWeek": "Tuesday",
        "PeriodNo": 2,
        "StartTime": "09:45",
        "EndTime": "10:30",
        "ClassID": 10,
        "SectionID": "A",
        "SubjectID": 205,
        "RoomID": 302,
        "IsActive": true,
        "CreatedAt": "2026-02-01T08:30:00Z",
        "UpdatedAt": "2026-02-01T08:30:00Z"
    },
    {
        "TimeTableID": 6,
        "TeacherID": 106,
        "DayOfWeek": "Wednesday",
        "PeriodNo": 1,
        "StartTime": "09:00",
        "EndTime": "09:45",
        "ClassID": 10,
        "SectionID": "A",
        "SubjectID": 206,
        "RoomID": 304,
        "IsActive": true,
        "CreatedAt": "2026-02-01T08:30:00Z",
        "UpdatedAt": "2026-02-01T08:30:00Z"
    },
    {
        "TimeTableID": 7,
        "TeacherID": 107,
        "DayOfWeek": "Wednesday",
        "PeriodNo": 2,
        "StartTime": "09:45",
        "EndTime": "10:30",
        "ClassID": 10,
        "SectionID": "A",
        "SubjectID": 207,
        "RoomID": 305,
        "IsActive": true,
        "CreatedAt": "2026-02-01T08:30:00Z",
        "UpdatedAt": "2026-02-01T08:30:00Z"
    },
    {
        "TimeTableID": 8,
        "TeacherID": 108,
        "DayOfWeek": "Thursday",
        "PeriodNo": 1,
        "StartTime": "09:00",
        "EndTime": "09:45",
        "ClassID": 10,
        "SectionID": "A",
        "SubjectID": 208,
        "RoomID": 306,
        "IsActive": true,
        "CreatedAt": "2026-02-01T08:30:00Z",
        "UpdatedAt": "2026-02-01T08:30:00Z"
    },
    {
        "TimeTableID": 9,
        "TeacherID": 109,
        "DayOfWeek": "Friday",
        "PeriodNo": 1,
        "StartTime": "09:00",
        "EndTime": "09:45",
        "ClassID": 10,
        "SectionID": "A",
        "SubjectID": 209,
        "RoomID": 307,
        "IsActive": true,
        "CreatedAt": "2026-02-01T08:30:00Z",
        "UpdatedAt": "2026-02-01T08:30:00Z"
    },
    {
        "TimeTableID": 10,
        "TeacherID": 110,
        "DayOfWeek": "Saturday",
        "PeriodNo": 1,
        "StartTime": "09:00",
        "EndTime": "09:45",
        "ClassID": 10,
        "SectionID": "A",
        "SubjectID": 210,
        "RoomID": 308,
        "IsActive": true,
        "CreatedAt": "2026-02-01T08:30:00Z",
        "UpdatedAt": "2026-02-01T08:30:00Z"
    },
    {
        "TimeTableID": 11,
        "TeacherID": 111,
        "DayOfWeek": "Saturday",
        "PeriodNo": 2,
        "StartTime": "09:45",
        "EndTime": "10:30",
        "ClassID": 10,
        "SectionID": "A",
        "SubjectID": 210,
        "RoomID": 308,
        "IsActive": true,
        "CreatedAt": "2026-02-01T08:30:00Z",
        "UpdatedAt": "2026-02-01T08:30:00Z"
    },
    {
        "TimeTableID": 12,
        "TeacherID": 112,
        "DayOfWeek": "Monday",
        "PeriodNo": 5,
        "StartTime": "09:00",
        "EndTime": "09:45",
        "ClassID": 10,
        "SectionID": "A",
        "SubjectID": 201,
        "RoomID": 301,
        "IsActive": true,
        "CreatedAt": "2026-02-01T08:30:00Z",
        "UpdatedAt": "2026-02-01T08:30:00Z"
    }
]


const TimeTable = () => {
    const [groupedData, setGroupedData] = useState({});
    const [loading, setLoading] = useState(true);
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState({
        classId: "",
        sectionId: "",
    });

    const handleApplyFilter = (newFilters) => {
        setFilters(newFilters);
        setShowFilter(false);

        // 👉 call API again or filter existing data
        console.log("Applied Filters:", newFilters);
    };

    const handleReset = () => {
        setFilters({ classId: "", sectionId: "" });
    };
    useEffect(() => {
        fetchTimeTable();
    }, []);

    const fetchTimeTable = async () => {
        // const flatData = await getTimeTable(); // array from backend
        const grouped = groupByDay(data);
        setGroupedData(grouped);
        setLoading(false);
    };

    const groupByDay = (data) => {
        return data.reduce((acc, item) => {
            const day = item.DayOfWeek;
            if (!acc[day]) acc[day] = [];
            acc[day].push(item);
            return acc;
        }, {});
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="bg-white rounded-lg shadow p-6">
            {/* Timetable Header */}
            <div className="flex items-center justify-between mb-4 border-b pb-6">
                <h2 className="text-xl font-bold text-gray-800">
                    Time Table
                </h2>
                <button onClick={() => setShowFilter((prev) => !prev)} className="flex items-center gap-2 border px-4 py-2 rounded-sm text-md bg-white text-gray-800">
                    <Funnel className="w-4" />Filter <ChevronDown className="w-4" />
                </button>
                {/* Filter Dropdown */}

            </div>
            {showFilter && (
                <FilterDropdown
                    filters={filters}
                    onApply={handleApplyFilter}
                    onReset={handleReset}
                />
            )}


            {/* Grid */}
            <div className="overflow-x-auto no-scrollbar">
  <div
    className="
      flex
      gap-4
      snap-x snap-mandatory
      lg:grid lg:grid-cols-6
      lg:gap-4
    "
  >
    {days.map((day) => (
      <div
        key={day}
        className="
          snap-start
          min-w-full
          sm:min-w-[50%]
          md:min-w-[33.33%]
          lg:min-w-0
          bg-gray-50
          rounded-xl
          p-3
        "
      >
        {/* Day header */}
        <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">
          {day}
        </h3>

        {/* Cards */}
        <div className="space-y-3">
          {groupedData[day]?.map((item) => (
            <TimeTableCard
              key={item.TimeTableID}
              data={item}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
</div>
            
        </div>
    );
};

export default TimeTable;
