'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';

export default function DeliveryPage() {
  const router = useRouter();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredShipments = shipments.filter((s: any) =>
    s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.receiverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Delivery Tracking</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by tracking number or receiver name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading shipments...</div>
        ) : (
          <div className="space-y-4">
            {filteredShipments.map((shipment: any) => (
              <div key={shipment.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{shipment.trackingNumber}</h3>
                    <p className="text-sm text-gray-600">HAWB: {shipment.hawbNumber || 'N/A'}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(shipment.status)}`}>
                    {shipment.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Sender</h4>
                    <p className="text-sm text-gray-600">{shipment.senderName}</p>
                    <p className="text-sm text-gray-500">{shipment.senderCity}, {shipment.senderState}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Receiver</h4>
                    <p className="text-sm text-gray-600">{shipment.receiverName}</p>
                    <p className="text-sm text-gray-500">{shipment.receiverCity}, {shipment.receiverState}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <div className="text-sm">
                    <span className="text-gray-600">Weight: </span>
                    <span className="font-medium">{shipment.weight} kg</span>
                    <span className="mx-2">•</span>
                    <span className="text-gray-600">Value: </span>
                    <span className="font-medium">${shipment.declaredValue}</span>
                  </div>
                  {shipment.currentLocation && (
                    <div className="text-sm text-gray-600">
                      📍 {shipment.currentLocation}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {filteredShipments.length === 0 && (
              <div className="text-center py-12 text-gray-500">No shipments found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
