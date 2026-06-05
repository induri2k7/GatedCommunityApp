import { Bell, Search, Globe, ChevronDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("vms_token");
    router.push("/");
  };

  return (
    <header className="glass-panel sticky top-0 z-40 border-b border-slate-200/80 bg-white/70 backdrop-blur-md">
      <div className="mx-auto px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center gap-4">
          
          {/* Left search bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Quick search (pass ID, tenant name)..."
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Language toggle */}
            <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer">
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              <span>عربي</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {/* Notification Bell */}
            <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer">
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
              <Bell className="h-5 w-5" />
            </button>

            {/* Divider */}
            <div className="h-5 w-px bg-slate-200" />

            {/* Profile Avatar & Logout */}
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-bold text-white text-sm shadow-md shadow-blue-500/10">
                M
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-sm font-semibold text-slate-900 leading-none">Manager Account</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Community Admin</div>
              </div>
              
              <button 
                onClick={handleLogout}
                title="Log Out"
                className="p-2 ml-1 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
