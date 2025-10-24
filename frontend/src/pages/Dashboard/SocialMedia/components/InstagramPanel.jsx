// src/pages/Dashboard/SocialMedia/components/InstagramPanel.jsx

import React from 'react';
import { PlusCircle, Trash2, CheckCircle, Users, Image as ImageIcon } from 'lucide-react';
import StatCard from './common/StatCard';

const InstagramPanel = ({ data }) => {
    const account = data[0] || {}; // Handle case where no account is connected

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-800">Instagram Account Management</h2>
                <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-sm hover:opacity-90 transition-opacity">
                    <PlusCircle size={18} />
                    Connect Account
                </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={<Users size={24} className="text-purple-600" />} title="Followers" value={account.followers || 'N/A'} />
                <StatCard icon={<Users size={24} className="text-pink-500" />} title="Following" value={account.following || 'N/A'} />
                <StatCard icon={<ImageIcon size={24} className="text-indigo-500" />} title="Posts" value={account.posts || 'N/A'} />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-5"><h3 className="text-lg font-semibold text-gray-700">Connected Account</h3></div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="px-5 py-3 font-medium text-gray-500">Username</th>
                                <th className="px-5 py-3 font-medium text-gray-500">Status</th>
                                <th className="px-5 py-3 font-medium text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.map(acc => (
                                <tr key={acc.username}>
                                    <td className="px-5 py-4 font-bold text-gray-800">{acc.username}</td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${acc.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
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

export default InstagramPanel;