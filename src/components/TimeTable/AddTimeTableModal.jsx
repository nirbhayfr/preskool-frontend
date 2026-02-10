import { useState } from "react";
// import { Input } from "../ui/input";
// import { Select } from "../ui/select";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const AddTimeTableModal = ({ onClose }) => {
  const [activeDay, setActiveDay] = useState("Monday");

 


  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[95%] max-w-6xl rounded-xl shadow-lg max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Add Time Table</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Top Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Class" />
            <Select label="Section" options={["A", "B", "C"]} />
            <Select label="Subject Group" options={["Class I", "Class II"]} />
            <Select label="Period Start Time" />
            <Select label="Duration (min)" options={["30", "45", "60"]} />
          </div>

          {/* Day Tabs */}
          <div className="border rounded-lg">
            <div className="flex gap-6 px-4 pt-4 border-b">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`pb-2 text-sm font-medium ${
                    activeDay === day
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-gray-500"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Day Content */}
            <div className="bg-gray-50 p-4">
              <DayRow />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>
          <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white">
            Add Time Table
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTimeTableModal;



const Input = ({ label }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      className="w-full border rounded-lg px-3 py-2"
      placeholder="Enter"
    />
  </div>
);

const Select = ({ label, options = [] }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select className="w-full border rounded-lg px-3 py-2">
      <option>Select</option>
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const DayRow = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
      <Select label="Subject" />
      <Select label="Teacher" />
      <Select label="Time From" />
      <Select label="Time To" />

      <button className="text-red-500 text-xl mt-6">🗑</button>

      <button className="md:col-span-5 mt-4 w-fit bg-indigo-600 text-white px-4 py-2 rounded-lg">
        + Add New
      </button>
    </div>
  );
};
