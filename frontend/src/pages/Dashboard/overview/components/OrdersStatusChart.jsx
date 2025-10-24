// src/pages/Dashboard/overview/components/OrdersStatusChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const OrdersStatusChart = ({ data, title, chartLabel }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-96">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 45 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={10} 
                        interval={0}
                        tick={{ fontSize: 11, fill: '#6B7280' }}
                    />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <Tooltip 
                        cursor={{ fill: 'rgba(229, 231, 235, 0.5)' }} 
                        contentStyle={{ 
                            background: 'white', 
                            borderRadius: '0.75rem', 
                            border: '1px solid #E5E7EB',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                        }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '40px' }}/>
                    <Bar dataKey="count" name={chartLabel} fill="#3B82F6" barSize={30} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default OrdersStatusChart;