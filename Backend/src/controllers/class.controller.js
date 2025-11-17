import { execFile } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createClass = async (req, res) => {
  const { teacherEmail, className, classDescription } = req.body;

  if (!teacherEmail || !className || !classDescription)
    return res
      .status(400)
      .json({ message: "email, name and description required" });

  const classExePath = path.join(
    __dirname,
    "..",
    "..",
    "compiled",
    "create_class.exe"
  );
  const child = execFile(classExePath, [], (error, stdout) => {
    if (error) return res.status(500).json({ message: "Internal error" });

    if (stdout.startsWith("SUCCESS:")) {
      const classID = stdout.split(":")[1];
      return res.json({ message: "Class created", classID: Number(classID) });
    } else {
      return res.status(400).json({ message: stdout });
    }
  });

  child.stdin.write(teacherEmail + "\n");
  child.stdin.write(className + "\n");
  child.stdin.write(classDescription + "\n");
  child.stdin.end();
};

export const sendInvite = (req, res) => {
  const { studentEmail, classId } = req.body;
  const teacherEmail = req?.user?.email;

  const cppPath = path.join(
    __dirname,
    "..",
    "..",
    "compiled",
    "send_invite.exe"
  );

  const child = execFile(cppPath, [], (error, stdout) => {
    if (error) return res.status(500).json({ message: "Internal Error" });

    if (stdout.startsWith("SUCCESS"))
      return res.json({ message: "Invite sent successfully" });

    return res.status(400).json({ message: stdout });
  });

  child.stdin.write(classId + "\n");
  child.stdin.write(teacherEmail + "\n");
  child.stdin.write(studentEmail + "\n");
  child.stdin.end();
  child.stdin.on("error", (err) => {
    console.error("Stdin error:", err);
  });
};

export const getInvites = (req, res) => {
  const studentEmail = req.user.email;

  const cppPath = path.join(
    __dirname,
    "..",
    "..",
    "compiled",
    "get_invites.exe"
  );

  const child = execFile(cppPath, [], (error, stdout) => {
    if (error) return res.status(500).json({ message: "Internal Error" });

    if (stdout === "ERROR:STUDENT_NOT_FOUND") {
      return res.status(404).json({ message: "Student not found" });
    }

    if (stdout === "NO_INVITATIONS") {
      return res.json({ invitations: [] });
    }

    // Parse invitations: "CLASS_ID:CLASS_NAME:TEACHER_EMAIL;CLASS_ID:CLASS_NAME:TEACHER_EMAIL"
    const invitations = stdout.split(";").map((inviteStr) => {
      const [classId, className, classDescription, teacherEmail] =
        inviteStr.split(":");
      return {
        classId: parseInt(classId),
        className,
        classDescription,
        teacherEmail,
      };
    });

    return res.json({ invitations });
  });

  child.stdin.write(studentEmail + "\n");
  child.stdin.end();
};

export const respondToInvite = (req, res) => {
  const { classId, action } = req.body; // action: "accept" or "reject"
  const studentEmail = req.user.email;

  if (!classId || !action || (action !== "accept" && action !== "reject")) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const cppPath = path.join(
    __dirname,
    "..",
    "..",
    "compiled",
    "accept_invite.exe"
  );

  const child = execFile(cppPath, [], (error, stdout) => {
    if (error) return res.status(500).json({ message: "Internal Error" });

    if (stdout.startsWith("SUCCESS:")) {
      return res.json({
        message:
          stdout === "SUCCESS:INVITE_ACCEPTED"
            ? "Invite accepted successfully"
            : "Invite rejected successfully",
      });
    }

    // Handle different error cases
    const errorMsg = stdout.replace("ERROR:", "");
    return res.status(400).json({ message: errorMsg });
  });

  child.stdin.write(classId + "\n");
  child.stdin.write(studentEmail + "\n");
  child.stdin.write(action + "\n");
  child.stdin.end();
};

export const addLesson = (req, res) => {
  const { classId, title, content } = req.body;
  const teacherEmail = req.user.email;

  if (!classId || !title || !content) {
    return res
      .status(400)
      .json({ message: "Class ID, title and content required" });
  }

  const cppPath = path.join(
    __dirname,
    "..",
    "..",
    "compiled",
    "add_lesson.exe"
  );

  const child = execFile(cppPath, [], (error, stdout) => {
    if (error) return res.status(500).json({ message: "Internal error" });

    if (stdout.startsWith("SUCCESS:")) {
      const lessonId = stdout.split(":")[1];
      return res.json({ message: "Lesson added", lessonId: Number(lessonId) });
    } else {
      return res.status(400).json({ message: stdout });
    }
  });

  child.stdin.write(teacherEmail + "\n");
  child.stdin.write(classId + "\n");
  child.stdin.write(title + "\n");
  child.stdin.write(content + "\n");
  child.stdin.end();
};

export const getLessons = (req, res) => {
  const { classId } = req.params;
  const userEmail = req.user.email;

  const cppPath = path.join(
    __dirname,
    "..",
    "..",
    "compiled",
    "get_lessons.exe"
  );

  const child = execFile(cppPath, [], (error, stdout) => {
    if (error) return res.status(500).json({ message: "Internal error" });

    if (stdout === "NO_LESSONS") {
      return res.json({ lessons: [] });
    }

    if (stdout.startsWith("ERROR:")) {
      return res.status(400).json({ message: stdout });
    }

    // Parse lessons format:
    // For Teacher: "ID:TITLE:ORDER:CONTENT"
    // For Student: "ID:TITLE:ORDER:CONTENT:STATUS"
    const lessonsData = stdout.split(";").map((lessonStr) => {
      const parts = lessonStr.split(":");

      // Reconstruct content (content may contain colons)
      let content = "";
      if (req.user.role === "TEACHER") {
        // Teacher: parts[0]=id, parts[1]=title, parts[2]=order, parts[3...]=content
        content = parts.slice(3).join(":");
      } else {
        // Student: parts[0]=id, parts[1]=title, parts[2]=order, parts[3...n-1]=content, parts[n]=status
        content = parts.slice(3, parts.length - 1).join(":");
      }

      const lesson = {
        id: parseInt(parts[0]),
        title: parts[1],
        order: parseInt(parts[2]),
        content: content,
      };

      if (req.user.role === "STUDENT") {
        lesson.completed = parts[parts.length - 1] === "completed";
      }

      return lesson;
    });

    return res.json({ lessons: lessonsData });
  });

  child.stdin.write(classId + "\n");
  child.stdin.write(userEmail + "\n");
  child.stdin.end();
};

export const completeLesson = (req, res) => {
  const { lessonId } = req.body;
  const studentEmail = req.user.email;

  if (!lessonId) {
    return res.status(400).json({ message: "Lesson ID required" });
  }

  const cppPath = path.join(
    __dirname,
    "..",
    "..",
    "compiled",
    "complete_lesson.exe"
  );

  const child = execFile(cppPath, [], (error, stdout) => {
    if (error) return res.status(500).json({ message: "Internal error" });

    if (stdout.startsWith("SUCCESS:")) {
      return res.json({ message: "Lesson marked as completed" });
    } else {
      return res.status(400).json({ message: stdout });
    }
  });

  child.stdin.write(lessonId + "\n");
  child.stdin.write(studentEmail + "\n");
  child.stdin.end();
};
