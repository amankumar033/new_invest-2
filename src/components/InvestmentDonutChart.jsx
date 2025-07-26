import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#10B981', '#3B82F6']; // green, blue

const InvestmentDonutChart = ({ invested, returns }) => {
  const data = [
    { name: 'Invested Amount', value: invested },
    { name: 'Estimated Returns', value: returns },
  ];

  return (
    <div className="bg-gray-900 text-white rounded-xl p-4 mt-6 shadow-lg">
      <h3 className="text-lg font-semibold text-center mb-2">Investment Breakdown</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
            labelStyle={{ color: 'white' }}
            itemStyle={{ color: 'white' }}
            wrapperStyle={{ color: 'white' }} // Ensures all tooltip text is white
          />
          <Legend wrapperStyle={{ color: 'white' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InvestmentDonutChart;
