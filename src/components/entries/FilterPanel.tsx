import { useState } from "react";
import { Combobox } from "@headlessui/react";
import { ChevronDown, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllLocations } from "../../api/locationApi";
import { getUsers } from "../../api/userApi";
import { FilterFields } from "../../types/filter.types";
import type { IFilter, IFilterOption } from "../../types/filter.types";
import { Button } from "../shared/Button";

interface FilterPanelProps {
  onApply: (filters: IFilter[]) => void;
  onClearAll: () => void;
}

const LOCATION_FIELD: IFilterOption = {
  label: "Location",
  value: FilterFields.Location,
};
const AUTHOR_FIELD: IFilterOption = {
  label: "Author",
  value: FilterFields.Author,
};

function FilterDropdown({
  label,
  options,
  activePills,
  onSelect,
  onRemove,
}: {
  label: string;
  options: IFilterOption[];
  activePills: IFilterOption[];
  onSelect: (v: IFilterOption) => void;
  onRemove: (value: number) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered =
    query === ""
      ? options
      : options.filter((o) =>
          o.label.toLowerCase().includes(query.toLowerCase()),
        );

  function handleChange(v: IFilterOption | null) {
    if (!v) return;
    onSelect(v);
    setQuery("");
  }

  return (
    <div>
      <label className="block text-xs font-medium text-gray-300 mb-1.5">
        {label}
      </label>

      <Combobox value={null} onChange={handleChange} nullable>
        <div className="relative mb-3">
          <Combobox.Input
            className="w-full border border-gray-300 bg-gray-800 text-white rounded px-3 py-1.5 pr-7 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-primary"
            displayValue={() => query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Filter by ${label.toLowerCase()}…`}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown className="w-4 h-4 text-gray-500" aria-hidden="true" />
          </Combobox.Button>
          <Combobox.Options className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-300 rounded shadow-lg max-h-48 overflow-auto text-sm">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-gray-500">No options</li>
            ) : (
              filtered.map((o) => (
                <Combobox.Option
                  key={o.value}
                  value={o}
                  className={({ active }) =>
                    `px-3 py-2 cursor-pointer ${active ? "bg-primary-600 text-white" : "text-gray-200"}`
                  }
                >
                  {o.label}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </div>
      </Combobox>

      {activePills.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {activePills.map((pill) => (
            <li
              key={pill.value}
              className="flex items-center gap-1 bg-primary text-white text-xs px-3 py-1 rounded-full"
            >
              <span>{pill.label}</span>
              <button
                type="button"
                onClick={() => onRemove(pill.value)}
                aria-label={`Remove ${pill.label}`}
                className="hover:text-primary-100 leading-none"
              >
                <X className="w-3 h-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function FilterPanel({ onApply, onClearAll }: FilterPanelProps) {
  const [appliedFilters, setAppliedFilters] = useState<IFilter[]>([]);

  const { data: locations = [] } = useQuery({
    queryKey: ["locations"],
    queryFn: getAllLocations,
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const locationOptions: IFilterOption[] = locations.map((l) => ({
    label: l.name,
    value: l.id,
  }));
  const authorOptions: IFilterOption[] = users.map((u) => ({
    label: u.name,
    value: u.id,
  }));

  const activePillsFor = (field: FilterFields) =>
    appliedFilters.filter((f) => f.field.value === field).map((f) => f.value);

  const availableOptions = (field: FilterFields, all: IFilterOption[]) => {
    const active = activePillsFor(field);
    return all.filter((o) => !active.some((a) => a.value === o.value));
  };

  function handleSelect(field: IFilterOption, value: IFilterOption) {
    const updated = [...appliedFilters, { field, value }];
    setAppliedFilters(updated);
    onApply(updated);
  }

  function handleRemove(fieldEnum: FilterFields, optionValue: number) {
    const updated = appliedFilters.filter(
      (f) => !(f.field.value === fieldEnum && f.value.value === optionValue),
    );
    setAppliedFilters(updated);
    onApply(updated);
  }

  function handleClearAll() {
    setAppliedFilters([]);
    onClearAll();
  }

  return (
    <div className="space-y-4">
      <FilterDropdown
        label="Location"
        options={availableOptions(FilterFields.Location, locationOptions)}
        activePills={activePillsFor(FilterFields.Location)}
        onSelect={(v) => handleSelect(LOCATION_FIELD, v)}
        onRemove={(v) => handleRemove(FilterFields.Location, v)}
      />
      <FilterDropdown
        label="Author"
        options={availableOptions(FilterFields.Author, authorOptions)}
        activePills={activePillsFor(FilterFields.Author)}
        onSelect={(v) => handleSelect(AUTHOR_FIELD, v)}
        onRemove={(v) => handleRemove(FilterFields.Author, v)}
      />
      {appliedFilters.length > 0 && (
        <Button variant="secondary-inverse" onClick={handleClearAll}>
          Clear All
        </Button>
      )}
    </div>
  );
}
