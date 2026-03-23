import { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAllLocations } from '../../api/locationApi';
import { getUsers } from '../../api/userApi';
import { FilterFields } from '../../types/filter.types';
import type { IFilter, IFilterOption } from '../../types/filter.types';

interface FilterPanelProps {
  onApply: (filters: IFilter[]) => void;
  onClearAll: () => void;
}

// Static field options
const FIELD_OPTIONS: IFilterOption[] = [
  { label: 'Location', value: FilterFields.Location },
  { label: 'Author', value: FilterFields.Author },
];

// Shared Combobox dropdown used for both Field and Value selectors;
// handles keyboard navigation, ARIA roles, and open/close state automatically.
function FilterCombobox({
  options,
  selected,
  onSelect,
  placeholder,
  disabled = false,
}: {
  options: IFilterOption[];
  selected: IFilterOption | null;
  onSelect: (v: IFilterOption | null) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState('');

  const filtered =
    query === ''
      ? options
      : options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));

  return (
    // `nullable` allows clearing the selection via keyboard/backspace
    <Combobox value={selected} onChange={onSelect} disabled={disabled} nullable>
      <div className="relative">
        <Combobox.Input
          className="w-full border border-gray-300 rounded px-3 py-1.5 pr-7 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          displayValue={(o: IFilterOption | null) => o?.label ?? ''}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2 disabled:cursor-not-allowed">
          <ChevronDown className="w-4 h-4 text-gray-400" aria-hidden="true" />
        </Combobox.Button>
        <Combobox.Options className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-48 overflow-auto text-sm">
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-gray-400">No options</li>
          ) : (
            filtered.map((o) => (
              <Combobox.Option
                key={o.value}
                value={o}
                className={({ active }) =>
                  `px-3 py-2 cursor-pointer ${active ? 'bg-blue-600 text-white' : 'text-gray-700'}`
                }
              >
                {o.label}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </div>
    </Combobox>
  );
}

export function FilterPanel({ onApply, onClearAll }: FilterPanelProps) {
  const [selectedField, setSelectedField] = useState<IFilterOption | null>(null);
  const [selectedValue, setSelectedValue] = useState<IFilterOption | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<IFilter[]>([]);

  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: getAllLocations,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  // Cascading value options based on selected field.
  const valueOptions: IFilterOption[] =
    selectedField?.value === FilterFields.Location
      ? locations.map((l) => ({ label: l.name, value: l.id }))
      : selectedField?.value === FilterFields.Author
      ? users.map((u) => ({ label: u.name, value: u.id }))
      : [];

  function handleFieldChange(field: IFilterOption | null) {
    setSelectedField(field);
    // Reset value when field changes
    setSelectedValue(null);
  }

  function handleAdd() {
    if (!selectedField || !selectedValue) return;

    // Deduplication: skip if same field+value combination already exists
    const isDuplicate = appliedFilters.some(
      (f) => f.field.value === selectedField.value && f.value.value === selectedValue.value
    );
    if (isDuplicate) return;

    const updated = [...appliedFilters, { field: selectedField, value: selectedValue }];
    setAppliedFilters(updated);
    setSelectedField(null);
    setSelectedValue(null);
  }

  function handleRemove(index: number) {
    setAppliedFilters((prev) => prev.filter((_, i) => i !== index));
  }

  function handleApply() {
    onApply(appliedFilters);
  }

  function handleClearAll() {
    setAppliedFilters([]);
    setSelectedField(null);
    setSelectedValue(null);
    onClearAll();
  }

  return (
    <div className="space-y-3">
      {/* Cascading filter inputs */}
      <div className="flex gap-2 flex-wrap">
        <div className="w-36">
          <FilterCombobox
            options={FIELD_OPTIONS}
            selected={selectedField}
            onSelect={handleFieldChange}
            placeholder="Filter by…"
          />
        </div>
        <div className="w-48">
          <FilterCombobox
            options={valueOptions}
            selected={selectedValue}
            onSelect={setSelectedValue}
            placeholder="Select value…"
            disabled={!selectedField}
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!selectedField || !selectedValue}
          className="px-3 py-1.5 text-sm bg-blue-700 text-white rounded hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>

      {/* Active filter chips — each removable */}
      {appliedFilters.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {appliedFilters.map((f, i) => (
            <li
              key={i}
              className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
            >
              <span>{f.field.label}: {f.value.label}</span>
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="hover:text-red-600 leading-none"
                aria-label={`Remove ${f.field.label}: ${f.value.label} filter`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Apply / Clear All */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleApply}
          className="px-3 py-1.5 text-sm bg-blue-700 text-white rounded hover:bg-blue-800"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={handleClearAll}
          className="px-3 py-1.5 text-sm border border-gray-400 rounded hover:bg-gray-100"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
