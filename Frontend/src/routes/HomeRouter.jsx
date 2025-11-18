import { Routes, Route, Navigate } from "react-router-dom";
import HomeLayout from "../Layouts/HomeLayout";
import Classes from "../pages/Classes";
import ClassDetails from "../pages/ClassDetailPage";
import PendingInvites from "../pages/PendingInvites";
import ClassDetailsStudent from "../pages/ClassDetailsStudent";

export default function HomeRouter() {
  return (
    <Routes>
      <Route element={<HomeLayout />}>
        <Route path="*" element={<Navigate to="/classes" replace />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/student/classes/:id" element={<ClassDetailsStudent />} />
        <Route path="/classes/:id" element={<ClassDetails />} />
        <Route path="/pending-invites" element={<PendingInvites />} />
      </Route>
    </Routes>
  );
}
