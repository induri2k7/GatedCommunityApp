import Link from "next/link";

export default function Sidebar() {
  const links = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Communities", href: "/dashboard/communities" },
    { name: "Tenants", href: "/dashboard/tenants" },
    { name: "Guards", href: "/dashboard/guards" },
    { name: "Visitor Logs", href: "/dashboard/visitors" },
    { name: "Announcements", href: "/dashboard/announcements" },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-4 text-center font-bold text-2xl tracking-wider border-b border-gray-700">
        VMS SaaS
      </div>
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {links.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-gray-700 hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}
