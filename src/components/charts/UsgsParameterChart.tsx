import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ChartDataPoint } from "./chartUtils";

interface Props {
  parameterName: string;
  unit: string;
  data: ChartDataPoint[];
  isLast: boolean;
}

const Y_AXIS_WIDTH = 50;

export function UsgsParameterChart({
  parameterName,
  unit,
  data,
  isLast,
}: Props) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-2">
        {parameterName} <span className="font-normal">({unit})</span>
      </p>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart
          data={data}
          syncId="usgs"
          margin={{ top: 4, right: 16, left: 0, bottom: isLast ? 20 : 4 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />
          <XAxis
            dataKey="label"
            tick={isLast ? { fontSize: 11, fill: "#6b7280" } : false}
            tickLine={false}
            axisLine={false}
            height={isLast ? 24 : 4}
          />
          <YAxis
            width={Y_AXIS_WIDTH}
            tick={{ fontSize: 11, fill: "#6b7280" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) =>
              Number.isInteger(v) ? String(v) : v.toFixed(1)
            }
          />
          <Tooltip
            formatter={(value) => [`${value} ${unit}`, parameterName]}
            labelFormatter={(label) => `Time: ${label}`}
            contentStyle={{ fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 3, fill: "#2563eb" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
