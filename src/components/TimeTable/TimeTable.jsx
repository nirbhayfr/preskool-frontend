/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
import { useRef, useEffect, useState } from "react";
import TimeTableCard from "./TimeTableCard";
import { ChevronDown, Funnel } from "lucide-react";
import FilterDropdown from "./FilterDropdown";
import { useTeachers } from "@/hooks/useTeacherTimeTable";


const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];




const TimeTable = () => {
    const [groupedData, setGroupedData] = useState({});
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState({
        classId: "",
        sectionId: "",
    });
    const dayRefs = useRef({});

    const { data: teacher, isLoading, isError } = useTeachers();

    const handleApplyFilter = (newFilters) => {
        setFilters(newFilters);
        setShowFilter(false);

        // 👉 call API again or filter existing data
        // console.log("Applied Filters:", newFilters);
    };

    const handleReset = () => {
        setFilters({ classId: "", sectionId: "" });
    };

    useEffect(() => {
        if (teacher?.data) {
            fetchTimeTable();
        }

    }, [teacher]);

   useEffect(() => {
  if (!teacher?.data) return;

  const today = new Date().toLocaleString("en-US", {
    weekday: "long",
  });

  const el = dayRefs.current[today];

  if (el) {
    setTimeout(() => {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }, 100); // wait for DOM paint
  }
}, [teacher]);


    const fetchTimeTable = async () => {
        const grouped = groupByDay(teacher?.data);
        // console.log('grouped', grouped);
        setGroupedData(grouped);

    };

    const groupByDay = (data) => {
        return data.reduce((acc, item) => {
            const day = item.DayOfWeek;
            if (!acc[day]) acc[day] = [];
            acc[day].push(item);
            return acc;
        }, {});
    };

    // if (loading) return <p>Loading...</p>;


    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Failed to load teacher</p>
    if (!teacher) return null
    return (
  <div className="bg-card rounded-xl shadow-sm p-6">
    {/* Timetable Header */}
    <div className="flex items-center justify-between mb-6 border-b border-border pb-6">
      <h2 className="text-xl font-semibold text-foreground">
        Time Table
      </h2>

      <button
        onClick={() => setShowFilter((prev) => !prev)}
        className="
          flex items-center gap-2
          bg-secondary
          text-secondary-foreground
          px-4 py-2
          rounded-md
          text-sm
          hover:bg-secondary/80
          transition
        "
      >
        <Funnel className="w-4 h-4" />
        Filter
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>

    {showFilter && (
      <FilterDropdown
        filters={filters}
        onApply={handleApplyFilter}
        onReset={handleReset}
      />
    )}

    {/* Grid */}
    <div className="mt-6 overflow-x-auto no-scrollbar">
  <div className="flex gap-6 min-w-max snap-x snap-mandatory">
    {days.map((day) => (
      <div
        key={day}
        ref={(el) => (dayRefs.current[day] = el)}
        className="min-w-70 shrink-0 flex flex-col snap-start"
      >
        <h3 className="text-lg font-semibold text-foreground mb-5">
          {day}
        </h3>

        <div className="space-y-4">
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
