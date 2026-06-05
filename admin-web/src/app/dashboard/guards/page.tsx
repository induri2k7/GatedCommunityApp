"use client";
import { useEffect, useState } from "react";
import { 
  Shield, 
  UserPlus, 
  Phone, 
  Lock, 
  X, 
  ShieldCheck, 
  AlertCircle,
  Clock
} from "lucide-react";

export default function Guards() {
  const [guards, setGuards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ first_name: '', mobile: '', role: 'security_guard', password: 'password123', community_id: 1 });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchGuards = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/users/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("vms_token")}` }
      });
      if (res.ok) {
        const allUsers = await res.json();
        // Filter client-side to show only security guards
        const filteredGuards = allUsers.filter((user: any) => user.role === "security_guard");
        setGuards(filteredGuards);
      }
    } catch (e) {
      console.error("Error fetching guards:", e);
    }
  };

  useEffect(() => { fetchGuards(); }, []);

  const addGuard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/users/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("vms_token")}` 
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({ first_name: '', mobile: '', role: 'security_guard', password: 'password123', community_id: 1 });
        fetchGuards();
      } else {
        setError("Failed to create guard. Mobile number might already be registered.");
      }
    } catch {
      setError("Network error. Unable to contact database.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Security Guards</h1>
          <p className="mt-1.5 text-sm text-slate-500">Manage gatekeepers, view active shifts, and authorize security staff.</p>
        </div>
        <div>
          <button 
            onClick={() => setShowModal(true)} 
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transform active:scale-[0.97] hover:scale-[1.02] transition-all duration-300 cursor-pointer"
          >
            <UserPlus className="h-5 w-5" />
            <span>Add Guard</span>
          </button>
        </div>
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md transition-all duration-300">
          <div className="glass-card w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl relative animate-scale-up">
            
            {/* Close button */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Create New Guard</h2>
            <p className="text-sm text-slate-500 mb-6">Assign a new gatekeeper to Sunset Villas community.</p>

            {error && (
              <div className="flex items-center gap-3 p-4 mb-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={addGuard} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Guard Name</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Security Guard Name" 
                    className="block w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 text-sm transition-all duration-300"
                    required 
                    onChange={e => setFormData({...formData, first_name: e.target.value})} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="+971509999999" 
                    className="block w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 text-sm transition-all duration-300"
                    required 
                    onChange={e => setFormData({...formData, mobile: e.target.value})} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={formData.password}
                    className="block w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 text-sm transition-all duration-300"
                    required 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3.5 border border-slate-200 hover:bg-slate-50 rounded-2xl text-slate-700 font-semibold text-sm transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl text-white font-semibold text-sm shadow-md shadow-blue-500/10 transform hover:scale-[1.01] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? "Creating..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Guards Table */}
      <div className="glass-card rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="py-4 px-6 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Guard Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Mobile Number</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status / Community</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {guards.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-10 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <Shield className="h-8 w-8 text-slate-300" />
                    <span>No security guards found. Click Add Guard to register.</span>
                  </div>
                </td>
              </tr>
            ) : (
              guards.map((g: any) => (
                <tr key={g.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="whitespace-nowrap py-5 px-6 text-sm font-semibold text-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <ShieldCheck className="h-4.5 w-4.5" />
                      </div>
                      <span>{g.first_name} {g.last_name || ""}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-500 group-hover:text-slate-900 transition-colors">{g.mobile}</td>
                  <td className="whitespace-nowrap px-6 py-5 text-sm">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      On Shift (Sunset Villas)
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
