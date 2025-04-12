"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import InputSelect from "@/components/Common/InputSelect";

type Option = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select categories...",
  className,
}: MultiSelectProps) {
  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleUnselect = (option: string) => {
    onChange(selected.filter((s) => s !== option));
  };

  const availableOptions = options.filter(option => !selected.includes(option.value));

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-1">
        {selected.map((value) => {
          const option = options.find((o) => o.value === value);
          return (
            <Badge key={value} variant="secondary" className="py-1  mb-2 px-2 rounded">
              {option?.label}
              <button
                type="button"
                onClick={() => handleUnselect(value)}
                className="ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          );
        })}
      </div>
      
      {availableOptions.length > 0 && (
        <InputSelect
          name="multi-select"
          label=""
          options={availableOptions}
          onChange={(e) => handleSelect(e.target.value)}
          value=""
          placeholder={placeholder}
        />
      )}
    </div>
  );
}