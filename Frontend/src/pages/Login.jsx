import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../Layouts/AuthLayout";
import Input from "../components/input";
import Button from "../components/Button";
import { login } from "../store/features/authSlice";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(login({ email, password })).unwrap();
      // on success, navigate to dashboard (replace with your route)
      navigate("/");
    } catch (err) {
      alert(err.message || "Login failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Login</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="pt-2">
          <Button className="w-full" type="submit">
            Sign in
          </Button>
        </div>
      </form>
      <div className="mt-4 mr-14 flex gap-1 justify-end items-center text-gray-700">
        <p>Don't have an account?</p>
        <Link to="/signup" className="text-sm text-indigo-500 hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
