import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PollChartProps {
  results: { [key: string]: number };
}

export const PollChart = ({ results }: PollChartProps) => {
  // Recharts erwartet ein Array von Objekten, daher transformieren wir die Daten.
  const data = Object.keys(results).map((option) => ({
    name: option,
    votes: results[option],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="votes" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};
