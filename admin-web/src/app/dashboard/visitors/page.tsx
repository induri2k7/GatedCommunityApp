"use client";
import { useEffect, useState } from "react";

export default function Visitors() {
  const [visitors, setVisitors] = useState([]);

  const fetchVisitors = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/visitors", {
        headers: { Authorization: `Bearer ${localStorage.getItem("vms_token")}` }
      });
      if (res.ok) setVisitors(await res.json());
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchVisitors(); }, []);

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Global Visitor Logs</h1>
          <p className="mt-2 text-sm text-gray-700">Daily logs of all visitor entries and exits via generated gate passes.</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button onClick={fetchVisitors} className="block bg-gray-100 border px-3 py-2 text-sm text-gray-700 hover:bg-gray-200">
            Refresh API
          </button>
        </div>
      </div>
      
      <div className="mt-8 shadow ring-1 ring-black ring-opacity-5 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Visitor</th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">QR Code Label</th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Purpose</th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {visitors.map((v: any) => (
              <tr key={v.id}>
                <td className="whitespace-nowrap py-4 px-4 text-sm font-medium text-gray-900">{v.name}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-blue-500 font-mono text-xs">{v.qr_code}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{v.purpose}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(v.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
