import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getClasses,
  addClass,
  getStudentClasses,
} from "../store/features/classSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Classes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { classes, get_classes_status, add_class_status } = useSelector(
    (state) => state.class
  );
  const { user } = useSelector((state) => state.auth);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    if (user?.role === "TEACHER") {
      dispatch(getClasses());
    } else {
      dispatch(getStudentClasses());
    }
  }, [dispatch]);

  // Handle Add Class
  const handleAddClass = async () => {
    if (!name.trim() || !desc.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const res = await dispatch(
        addClass({
          className: name,
          classDescription: desc,
          teacherEmail: user?.email,
        })
      ).unwrap();

      toast.success("Class created successfully!");
      setOpen(false);
      setName("");
      setDesc("");
      dispatch(getClasses());
    } catch (err) {
      toast.error(err || "Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header + Add Class Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Classes</h1>

        {user?.role === "TEACHER" && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap bg-blue-700 hover:bg-violet-800">
                <Plus className="h-4 w-4" /> Add Class
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Class</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-2">
                <input
                  type="text"
                  placeholder="Class Name"
                  className="bg-primary/5 border rounded-md p-2 focus:outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <textarea
                  placeholder="Class Description"
                  className="bg-primary/5 border rounded-md p-2 min-h-[120px] focus:outline-none"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />

                <Button
                  onClick={handleAddClass}
                  disabled={add_class_status === "loading"}
                  className="w-full bg-blue-700 hover:bg-blue-800"
                >
                  {add_class_status === "loading" ? "Creating..." : "Create"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Loading State */}
      {get_classes_status === "loading" && (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 bg-primary/10">
              <Skeleton className="h-28 w-full rounded-md bg-primary/30" />
              <Skeleton className="h-4 w-3/4 mt-3 bg-primary/30" />
              <Skeleton className="h-4 w-1/2 mt-2 bg-primary/30" />
            </Card>
          ))}
        </div>
      )}

      {/* No Classes */}
      {get_classes_status === "succeeded" && classes.length === 0 && (
        <div className="w-full h-[50vh] flex justify-center items-center">
          <p className="text-muted-foreground text-center text-xl pt-10">
            🚫 No classes {user?.role === "TEACHER" ? "created" : "joined"} yet.
          </p>
        </div>
      )}

      {/* Class Cards */}
      {get_classes_status === "succeeded" && classes.length > 0 && (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
          {classes.map((cls) => (
            <Card
              key={cls.id}
              className="flex h-full flex-col overflow-hidden transition hover:scale-[1.01] hover:shadow-md"
            >
              <div className="h-28 w-full relative">
                <img
                  src="https://gstatic.com/classroom/themes/img_bookclub.jpg"
                  alt="Class banner"
                  className="h-full w-full object-cover"
                />
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="truncate text-xl font-semibold">
                  {cls.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 space-y-1 text-sm text-muted-foreground">
                <p className="text-lg pb-2">{cls.description}</p>
                {user?.role === "TEACHER" && (
                  <p>👥 {cls.studentCount} students</p>
                )}
                <p>📚 {cls.lessonCount || cls.totalLessons} lessons</p>
              </CardContent>

              <CardFooter className="mt-auto pt-2">
                <Button
                  onClick={() => {
                    if (user?.role === "TEACHER") {
                      navigate(`/classes/${cls.id}`, { state: { cls } });
                    } else {
                      navigate(`/student/classes/${cls.id}`, {
                        state: { cls },
                      });
                    }
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Open
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Classes;
