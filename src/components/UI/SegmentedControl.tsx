import React from "react";

interface Option<T> {
  key: T;
  label: string;
  disabled?: boolean;
}

interface SegmentedControlProps<T extends string | number> {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
  className?: string;
  children?: React.ReactNode;
}

const SegmentedControl = <T extends string | number>({
  value,
  onChange,
  options,
  className = "",
  children,
}: SegmentedControlProps<T>) => {
  return (
    <div
      className={`flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner ${className}`}
    >
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => !opt.disabled && onChange(opt.key)}
          disabled={opt.disabled}
          className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-tighter transition-all duration-200 ${
            opt.disabled
              ? "opacity-30 cursor-not-allowed"
              : value === opt.key
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {opt.label}
        </button>
      ))}
      {children}
    </div>
  );
};

export default SegmentedControl;
