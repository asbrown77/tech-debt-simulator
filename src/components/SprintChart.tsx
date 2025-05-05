import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Bar,
} from 'recharts';

import { SprintData } from '../types';
import { normalizeTechDebt } from '../utils/chartData';

export const SprintChart = ({ data }: { data: SprintData[] }) => {
  const maxTechDebt = 50; // Define the maximum tech debt for scaling

  // Add "Sprint 0" with default values
  const chartData = [
    { sprint: '0', net: 0, delivered: 0, techDebt: 0 }, // Sprint 0
    ...data.map((sprint) => ({
      sprint: sprint.sprintNumber.toString(),
      net: sprint.netValue || 0,
      delivered: sprint.accumulatedValueDelivered || 0,
      techDebt: normalizeTechDebt(sprint.techDebt || 0, maxTechDebt), // Normalize tech debt
    })),
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
    <ComposedChart
      data={chartData}
      margin={{ top: 10, right: 10, bottom: 30, left: 10 }} // reduce left margin
    >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
  type="number"
  dataKey="sprint"
  domain={[0, 20]}
  tickCount={20}
  label={{
    value: 'Sprint',
    position: 'insideBottom',
    offset: -10,
    style: { fontSize: '20px', fontWeight: 'bold' },
  }}
        />
        <YAxis width={30} domain={[0, 120]} allowDecimals={false} />
        <Tooltip />
        <Legend
          verticalAlign="top" // Position the legend at the top
          align="center" // Center the legend horizontally
          wrapperStyle={{ paddingBottom: '25px' }} // Add spacing between legend and chart
        />
        <Line type="linear" dataKey="techDebt" stroke="#dc3545" name="Tech Debt" />
        <Line type="linear" dataKey="net" stroke="#007bff" name="Net Output" />
        <Area type="linear" dataKey="delivered" fill="#28a745" stroke="#28a745" name="Value Delivered" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};