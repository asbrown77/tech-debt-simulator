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

import { IterationData } from '../types';
import { normalizeTechDebt } from '../utils/chartData';

export const IterationChart = ({ data }: { data: IterationData[] }) => {
  const maxTechDebt = 50; // Define the maximum tech debt for scaling

  // Add "Iteration 0" with default values
  const chartData = [
    { iteration: '0', net: 0, delivered: 0, techDebt: 0 }, // Iteration 0
    ...data.map((iteration) => ({
      iteration: iteration.iterationNumber.toString(),
      net: iteration.netValue || 0,
      delivered: iteration.accumulatedValueDelivered || 0,
      techDebt: normalizeTechDebt(iteration.techDebt || 0, maxTechDebt), // Normalize tech debt
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
  dataKey="iteration"
  domain={[0, 20]}
  tickCount={20}
  label={{
    value: 'Iteration',
    position: 'insideBottom',
    offset: -10,
    style: { fontSize: '20px', fontWeight: 'bold' },
  }}
        />
        <YAxis width={30} domain={[0, 105]} allowDecimals={false} />
        <Tooltip />
        <Legend
          verticalAlign="top" // Position the legend at the top
          align="center" // Center the legend horizontally
          wrapperStyle={{ paddingBottom: '25px' }} // Add spacing between legend and chart
        />
        {/* <Line type="linear" dataKey="techDebt" stroke="#dc3545" name="Tech Debt" />
        <Bar dataKey="net" fill="#007bff" name="Iteration Output" />
        <Area type="linear" dataKey="delivered" fill="#28a745" stroke="#28a745" name="Value Delivered" /> */}

        <Line type="linear" dataKey="techDebt" stroke="#dc3545" strokeWidth={2} name="Tech Debt"/>
        /* Soften the Iteration Output bar */
        <Bar dataKey="net" fill="#007bff" name="Iteration Output" barSize={26}/>
        /* Boost emphasis on Value Delivered */
        <Area type="linear" dataKey="delivered" fill="#28a745" stroke="#28a745" strokeWidth={3} name="Value Delivered"/>
      </ComposedChart>
    </ResponsiveContainer>
  );
};