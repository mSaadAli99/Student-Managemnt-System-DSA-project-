import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apihandle from "../api/apihandle";
import AuthLayout from "../Layouts/AuthLayout";
import Input from "../components/input";
import Button from "../components/Button";

export default function TeacherSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [identifier, setIdentifer] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await apihandle.signup({
        role: "TEACHER",
        name,
        email,
        phone,
        identifier,
        password,
      });
      alert("Account created. Please login.");
      navigate("/");
    } catch (err) {
      alert(err.message || "Signup failed");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Teacher Signup</h2>
      <form onSubmit={submit} className="space-y-4">
        <Input
          label="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Employee ID"
          value={identifier}
          onChange={(e) => setIdentifer(e.target.value)}
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
            Create account
          </Button>
        </div>
      </form>
    </div>
  );
}
