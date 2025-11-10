'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Package, FileText, Truck, Users, FileCheck, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ total: 0, inTransit: 0, delivered: 0, pending: 0 });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/shipments/statistics`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setStats(res.data))
    .catch(err => console.error(err));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Logistics System</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user.name} ({user.role})
            </span>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-700">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h2>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-gray-600 text-sm">Total Shipments</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-green-600">{stats.inTransit}</div>
            <div className="text-gray-600 text-sm">In Transit</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-purple-600">{stats.delivered}</div>
            <div className="text-gray-600 text-sm">Delivered</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-orange-600">{stats.pending}</div>
            <div className="text-gray-600 text-sm">Pending</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/booking" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Booking</h3>
            <p className="text-gray-600 text-sm">Create and manage customer bookings</p>
          </Link>

          <Link href="/operations" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Truck className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Operations</h3>
            <p className="text-gray-600 text-sm">Dispatch and manifest management</p>
          </Link>

          <Link href="/customs" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileCheck className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Customs</h3>
            <p className="text-gray-600 text-sm">Customs clearance and invoices</p>
          </Link>

          <Link href="/delivery" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Delivery</h3>
            <p className="text-gray-600 text-sm">Track and manage deliveries</p>
          </Link>

          <Link href="/shipments" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">All Shipments</h3>
            <p className="text-gray-600 text-sm">View all shipment records</p>
          </Link>

          <Link href="/manifests" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Manifests</h3>
            <p className="text-gray-600 text-sm">View all manifest records</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
