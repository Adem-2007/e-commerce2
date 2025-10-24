// src/pages/Dashboard/SocialMedia/components/GoogleSheetsPanel.jsx

import React from 'react';
import { PlusCircle, Trash2, CheckCircle, Sheet, Database, Clock } from 'lucide-react';
import StatCard from './common/StatCard';

const GoogleSheetsPanel = ({ data }) => {
    const totalRows = data.reduce((sum, sheet) => sum + parseInt(sheet.rows.replace(/,/g, ''), 10), 0).toLocaleString();

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-800">Google Sheets Integration</h2>
                <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 transition-colors">
                    <PlusCircle size={18} />
                    Connect New Sheet
                </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={<Sheet size={24} className="text-green-600" />} title="Connected Sheets" value={data.length} />
                <StatCard icon={<Database size={24} className="text-blue-500" />} title="Total Rows Synced" value={totalRows} />
                <StatCard icon={<Clock size={24} className="text-gray-500" />} title="Last Sync" value={data[0]?.lastSync || 'N/A'} />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-5"><h3 className="text-lg font-semibold text-gray-700">Active Connections</h3></div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="px-5 py-3 font-medium text-gray-500">Sheet Name</th>
                                <th className="px-5 py-3 font-medium text-gray-500">Rows Synced</th>
                                <th className="px-5 py-3 font-medium text-gray-500">Last Sync</th>
                                <th className="px-5 py-3 font-medium text-gray-500">Status</th>
                                <th className="px-5 py-3 font-medium text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.map(sheet => (
                                <tr key={sheet.id}>
                                    <td className="px-5 py-4 font-medium text-gray-800">{sheet.name}</td>
                                    <td className="px-5 py-4 text-gray-600">{sheet.rows}</td>
                                    <td className="px-5 py-4 text-gray-600">{sheet.lastSync}</td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800`}>
                                           <CheckCircle size={12}/> Connected
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-md"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GoogleSheetsPanel;