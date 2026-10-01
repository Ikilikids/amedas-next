import React, { useEffect, useRef, useState } from "react";

export interface Option<T> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps<T extends string | number> {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
  disabled?: boolean;
  className?: string;
  leftIcon?: React.ReactNode;
  activeColor?: string; // Highlight color (e.g., region color)
}

const CustomSelect = <T extends string | number>({
  value,
  onChange,
  options,
  disabled = false,
  className = "",
  leftIcon,
  activeColor = "#3b82f6", // Default blue-500
}: CustomSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: Option<T>) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`relative flex items-center bg-white border border-slate-200 rounded-xl py-1.5 pr-8 text-xs font-black text-slate-700 shadow-sm outline-none transition-all cursor-pointer w-full text-left ${
          leftIcon ? "pl-9" : "px-4"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 scale-90">
            {leftIcon}
          </div>
        )}
        <span className="truncate">{selectedOption?.label || ""}</span>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[8px]">
          {isOpen ? "▲" : "▼"}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-[100] mt-1 w-full max-h-60 overflow-auto bg-white border border-slate-100 rounded-xl shadow-xl py-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={String(opt.value)}
                onClick={() => handleSelect(opt)}
                style={{
                  backgroundColor: isSelected ? `${activeColor}0d` : undefined,
                  color: isSelected ? activeColor : undefined,
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "#f8fafc";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
                className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-black transition-colors text-left ${
                  !isSelected ? "text-slate-600" : ""
                }`}
              >
                {opt.icon && (
                  <span className="shrink-0 scale-90 opacity-80">{opt.icon}</span>
                )}
                <span className="truncate">{opt.label}</span>
              </button>
            );
          })}
          {options.length === 0 && (
            <div className="px-3 py-2 text-[10px] text-slate-400 text-center font-bold">
              選択肢がありません
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
