import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface OpiBarChartProps {
  opiValue: number;
}

const OpiBarChart: React.FC<OpiBarChartProps> = ({ opiValue }) => {
  const data = [{ name: 'OPI', value: opiValue * 100 }];

  return (
    <BarChart width={300} height={100} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  );
};

export default OpiBarChart;