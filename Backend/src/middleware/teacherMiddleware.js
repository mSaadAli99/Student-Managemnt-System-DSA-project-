export const teacherMiddleware = (req, res, next) => {
  const user = req?.user;

  if (!user) return res.status(401).json({ message: "No user found" });

  try {
    const { role } = user;
    if (role !== "TEACHER") {
      return res
        .status(401)
        .json({ message: "You are not authorized for this action" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Something went wrong" });
  }
};
