import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

interface Segment {
  value: number;
  color: string;
}

interface Props {
  segments: Segment[];
  domain: [number, number];
  leftLabel: string;
  rightLabel: string;
  markerValue?: number;
}

export function WeatherThermometerBar({
  segments,
  domain,
  leftLabel,
  rightLabel,
  markerValue,
}: Props) {
  const dataObj: Record<string, number> = {};
  segments.forEach((s, i) => {
    dataObj[`s${i}`] = s.value;
  });

  return (
    <div>
      <div className="bg-gray-100 rounded h-3 overflow-hidden">
        <ResponsiveContainer width="100%" height={12}>
          <BarChart
            layout="vertical"
            data={[dataObj]}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            barCategoryGap={0}
            barSize={12}
          >
            <XAxis type="number" domain={domain} hide />
            <YAxis type="category" hide />
            {segments.map((seg, i) => (
              <Bar
                key={i}
                dataKey={`s${i}`}
                stackId="bar"
                fill={seg.color}
                isAnimationActive={false}
              />
            ))}
            {markerValue !== undefined && (
              <ReferenceLine x={markerValue} stroke="#1e293b" strokeWidth={2} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-0.5">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}
