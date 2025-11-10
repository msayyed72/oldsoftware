'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileCheck, FileText } from 'lucide-react';

export default function CustomsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Customs Clearance</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="bg-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
              <FileCheck className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Customs Manifest</h2>
            <p className="text-gray-600 mb-6">Generate customs manifest reports for shipments requiring clearance</p>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
              Generate Report
            </button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-3">FreeAgent Invoices</h2>
            <p className="text-gray-600 mb-6">Create and manage invoices integrated with FreeAgent for customs</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Create Invoice
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Customs Information</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Duty & Fees</h4>
              <p>Customs duty and handling fees are inclusive for all shipments to India and international destinations.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Clearance Process</h4>
              <p>All customs clearance procedures are handled efficiently with proper documentation and compliance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
