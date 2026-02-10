import { useState } from "react";
import TimeTable from "../components/TimeTable/TimeTable";
import AddTimeTableModal from "@/components/TimeTable/AddTimeTableModal";

const ClassTimeTable = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl mb-1 font-semibold text-foreground">
            Time Table
          </h1>
          <p className="text-md text-muted-foreground">
            Dashboard &ensp; / &ensp; Academic &ensp; / &ensp; Time Table
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="
            bg-primary
            text-primary-foreground
            font-medium
            px-3 py-1.5
            text-sm
            sm:px-5 sm:py-2.5
            rounded-md
            shadow-sm
            hover:bg-primary/90
            transition
          "
        >
          + Add Time Table
        </button>
      </div>

      {openModal && (
        <AddTimeTableModal onClose={() => setOpenModal(false)} />
      )}

      {/* Timetable */}
      <TimeTable />
    </div>
  );
};

export default ClassTimeTable;
