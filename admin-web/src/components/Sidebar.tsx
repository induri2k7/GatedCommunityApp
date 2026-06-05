import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  ShieldCheck, 
  ClipboardList, 
  Megaphone,
  Shield
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Communities", href: "/dashboard/communities", icon: Building2 },
    { name: "Tenants", href: "/dashboard/tenants", icon: Users },
    { name: "Guards", href: "/dashboard/guards", icon: Shield },
    { name: "Visitor Logs", href: "/dashboard/visitors", icon: ClipboardList },
    { name: "Announcements", href: "/dashboard/announcements", icon: Megaphone },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 min-h-screen flex flex-col justify-between">
      <div>
        {/* Header Branding */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">VMS SaaS</span>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 px-4 space-y-1.5">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10" 
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-105 duration-300 ${
                  isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                }`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Developer Info */}
      <div className="p-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col gap-1">
        <div>Client Multi-Tenant Node</div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-400">Secure Cluster Active</span>
        </div>
      </div>
    </aside>
  );
}
