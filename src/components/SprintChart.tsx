import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type SprintChartProps = {
  data: {
    sprint: string;
    net: number | null;
    delivered: number | null;
    techDebt: number | null;
  }[];
};

export const SprintChart = ({ data }: SprintChartProps) => (
  <div style={{ height: 300, marginBottom: '2rem' }}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="sprint" />
        <YAxis domain={[0, 120]} />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
        <Line type="linear" dataKey="net" stroke="#007bff" name="Net Value" connectNulls />
        <Line type="linear" dataKey="techDebt" stroke="#dc3545" name="Tech Debt (%)" connectNulls />
        <Line type="linear" dataKey="delivered" stroke="#28a745" name="Delivered Value" connectNulls />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
