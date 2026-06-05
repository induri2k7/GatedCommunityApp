"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [mobile, setMobile] = useState("+971500000001");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: mobile, password: password }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("vms_token", data.access_token);
        router.push("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch {
      setError("Failed to connect to backend");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">VMS SaaS Portal</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Mobile Number</label>
            <input 
              value={mobile} onChange={e => setMobile(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded p-2 text-black" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input 
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded p-2 text-black" 
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white rounded p-2 hover:bg-blue-700">
            Secure Login
          </button>
        </form>
      </div>
    </div>
  );
}
