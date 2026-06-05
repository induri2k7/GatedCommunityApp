export default function Dashboard() {
  const stats = [
    { name: "Total Communities", stat: "12" },
    { name: "Total Tenants", stat: "1,245" },
    { name: "Active Guards", stat: "48" },
    { name: "Today's Visitors", stat: "342" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <dt className="truncate text-sm font-medium text-gray-500">
              {item.name}
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {item.stat}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="flow-root">
          <ul role="list" className="-mb-8">
            <li className="relative pb-8">
              <div className="relative flex space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 ring-8 ring-white">
                  <span className="text-white text-xs">OK</span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">
                      Visitor <span className="font-medium text-gray-900">John Doe</span> entered Tower A.
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time dateTime="2024-09-20">10 mins ago</time>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
