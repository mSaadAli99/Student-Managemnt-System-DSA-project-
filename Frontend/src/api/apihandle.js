const BASE = "http://localhost:5000/api/v1";

const getToken = () => localStorage.getItem("authToken");

async function request(path, options = {}) {
  const headers = options.headers || {};
  if (getToken()) {
    headers["Authorization"] = `Bearer ${getToken()}`;
  }
  headers["Content-Type"] = "application/json";

  const res = await fetch(BASE + path, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Request failed");
  }
  return res.json().catch(() => ({}));
}

export default {
  login: async ({ email, password }) => {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  signup: async (payload) => {
    return request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  checkAuth: async () => {
    return request("/auth/check-auth", { method: "GET" });
  },
  getTeacherClasses: async () => {
    return request("/teacher/classes", { method: "GET" });
  },
  getStudentClasses: async () => {
    return request("/teacher/student/classes", { method: "GET" });
  },
  addNewClasses: async (payload) => {
    return request("/teacher/create-class", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  getLessons: async (classId) => {
    return request(`/teacher/${classId}/get-lessons`, {
      method: "GET",
    });
  },
  addLesson: async (payload) => {
    return request(`/teacher/add-lesson`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  inviteStudents: async (payload) => {
    return request(`/teacher/send-invite`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  getClassStudents: async (payload) => {
    return request(`/teacher/classes/${payload.classId}/students`, {
      method: "POST",
      body: JSON.stringify({ teacherEmail: payload.teacherEmail }),
    });
  },
  respondToInvite: async (payload) => {
    return request(`/student/respond-to-invite`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  getPendingInvites: async () => {
    return request(`/student/pending-invites`, {
      method: "GET",
    });
  },
  markLessonAsCompleted: async (payload) => {
    return request(`/student/lesson-complete`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  getTopStudents: async (id) => {
    return request(`/student/${id}/top-students`, {
      method: "GET",
    });
  },
};
