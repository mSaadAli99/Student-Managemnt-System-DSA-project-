import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import apihandle from "../api/apihandle";
import { toast } from "sonner";
import { CheckCircle, Clock } from "lucide-react";
import LeaderboardPodium from "../components/LeaderPodium";

export default function ClassDetailsStudent() {
  const { id } = useParams();
  const classId = Number(id);
  const { state } = useLocation();
  const currentClass = state?.cls;

  const user = useSelector((s) => s.auth);

  const [lessons, setLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [leaders, setLeaders] = useState([]);
  const [leaderLoading, setLeaderLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("lessons");

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

  async function handleMarkAsCompleted(lessonId) {
    try {
      await apihandle.markLessonAsCompleted({ lessonId });
      toast.success("Lesson marked as completed!");
      fetchLessons();
    } catch (err) {
      toast.error(err.message);
    }
  }

  useEffect(() => {
    fetchLessons();
    fetchLeaderboard();
  }, [classId]);

  const completedCount = lessons.filter((l) => l.completed).length;
  const totalLessons = lessons.length;
  const progress = totalLessons ? (completedCount / totalLessons) * 100 : 0;

  return (
    <div className="space-y-6 md:p-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          {currentClass?.name ?? "Class"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {currentClass?.description ?? "No description"}
        </p>
        <div className="text-xs text-muted-foreground mt-2">
          📚 {totalLessons} lessons
        </div>
      </div>

      {/* Progress Bar */}
      {totalLessons > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-1">
            Progress: {completedCount}/{totalLessons}
          </p>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden relative">
            <div
              style={{ width: `${progress}%` }}
              className={`
                h-full transition-all duration-700 rounded-full
                ${
                  progress === 100
                    ? "bg-green-600 shimmer-animation"
                    : "bg-blue-600"
                }
              `}
            ></div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard ⭐</TabsTrigger>
        </TabsList>

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

                      <span
                        className={`lesson-status ${
                          l.completed ? "lesson-status--done" : "lesson-status--pending"
                        }`}
                      >
                        {l.completed ? (
                          <>
                            <CheckCircle size={16} />
                            <span>Completed</span>
                          </>
                        ) : (
                          <>
                            <Clock size={16} />
                            <span>Not Completed</span>
                          </>
                        )}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap mb-3">
                      {l.content}
                    </div>

                    {!l.completed && (
                      <Button
                        size="sm"
                        onClick={() => handleMarkAsCompleted(l.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Mark Completed
                      </Button>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </TabsContent>

        {/* Leaderboard */}
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

      {/* CSS shimmer */}
      <style>
        {`
          .shimmer-animation {
            position: relative;
            overflow: hidden;
          }
          .shimmer-animation::after {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            height: 100%;
            width: 100%;
            background: linear-gradient(
              120deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.6) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            animation: shimmer 1.2s infinite;
          }
          @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
          }
        `}
      </style>
    </div>
  );
}
