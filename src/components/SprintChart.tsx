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
} from 'recharts';

import { SprintData } from '../types';
import { normalizeTechDebt } from '../utils/chartData';

type SprintChartProps = {
  data: SprintData[];
};

export const SprintChart = ({ data }: { data: SprintData[] }) => {
  const maxTechDebt = 50; // Define the maximum tech debt for scaling

  const chartData = data.map((sprint) => ({
    sprint: sprint.sprintNumber.toString(),
    net: sprint.netValue || 0,
    delivered: sprint.accumulatedValueDelivered || 0,
    techDebt: normalizeTechDebt(sprint.techDebt || 0, maxTechDebt), // Normalize tech debt
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="sprint" />
        <YAxis />
        <Tooltip />
        <Legend />
        {/* Line for Tech Debt */}
        <Line type="monotone" dataKey="techDebt" stroke="#dc3545" name="Tech Debt (%)" />
        {/* Line for Delivered Value */}
        <Line type="monotone" dataKey="delivered" stroke="#28a745" name="Value Delivered" />
        {/* Line for Net Value */}
        <Line type="monotone" dataKey="net" stroke="#007bff" name="Net Value" />
      </LineChart>
    </ResponsiveContainer>
  );
};