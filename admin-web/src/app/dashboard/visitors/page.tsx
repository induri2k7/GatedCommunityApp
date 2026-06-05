"use client";
import { useEffect, useState } from "react";
import { 
  ClipboardList, 
  RotateCw, 
  User, 
  QrCode, 
  FileText, 
  Calendar,
  Search
} from "lucide-react";

export default function Visitors() {
  const [visitors, setVisitors] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchVisitors = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("http://localhost:8000/api/visitors", {
        headers: { Authorization: `Bearer ${localStorage.getItem("vms_token")}` }
      });
      if (res.ok) setVisitors(await res.json());
    } catch(e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500); // Smooth visual feedback
    }
  };

  useEffect(() => { fetchVisitors(); }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Global Visitor Logs</h1>
          <p className="mt-1.5 text-sm text-slate-500">Real-time daily log of all visitor entries, pre-approvals, and pass usage.</p>
        </div>
        <div>
          <button 
            onClick={fetchVisitors} 
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transform active:scale-[0.97] transition-all duration-300 cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`h-4.5 w-4.5 text-slate-500 ${isRefreshing ? "animate-spin text-blue-600" : ""}`} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh Logs"}</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="glass-card rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="py-4 px-6 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Visitor</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">QR Code Pass</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Purpose of Visit</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Pass Generated At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {visitors.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <ClipboardList className="h-10 w-8 text-slate-300" />
                    <span>No visitor logs registered yet.</span>
                    <p className="text-xs text-slate-400">Create a visitor pass from the mobile tenant app to see logs here.</p>
                  </div>
                </td>
              </tr>
            ) : (
              visitors.map((v: any) => (
                <tr key={v.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="whitespace-nowrap py-5 px-6 text-sm font-semibold text-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <User className="h-4 w-4" />
                      </div>
                      <span>{v.name}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-sm font-mono text-slate-500">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200/50 text-[11px] text-slate-700 font-semibold shadow-sm">
                      <QrCode className="h-3.5 w-3.5 text-slate-400" />
                      {v.qr_code}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <span>{v.purpose}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-500 group-hover:text-slate-900 transition-colors">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>{new Date(v.created_at).toLocaleString()}</span>
                    </div>
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
