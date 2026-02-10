/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import moment from "moment";

const EditTimeTableModal = ({ open, onClose, data, onSave, isLoading }) => {
    const start = moment(data.StartTime, "HH:mm").format("hh:mm A");
    const end = moment(data.EndTime, "HH:mm").format("hh:mm A");
    const [form, setForm] = useState({
        subjectId: "",
        startTime: "",
        endTime: "",
        classId: "",
        roomId: "",
        sectionId: "",
    });

    useEffect(() => {
        if (data) {
            setForm({
                subjectId: data.SubjectID || "",
                startTime: start || "",
                endTime: end || "",
                classId: data.ClassID || "",
                roomId: data.RoomID || "",
                sectionId: data.SectionID || "",
            });
        }
    }, [data]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onSave(form);
        onClose();
    };


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Time Table</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div>
                        <Label>Subject</Label>
                        <Input
                            name="subjectId"
                            value={form.subjectId}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label>Start Time</Label>
                        <Input
                            type="time"
                            name="startTime"
                            value={form.startTime}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label>End Time</Label>
                        <Input
                            type="time"
                            name="endTime"
                            value={form.endTime}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label>Class</Label>
                        <Input
                            name="classId"
                            value={form.classId}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label>Section</Label>
                        <Input
                            name="sectionId"
                            value={form.sectionId}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label>Room No</Label>
                        <Input
                            name="roomId"
                            value={form.roomId}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-3">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditTimeTableModal;
