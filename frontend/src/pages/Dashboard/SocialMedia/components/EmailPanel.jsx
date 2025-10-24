// src/pages/Dashboard/SocialMedia/components/EmailPanel.jsx

import React from 'react';
import { PlusCircle, Trash2, CheckCircle, Mail, Send, Activity } from 'lucide-react';
import StatCard from './common/StatCard';

const EmailPanel = ({ data }) => {
    const account = data[0] || {};

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-800">Email Service Integration</h2>
                <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
                    <PlusCircle size={18} />
                    Connect Service
                </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={<Mail size={24} className="text-indigo-600" />} title="Connected Accounts" value={data.length} />
                <StatCard icon={<Send size={24} className="text-sky-500" />} title="Total Emails Sent" value={account.emailsSent || 'N/A'} />
                <StatCard icon={<Activity size={24} className="text-amber-500" />} title="Avg. Open Rate" value={account.openRate || 'N/A'} />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-5"><h3 className="text-lg font-semibold text-gray-700">Connected Services</h3></div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="px-5 py-3 font-medium text-gray-500">Email / Provider</th>
                                <th className="px-5 py-3 font-medium text-gray-500">Emails Sent</th>
                                <th className="px-5 py-3 font-medium text-gray-500">Status</th>
                                <th className="px-5 py-3 font-medium text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.map(acc => (
                                <tr key={acc.id}>
                                    <td className="px-5 py-4">
                                        <p className="font-medium text-gray-800">{acc.email}</p>
                                        <p className="text-gray-500">{acc.provider}</p>
                                    </td>
                                    <td className="px-5 py-4 text-gray-600">{acc.emailsSent}</td>
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

export default EmailPanel;