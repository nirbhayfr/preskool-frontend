// const colorMap = {
//   pink: "bg-pink-50",
//   blue: "bg-blue-50",
//   green: "bg-green-50",
//   yellow: "bg-yellow-50",
//   purple: "bg-purple-50",
// };

import { Clock4 } from "lucide-react";

const TimeTableCard = ({ data }) => {
  return (
    <div
      className={`p-4 rounded-xl border-b-cyan-400 ${data?.IsActive ? "bg-gray-200" : "bg-gray-100"}`}
    >
      <div className=" text-gray-600 mb-1 w-full flex items-center gap-1">
        <Clock4 className="w-4" /> <span className="text-md">{data?.StartTime} - {data?.EndTime}</span>
      </div>

      <p className="text-sm font-medium text-gray-800 mb-3">
        Subject : {data?.SubjectID}
      </p>

      <div className="flex items-center gap-2">
        <img
          src={data?.teacherImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(data?.teacherName || 'Teacher')}`}
          alt={data?.teacherName || 'Teacher'}
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="text-sm text-gray-700">
          {data?.teacherName || 'Unknown Teacher'}
        </span>
      </div>
    </div>
  );
};

export default TimeTableCard;
