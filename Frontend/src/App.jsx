import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/features/authSlice";
import HomeRouter from "./routes/HomeRouter";
import AuthRouter from "./routes/AuthRouter";
import { useEffect } from "react";
import CustomLoader from "./components/CustomLoader";
import { Toaster } from "sonner";

export default function App() {
  const dispatch = useDispatch();
  const { status, user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    dispatch(checkAuth());
  }, [token]);
  return (
    <>
      {status === "loading" ? (
        <div className="h-screen bg-background w-full">
          <CustomLoader styles={"h-24 w-24"} />
        </div>
      ) : token ? (
        <HomeRouter />
      ) : (
        <AuthRouter />
      )}
      <Toaster />
    </>
  );
}
