'use client';

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white rounded-xl p-3 shadow-lg border border-gray-100 text-sm">
        <p className="font-semibold text-gray-700">{payload[0].name}</p>
        <p style={{ color: payload[0].payload.color }} className="font-bold">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function CategoryPieChart({ data = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-bold text-gray-900 mb-1">Events by Category</h3>
      <p className="text-sm text-gray-500 mb-4">Ticket sales distribution</p>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {/* Legend */}
      <div className="grid grid-cols-2 gap-1.5 mt-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: d.color }} />
            <span className="text-xs text-gray-600">{d.name} <span className="font-semibold">{d.value}%</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}
