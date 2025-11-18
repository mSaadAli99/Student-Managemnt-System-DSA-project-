import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSelector } from "react-redux";
import apihandle from "../api/apihandle";
import { toast } from "sonner";
import LeaderboardPodium from "../components/LeaderPodium";

export default function ClassDetails() {
  const { id } = useParams();
  const classId = Number(id);
  const { state } = useLocation();
  const clsData = state?.cls;

  const currentClass = clsData;
  const user = useSelector((s) => s.auth);

  // Lessons state
  const [lessons, setLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);

  // Students state
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  // Leaderboard state
  const [leaders, setLeaders] = useState([]);
  const [leaderLoading, setLeaderLoading] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState("students");

  // Add lesson modal
  const [addOpen, setAddOpen] = useState(false);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  // Invite modal state
  const [inviteOpen, setInviteOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Fetch Lessons
  async function fetchLessons() {
    try {
      setLessonsLoading(true);
      const res = await apihandle.getLessons(classId);
      setLessons(res.lessons || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLessonsLoading(false);
    }
  }

  // Fetch Students
  async function fetchStudents() {
    try {
      setStudentsLoading(true);
      const res = await apihandle.getClassStudents({
        classId,
        teacherEmail: user?.email,
      });
      setStudents(res.students ?? []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setStudentsLoading(false);
    }
  }

  // Fetch Top 3 students (Leaderboard)
  async function fetchLeaderboard() {
    try {
      setLeaderLoading(true);
      const res = await apihandle.getTopStudents(classId);
      setLeaders(res.topStudents ?? []);
    } catch (err) {
      toast.error("Failed to load leaderboard");
    } finally {
      setLeaderLoading(false);
    }
  }

  useEffect(() => {
    fetchLessons();
    fetchStudents();
    fetchLeaderboard();
  }, [classId]);

  const handleInvite = async () => {
    if (!query.includes("@")) return toast.error("Enter valid email");

    try {
      await apihandle.inviteStudents({ classId, studentEmail: query });
      toast.success("Invitation sent!");
      setQuery("");
      setInviteOpen(false);
    } catch (err) {
      toast.error(err.message ?? "Failed to invite");
    }
  };

  const handleAddLesson = async () => {
    if (!lessonTitle.trim()) return toast.error("Enter lesson title");

    try {
      setAddLoading(true);
      await apihandle.addLesson({
        classId,
        title: lessonTitle,
        content: lessonContent,
      });
      toast.success("Lesson added!");
      setLessonTitle("");
      setLessonContent("");
      setAddOpen(false);
      fetchLessons();
    } catch (err) {
      toast.error(err.message ?? "Failed to add lesson");
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="space-y-6 md:p-12">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {currentClass?.name ?? "Class"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {currentClass?.description ?? "No description"}
          </p>
          <div className="text-xs text-muted-foreground mt-2">
            👥 {currentClass?.studentCount ?? students.length} students • 📚{" "}
            {currentClass?.lessonCount ?? lessons.length} lessons
          </div>
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600">+ Add Lesson</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Lesson</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <Input
                placeholder="Lesson title"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
              />
              <Textarea
                placeholder="Lesson content"
                value={lessonContent}
                onChange={(e) => setLessonContent(e.target.value)}
                className="min-h-[120px]"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setAddOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-green-600" onClick={handleAddLesson} disabled={addLoading}>
                  {addLoading ? "Adding..." : "Add Lesson"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard ⭐</TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Class Students</h2>
            <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600">Invite Student</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Invite Student</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3">
                  <Input
                    placeholder="Enter email"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setQuery("");
                        setInviteOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button className="bg-green-600" onClick={handleInvite}>Send</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {studentsLoading ? (
            <p>Loading students...</p>
          ) : students.length === 0 ? (
            <p className="text-muted-foreground">No students yet.</p>
          ) : (
            <div className="grid gap-2">
              {students.map((s) => (
                <Card key={s.id ?? s._id} className="p-3">
                  <CardHeader className="p-0">
                    <CardTitle className="text-sm font-medium">
                      {s.name ?? s.email}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 text-xs text-muted-foreground">
                    {s.email}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Lessons Tab */}
        <TabsContent value="lessons">
          {lessonsLoading ? (
            <p>Loading lessons...</p>
          ) : lessons.length === 0 ? (
            <p className="text-muted-foreground">No lessons yet.</p>
          ) : (
            <Accordion type="single" collapsible className="space-y-2">
              {lessons.map((l) => (
                <AccordionItem key={l.id} value={`lesson-${l.id}`}>
                  <AccordionTrigger className="lesson-row">
                    <div className="lesson-meta">
                      <span className="lesson-title">{l.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {l.content}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard">
          <h2 className="text-lg font-semibold mb-4">Top Performers</h2>

          {leaderLoading ? (
            <p>Loading leaderboard...</p>
          ) : leaders.length === 0 ? (
            <p className="text-muted-foreground">No rankings yet.</p>
          ) : (
            <LeaderboardPodium leaders={leaders} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
