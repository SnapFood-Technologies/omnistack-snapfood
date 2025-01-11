import * as React from "react"

const arrowIcon = (
  <svg
    width="26"
    height="26"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.95339 5.67461C3.1331 5.46495 3.44875 5.44067 3.65841 5.62038L7.99968 9.34147L12.341 5.62038C12.5506 5.44067 12.8663 5.46495 13.046 5.67461C13.2257 5.88428 13.2014 6.19993 12.9917 6.37964L8.32508 10.3796C8.13783 10.5401 7.86153 10.5401 7.67429 10.3796L3.00762 6.37964C2.79796 6.19993 2.77368 5.88428 2.95339 5.67461Z"
      fill="currentColor"
    />
  </svg>
)

interface OptionType {
  value: string
  label: string
}

interface InputSelectProps {
  name: string
  label: string
  options: OptionType[]
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  value: string
  required?: boolean
}

export default function InputSelect(props: InputSelectProps) {
  const { name, label, options, onChange, value, required } = props

  return (
    <div>
      {/* Label */}
      <label
        htmlFor={name}
        className="mb-2.5 block font-satoshi text-base font-medium text-dark dark:text-white"
      >
        {label}
      </label>

      <div className="relative">
        {/* Native select with classes matching the Radix Trigger styling */}
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          // Key classes from the Radix snippet:
          className="
            flex h-10 w-full items-center justify-between
            rounded-md border border-input
            bg-background
            px-3 py-2
            text-sm
            ring-offset-background
            placeholder:text-muted-foreground
            focus:outline-none
            focus:ring-2
            focus:ring-ring
            focus:ring-offset-2
            disabled:cursor-not-allowed
            disabled:opacity-50
            appearance-none
            [&>span]:line-clamp-1

            dark:text-white dark:bg-dark dark:focus:border-transparent
          "
        >
          <option value="Select Option" className="dark:bg-dark">
            Select option
          </option>
          {options?.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="dark:bg-dark"
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Arrow icon positioned to the right */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-50">
          {arrowIcon}
        </span>
      </div>
    </div>
  )
}
