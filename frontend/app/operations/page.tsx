'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default function OperationsPage() {
  const router = useRouter();
  const [manifests, setManifests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/manifests`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setManifests(res.data))
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, [router]);

  const getTypeColor = (type: string) => {
    const colors: any = {
      DISPATCH: 'bg-blue-100 text-blue-800',
      RECEIVING: 'bg-green-100 text-green-800',
      FORWARD: 'bg-purple-100 text-purple-800',
      RETURN: 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      OPEN: 'bg-yellow-100 text-yellow-800',
      CLOSED: 'bg-gray-100 text-gray-800',
      IN_TRANSIT: 'bg-blue-100 text-blue-800',
      RECEIVED: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Operations - Dispatch & Manifests</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Dispatch Manifest</h3>
            <p className="text-gray-600 text-sm mb-4">Create manifests for outgoing shipments</p>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4 inline mr-2" />
              New Dispatch
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Receiving</h3>
            <p className="text-gray-600 text-sm mb-4">Manage incoming shipments from agents</p>
            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
              <Plus className="w-4 h-4 inline mr-2" />
              New Receiving
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Forwarding</h3>
            <p className="text-gray-600 text-sm mb-4">Forward to branch locations</p>
            <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
              <Plus className="w-4 h-4 inline mr-2" />
              New Forward
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading manifests...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold">All Manifests</h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manifest #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dispatch Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shipments</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {manifests.map((manifest: any) => (
                  <tr key={manifest.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{manifest.manifestNumber}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(manifest.manifestType)}`}>
                        {manifest.manifestType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{manifest.origin} → {manifest.destination}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(manifest.dispatchDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{manifest.totalShipments}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{manifest.totalWeight} kg</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(manifest.status)}`}>
                        {manifest.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {manifests.length === 0 && (
              <div className="text-center py-12 text-gray-500">No manifests found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
