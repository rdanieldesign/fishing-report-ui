import type { IUsgsReading } from "../../types/entry.types";
import { groupReadingsByParameter } from "./chartUtils";
import { UsgsParameterChart } from "./UsgsParameterChart";

interface Props {
  readings: IUsgsReading[];
}

export function UsgsReadingsSection({ readings }: Props) {
  const groups = groupReadingsByParameter(readings);

  return (
    <section aria-label="USGS stream readings" className="space-y-4">
      {groups.map((group, i) => (
        <UsgsParameterChart
          key={group.parameterName}
          parameterName={group.parameterName}
          unit={group.unit}
          data={group.data}
          isLast={i === groups.length - 1}
        />
      ))}
    </section>
  );
}
