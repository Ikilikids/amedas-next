interface Option<T> {
  value: T;
  label: string;
}

interface CustomSelectProps<T extends string | number> {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
  disabled?: boolean;
  className?: string;
}

const CustomSelect = <T extends string | number>({
  value,
  onChange,
  options,
  disabled = false,
  className = "",
}: CustomSelectProps<T>) => {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => {
          const val = e.target.value;
          const option = options.find((opt) => String(opt.value) === val);
          if (option) {
            onChange(option.value);
          }
        }}
        className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-1.5 pr-8 text-xs font-black text-slate-700 shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all cursor-pointer w-full"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[8px]">
        ▼
      </div>
    </div>
  );
};

export default CustomSelect;
