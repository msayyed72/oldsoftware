'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ShipmentsPage() {
  const router = useRouter();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/shipments`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setShipments(res.data))
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, [router]);

  const getStatusColor = (status: string) => {
    const colors: any = {
      CREATED: 'bg-gray-100 text-gray-800',
      PICKED_UP: 'bg-blue-100 text-blue-800',
      IN_TRANSIT: 'bg-purple-100 text-purple-800',
      OUT_FOR_DELIVERY: 'bg-yellow-100 text-yellow-800',
      DELIVERED: 'bg-green-100 text-green-800',
      RETURNED: 'bg-orange-100 text-orange-800',
      CANCELLED: 'bg-red-100 text-red-800',
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
            <h1 className="text-2xl font-bold text-gray-900">All Shipments</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">Loading shipments...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tracking #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receiver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {shipments.map((shipment: any) => (
                    <tr key={shipment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{shipment.trackingNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div>{shipment.senderName}</div>
                        <div className="text-xs text-gray-500">{shipment.senderCity}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div>{shipment.receiverName}</div>
                        <div className="text-xs text-gray-500">{shipment.receiverCity}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {shipment.senderCity}, {shipment.senderState} → {shipment.receiverCity}, {shipment.receiverState}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{shipment.weight} kg</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shipment.status)}`}>
                          {shipment.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {shipments.length === 0 && (
                <div className="text-center py-12 text-gray-500">No shipments found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
