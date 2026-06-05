import { 
  Building2, 
  Users, 
  Shield, 
  UserCheck, 
  TrendingUp, 
  Clock, 
  ArrowUpRight 
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    { name: "Total Communities", stat: "2", icon: Building2, color: "from-blue-600 to-indigo-600", shadow: "shadow-blue-500/10" },
    { name: "Total Tenants", stat: "1", icon: Users, color: "from-emerald-600 to-teal-600", shadow: "shadow-emerald-500/10" },
    { name: "Active Guards", stat: "1", icon: Shield, color: "from-amber-600 to-orange-600", shadow: "shadow-amber-500/10" },
    { name: "Today's Visitors", stat: "0", icon: UserCheck, color: "from-violet-600 to-fuchsia-600", shadow: "shadow-violet-500/10" },
  ];

  const activities = [
    { id: 1, user: "Ali Husain", action: "pre-approved a visitor", target: "John Doe", time: "10 mins ago", type: "tenant" },
    { id: 2, user: "Security Guard", action: "approved entry for", target: "Delivery Courier", time: "45 mins ago", type: "guard" },
    { id: 3, user: "Community Admin", action: "added a new tenant", target: "Fatima Ahmad", time: "2 hours ago", type: "admin" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard Overview</h1>
          <p className="mt-1.5 text-sm text-slate-500">Real-time status of your gated community ecosystem.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3.5 py-2 rounded-full self-start">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Live updates active
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="glass-card hover:scale-[1.02] hover:shadow-lg transition-all duration-300 p-6 rounded-3xl cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${item.color} ${item.shadow} text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-slate-400 group-hover:text-blue-600 transition-colors">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
              <div className="mt-5">
                <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {item.name}
                </dt>
                <dd className="mt-1.5 text-3xl font-bold tracking-tight text-slate-900">
                  {item.stat}
                </dd>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Activity & Overview */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Activity List */}
        <div className="glass-card p-6 rounded-3xl lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Recent Security Activity</h2>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">View logs</button>
          </div>
          <div className="flow-root">
            <ul role="list" className="space-y-6">
              {activities.map((act) => (
                <li key={act.id} className="relative flex items-start gap-4 group">
                  {/* Icon indicator */}
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${
                    act.type === "tenant" ? "bg-blue-50 text-blue-600" :
                    act.type === "guard" ? "bg-emerald-50 text-emerald-600" : "bg-purple-50 text-purple-600"
                  }`}>
                    <Clock className="h-4.5 w-4.5" />
                  </div>
                  
                  {/* Activity Details */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">{act.user}</span>
                      {" "}{act.action}{" "}
                      <span className="font-semibold text-slate-900">{act.target}</span>.
                    </p>
                    <span className="text-xs text-slate-400 mt-1 block">{act.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* System Health / Status */}
        <div className="glass-card p-6 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Cluster Diagnostics</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <div>
                <div className="text-sm font-semibold text-slate-800">Database Engine</div>
                <div className="text-xs text-slate-400 mt-0.5">SQLite Active Fallback</div>
              </div>
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <div>
                <div className="text-sm font-semibold text-slate-800">Gatekeeper Core API</div>
                <div className="text-xs text-slate-400 mt-0.5">Uvicorn FastAPI</div>
              </div>
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <div>
                <div className="text-sm font-semibold text-slate-800">Admin Web Dashboard</div>
                <div className="text-xs text-slate-400 mt-0.5">Next.js Turbopack</div>
              </div>
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
