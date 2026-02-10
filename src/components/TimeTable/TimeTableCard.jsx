import { Clock } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import EditTimeTableModal from "./EditTimeTableModal";
import { useUpdateTeacherTimeTable } from "@/hooks/useTeacherTimeTable";
import { toast } from "sonner";
// import api from "@/api/api";

const SUBJECT_COLORS = {
  Mathematics: {
    card: "bg-[#FDE7EC]",
    icon: "text-gray-500"
  },
  Science: {
    card: "bg-[#E6F2FB]",
    icon: "text-gray-500"
  },
  English: {
    card: "bg-[#ECECFA]",
    icon: "text-gray-500"
  },
  Spanish: {
    card: "bg-[#E6F7F4]",
    icon: "text-gray-500"
  },
  Physics: {
    card: "bg-[#F6EEDF]",
    icon: "text-gray-500"
  }
};

const DEFAULT_COLOR = {
  card: "bg-[#E6F9FF]",
  icon: "text-gray-500"
};

const TimeTableCard = ({ data }) => {
  const start = moment(data.StartTime, "HH:mm").format("hh:mm A");
  const end = moment(data.EndTime, "HH:mm").format("hh:mm A");
  const [openEdit, setOpenEdit] = useState(false);
  const { mutate, isPending } = useUpdateTeacherTimeTable();


  const color = SUBJECT_COLORS[data.Subject] || DEFAULT_COLOR;

    const handleUpdate = async(updatedData) => { 
      // console.log("Updated Data:", updatedData);
      
       mutate(
      {
        TimeTableID: data?.TimeTableID, // important
        ...updatedData,
      },
      {
        onSuccess: () => {
          toast.success("Time table updated successfully");
          setOpenEdit(false);
        },
        onError: () => {
          toast.error("Failed to update");
        },
      }
    );

   
    };

  return (
    <>
    <div className={`
        ${color.card}
        relative
        rounded-md
        p-5
        shadow-sm
        hover:shadow-md
        transition-all
        duration-200
      `}
    >
      {/* Edit Button */}
      <button
       onClick={() => setOpenEdit(true)}
        className="
          absolute
          top-3
          right-3
          text-xs
          px-2
          py-1
          rounded-md
          bg-background
          border
          border-border
          text-muted-foreground
          hover:bg-muted
          transition
          cursor-pointer
        "
      >
        Edit
      </button>

      {/* Time */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Clock size={15} className={color.icon} />
        <span className="font-medium">
          {start} - {end}
        </span>
      </div>

      {/* Subject */}
      <p className="text-[15px] text-black ">
        Subject : {data.SubjectID || "Spanish"}
      </p>
      {/* Teacher Name */}
      <p className="text-[15px] text-black mb-1">
        Teacher : {data.TeacherName || "Mr. John"}
      </p>

      {/* Class & Room */}
      <div className="bg-background rounded-lg px-3 py-1 border border-border ">
        <p className="text-sm text-foreground">
          <span className="font-medium">Class:</span>{" "}{data.ClassID || "10"}-
          {data.SectionID || "-A"}
        </p>

        <p className="text-sm text-foreground">
          <span className="font-medium">Room No:</span>{" "}
          {data.RoomID || "204"}
        </p>
      </div>
    </div>

    <EditTimeTableModal
    open={openEdit}
    onClose={() => setOpenEdit(false)}
    data={data}
    onSave={handleUpdate}
    isLoading={isPending}
/>

    </>
  );
};

export default TimeTableCard;
