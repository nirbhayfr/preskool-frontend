import { Clock4 } from "lucide-react";

const TimeTableCard = ({ data }) => {
  return (
    <div
      className="
        p-3
        rounded-xl
        bg-white
        border
        shadow-sm
        hover:shadow-md
        transition
      "
    >
      {/* Time */}
      <p className="text-xs text-gray-500 mb-1">
        <Clock4 className="w-3 inline mr-1" /> {data.StartTime} - {data.EndTime}
      </p>

      {/* Subject */}
      <p className="text-sm font-semibold text-gray-800 mb-2">
        {data.SubjectName || `Subject ID: ${data.SubjectID}`}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
        <span className="bg-gray-100 px-2 py-0.5 rounded">
          Period {data.PeriodNo}
        </span>

        <span className="bg-gray-100 px-2 py-0.5 rounded">
          Room {data.RoomID}
        </span>
      </div>
    </div>
  );
};

export default TimeTableCard;
