"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, AlertCircle, Phone, Lock } from "lucide-react";

export default function Home() {
  const [mobile, setMobile] = useState("+971500000001");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
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
        setError("Invalid credentials. Please check your mobile or password.");
      }
    } catch {
      setError("Unable to connect to the secure API. Ensure backend is active.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-900">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 h-[350px] w-[350px] rounded-full bg-blue-600/20 blur-[90px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-indigo-600/20 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo/Icon Container */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 transform hover:scale-105 transition-transform duration-300">
            <ShieldCheck className="h-9 w-9 text-white" />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white">VMS SaaS Portal</h1>
          <p className="mt-2 text-sm text-slate-400">Visitor Management & Security System</p>
        </div>

        {/* Login Card */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl bg-slate-900/60">
          <h2 className="text-xl font-bold text-white mb-6">Welcome Back</h2>
          
          {error && (
            <div className="flex items-center gap-3 p-4 mb-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  value={mobile} 
                  onChange={e => setMobile(e.target.value)}
                  className="block w-full bg-slate-950/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm transition-all duration-300"
                  placeholder="+971500000001"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="block w-full bg-slate-950/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="relative mt-8 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-4 font-semibold text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 focus:outline-none transform active:scale-[0.98] hover:scale-[1.01] hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-xs text-slate-500">
          Secure multi-tenant isolation active. Powered by VMS Core.
        </div>
      </div>
    </div>
  );
}
