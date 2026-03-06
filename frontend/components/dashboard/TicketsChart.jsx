'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white rounded-xl p-3 shadow-lg border border-gray-100 text-sm">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        <p className="text-brand-600 font-bold">{payload[0].value.toLocaleString()} tickets</p>
      </div>
    );
  }
  return null;
};

export default function TicketsChart({ data = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-gray-900">Tickets Sold</h3>
          <p className="text-sm text-gray-500 mt-0.5">Monthly breakdown</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-gray-900">
            {data.reduce((s, d) => s + (d.tickets || 0), 0).toLocaleString()}
          </p>
          <p className="text-xs text-brand-600 font-medium">Total tickets</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fef2f4' }} />
          <Bar dataKey="tickets" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={i === data.length - 1 ? '#e11d48' : '#fda4b4'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
