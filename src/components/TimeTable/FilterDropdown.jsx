import { useState } from "react";

const FilterDropdown = ({ filters, onApply, onReset }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e) => {
    setLocalFilters({
      ...localFilters,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplyClick = () => {
    onApply(localFilters);
  };

  const handleResetClick = () => {
    setLocalFilters({ classId: "", sectionId: "" });
    onReset();
  };

  return (
    <div className="absolute right-12 top-58 w-72 bg-white border rounded-xl shadow-lg z-50">
      {/* Header */}
      <div className="px-4 py-3 border-b">
        <h3 className="font-semibold text-gray-800">Filter</h3>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* Class */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class
          </label>
          <select
            name="classId"
            value={localFilters.classId}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select</option>
            <option value="10">Class 10</option>
            <option value="11">Class 11</option>
            <option value="12">Class 12</option>
          </select>
        </div>

        {/* Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Section
          </label>
          <select
            name="sectionId"
            value={localFilters.sectionId}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 px-4 py-3 border-t">
        <button
          onClick={handleResetClick}
          className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Reset
        </button>
        <button
          onClick={handleApplyClick}
          className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterDropdown;
