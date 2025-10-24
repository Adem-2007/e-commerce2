// src/pages/Dashboard/overview/components/RevenueChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';

const RevenueChart = ({ data, title, chartLabel }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-96">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                        dataKey="date" 
                        tickFormatter={(str) => format(new Date(str), 'MMM d')}
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                    />
                    <YAxis 
                        tickFormatter={(val) => `$${val}`}
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                    />
                    <Tooltip 
                        labelFormatter={(label) => format(new Date(label), 'EEEE, MMM d, yyyy')}
                        formatter={(value) => [`$${value.toFixed(2)}`, chartLabel]}
                        contentStyle={{ 
                            background: 'white', 
                            borderRadius: '0.75rem', 
                            border: '1px solid #E5E7EB',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                        }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '25px' }} />
                    <Line type="monotone" dataKey="revenue" stroke="#16A34A" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueChart;