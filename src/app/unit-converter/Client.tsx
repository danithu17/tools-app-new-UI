"use client";

import { useState, useMemo } from "react";

type UnitCategory = {
  name: string;
  icon: string;
  units: { name: string; factor: number; offset?: number }[];
};

const CATEGORIES: UnitCategory[] = [
  {
    name: "Length",
    icon: "📏",
    units: [
      { name: "Meter (m)", factor: 1 },
      { name: "Kilometer (km)", factor: 1000 },
      { name: "Centimeter (cm)", factor: 0.01 },
      { name: "Millimeter (mm)", factor: 0.001 },
      { name: "Mile (mi)", factor: 1609.344 },
      { name: "Yard (yd)", factor: 0.9144 },
      { name: "Foot (ft)", factor: 0.3048 },
      { name: "Inch (in)", factor: 0.0254 },
    ],
  },
  {
    name: "Weight",
    icon: "⚖️",
    units: [
      { name: "Kilogram (kg)", factor: 1 },
      { name: "Gram (g)", factor: 0.001 },
      { name: "Milligram (mg)", factor: 0.000001 },
      { name: "Metric Ton (t)", factor: 1000 },
      { name: "Pound (lb)", factor: 0.45359237 },
      { name: "Ounce (oz)", factor: 0.0283495231 },
    ],
  },
  {
    name: "Temperature",
    icon: "🌡️",
    units: [
      { name: "Celsius (°C)", factor: 1, offset: 0 },
      { name: "Fahrenheit (°F)", factor: 0.5555555556, offset: 32 },
      { name: "Kelvin (K)", factor: 1, offset: 273.15 },
    ],
  },
  {
    name: "Digital",
    icon: "💾",
    units: [
      { name: "Byte (B)", factor: 1 },
      { name: "Kilobyte (KB)", factor: 1024 },
      { name: "Megabyte (MB)", factor: 1024 ** 2 },
      { name: "Gigabyte (GB)", factor: 1024 ** 3 },
      { name: "Terabyte (TB)", factor: 1024 ** 4 },
    ],
  },
  {
    name: "Time",
    icon: "⏰",
    units: [
      { name: "Second (s)", factor: 1 },
      { name: "Minute (min)", factor: 60 },
      { name: "Hour (h)", factor: 3600 },
      { name: "Day (d)", factor: 86400 },
      { name: "Week (wk)", factor: 604800 },
      { name: "Year (yr)", factor: 31536000 },
    ],
  },
];

export default function UnitConverterClient() {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0]);
  const [fromUnit, setFromUnit] = useState(activeCat.units[0]);
  const [toUnit, setToUnit] = useState(activeCat.units[1]);
  const [value, setValue] = useState<string>("1");

  const handleCatChange = (cat: UnitCategory) => {
    setActiveCat(cat);
    setFromUnit(cat.units[0]);
    setToUnit(cat.units[1]);
  };

  const convertedValue = useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num)) return "";

    // Base value (e.g. meters, kg, celsius)
    let baseValue = 0;
    if (activeCat.name === "Temperature") {
      baseValue = (num - (fromUnit.offset || 0)) * (fromUnit.name.includes("Fahrenheit") ? 1 : fromUnit.factor);
      if (fromUnit.name.includes("Fahrenheit")) baseValue = (num - 32) * (5/9);
      else if (fromUnit.name.includes("Kelvin")) baseValue = num - 273.15;
      else baseValue = num;

      // Now convert from Celsius to ToUnit
      if (toUnit.name.includes("Fahrenheit")) return (baseValue * 9/5 + 32).toFixed(4);
      if (toUnit.name.includes("Kelvin")) return (baseValue + 273.15).toFixed(4);
      return baseValue.toFixed(4);
    } else {
      baseValue = num * fromUnit.factor;
      const result = baseValue / toUnit.factor;
      return result.toLocaleString(undefined, { maximumFractionDigits: 10 });
    }
  }, [value, fromUnit, toUnit, activeCat]);

  return (
    <div className="flex flex-col h-full gap-8">
      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => handleCatChange(cat)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all shrink-0 ${
              activeCat.name === cat.name
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-lg scale-105"
                : "bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center flex-1">
        {/* From */}
        <div className="flex flex-col gap-4 p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 shadow-sm">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">From</label>
          <select
            value={fromUnit.name}
            onChange={(e) => setFromUnit(activeCat.units.find(u => u.name === e.target.value)!)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl font-bold outline-none focus:border-red-500 shadow-sm"
          >
            {activeCat.units.map(u => <option key={u.name} value={u.name}>{u.name}</option>)}
          </select>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-transparent border-none text-4xl font-black text-slate-900 dark:text-white outline-none placeholder:text-slate-300"
            placeholder="0"
          />
        </div>

        {/* Arrow (Hidden on mobile) */}
        <div className="hidden md:flex justify-center -mx-4 pointer-events-none">
           <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/30">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
           </div>
        </div>

        {/* To */}
        <div className="flex flex-col gap-4 p-6 rounded-[2rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl">
           <label className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">To</label>
           <select
            value={toUnit.name}
            onChange={(e) => setToUnit(activeCat.units.find(u => u.name === e.target.value)!)}
            className="w-full bg-white/10 dark:bg-slate-100 border border-white/20 dark:border-slate-200 p-3 rounded-xl font-bold outline-none focus:border-red-400"
          >
            {activeCat.units.map(u => <option key={u.name} value={u.name} className="bg-slate-900 text-white">{u.name}</option>)}
          </select>
          <div className="text-4xl font-black truncate">
            {convertedValue || "0"}
          </div>
        </div>
      </div>
      
      <p className="text-center text-xs text-slate-400 font-medium">
        Calculations are done locally with high precision IEEE 754 floating-point math.
      </p>
    </div>
  );
}
