"use client";
import { useEffect, useState } from "react";
import { 
  Megaphone, 
  Plus, 
  X, 
  FileText, 
  Calendar,
  AlertCircle,
  MessageSquare
} from "lucide-react";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/announcements/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("vms_token")}` }
      });
      if (res.ok) setAnnouncements(await res.json());
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const createAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/announcements/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("vms_token")}` 
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({ title: '', content: '' });
        fetchAnnouncements();
      } else {
        setError("Failed to publish announcement. Only administrators can publish.");
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
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Community Announcements</h1>
          <p className="mt-1.5 text-sm text-slate-500">Publish notices, maintenance updates, and important announcements for residents.</p>
        </div>
        <div>
          <button 
            onClick={() => setShowModal(true)} 
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transform active:scale-[0.97] hover:scale-[1.02] transition-all duration-300 cursor-pointer"
          >
            <Plus className="h-5 w-5" />
            <span>New Notice</span>
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

            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Publish Announcement</h2>
            <p className="text-sm text-slate-500 mb-6">This message will be visible to all tenants in Sunset Villas.</p>

            {error && (
              <div className="flex items-center gap-3 p-4 mb-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={createAnnouncement} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Title / Subject</label>
                <div className="relative">
                  <Megaphone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="e.g. Elevators Maintenance Schedule" 
                    className="block w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 text-sm transition-all duration-300"
                    required 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Message Content</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                  <textarea 
                    placeholder="Enter detailed notice content here..." 
                    className="block w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 text-sm transition-all duration-300 min-h-[120px]"
                    required 
                    onChange={e => setFormData({...formData, content: e.target.value})} 
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
                  {isLoading ? "Publishing..." : "Publish Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Announcements Feed */}
      <div className="space-y-6">
        {announcements.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center text-slate-400 border border-slate-100 shadow-sm">
            <div className="flex flex-col items-center gap-2">
              <Megaphone className="h-10 w-8 text-slate-300" />
              <span className="font-semibold text-slate-800">No active notices</span>
              <p className="text-xs text-slate-400 max-w-sm">Important announcements or safety notices for Sunset Villas will be displayed here.</p>
            </div>
          </div>
        ) : (
          announcements.map((item: any) => (
            <div key={item.id} className="glass-card rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Megaphone className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">{item.title}</h2>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-blue-600">Sunset Villas</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed pl-13">{item.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
