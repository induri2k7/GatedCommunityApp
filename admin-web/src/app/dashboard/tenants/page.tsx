"use client";
import { useEffect, useState } from "react";

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ first_name: '', mobile: '', role: 'tenant', password: 'password123', community_id: 1 });

  const fetchTenants = async () => {
    const res = await fetch("http://localhost:8000/api/users/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("vms_token")}` }
    });
    if (res.ok) setTenants(await res.json());
  };

  useEffect(() => { fetchTenants(); }, []);

  const addTenant = async (e: React.FormEvent) => {
    e.preventDefault();
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
      fetchTenants();
    } else {
      alert("Failed to create tenant");
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Platform Users & Tenants</h1>
        </div>
        <div className="mt-4 sm:flex-none">
          <button onClick={() => setShowModal(true)} className="block rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-500">
            Add Tenant
          </button>
        </div>
      </div>
      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl mb-4 font-bold">New Tenant</h2>
            <form onSubmit={addTenant} className="space-y-4 text-black">
              <input placeholder="Name" className="w-full border p-2 rounded" required onChange={e => setFormData({...formData, first_name: e.target.value})} />
              <input placeholder="Mobile (+971XXXX)" className="w-full border p-2 rounded" required onChange={e => setFormData({...formData, mobile: e.target.value})} />
              <input placeholder="Password" type="password" className="w-full border p-2 rounded" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Submit</button>
              <button type="button" onClick={() => setShowModal(false)} className="w-full text-red-600 mt-2">Cancel</button>
            </form>
          </div>
        </div>
      )}

      <div className="mt-8 shadow ring-1 ring-black ring-opacity-5 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Mobile</th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {tenants.map((t: any) => (
              <tr key={t.id}>
                <td className="whitespace-nowrap py-4 px-4 text-sm font-medium text-gray-900">{t.first_name} {t.last_name || ""}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{t.mobile}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 uppercase">{t.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
