import TimeTable from "../components/TimeTable/TimeTable";

const ClassTimeTable = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Time Table
          </h1>
          <p className="text-sm text-gray-500">
            Dashboard / Academic / Time Table
          </p>
        </div>

        <button className="bg-[#506EFE] text-white font-medium px-5 py-2.5 rounded-md shadow hover:bg-[#3e5bf0] transition">
          + Add Time Table
        </button>
      </div>

      {/* Timetable */}
      <TimeTable />
    </div>
  );
};

export default ClassTimeTable;
