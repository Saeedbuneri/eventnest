'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white rounded-xl p-3 shadow-lg border border-gray-100 text-sm">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        <p className="text-brand-600 font-bold">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ data = [], title = 'Revenue Overview' }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">Last 6 months</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-gray-900">
            ${data.reduce((s, d) => s + d.revenue, 0).toLocaleString()}
          </p>
          <p className="text-xs text-green-600 font-medium">+24.5% vs last period</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#e11d48" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#e11d48" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false}
            tickFormatter={(v) => `$${v >= 1000 ? `${v / 1000}k` : v}`} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#e11d48"
            strokeWidth={2.5}
            fill="url(#revGradient)"
            dot={{ fill: '#e11d48', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#be123c', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
