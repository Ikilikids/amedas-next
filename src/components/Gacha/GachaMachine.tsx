// src/components/Gacha/GachaMachine.tsx
import React from "react";
import { FaAward } from "react-icons/fa";

interface MachineProps {
  isSpinning: boolean;
  loading: boolean;
  onDrawTen: () => void;
  hasDrawnThisPeriod: boolean;
  nextGachaMessage: string;
}

export const GachaMachine: React.FC<MachineProps> = ({
  isSpinning,
  loading,
  onDrawTen,
  hasDrawnThisPeriod,
  nextGachaMessage,
}) => {
  return (
    <div className="w-full max-w-md bg-gradient-to-b from-purple-900 to-indigo-950 p-6 rounded-3xl border border-purple-500/30 shadow-2xl shadow-purple-950/50 flex flex-col items-center relative overflow-hidden">
      
      {/* Decorative neon lights */}
      <div className="absolute -left-12 -top-12 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Machine Header */}
      <div className="text-center mb-4">
        <span className="text-[11px] font-black tracking-widest text-purple-300 uppercase">
          AMeDAS Capsule Toy Machine
        </span>
        <h2 className="text-xl font-black text-white mt-0.5">アメダス・カプセル</h2>
      </div>

      {/* Glass Dome */}
      <div className={`w-64 h-64 bg-slate-900/80 border-4 border-slate-700 rounded-full relative overflow-hidden flex items-center justify-center shadow-inner ${isSpinning ? "animate-shake" : ""}`}>
        
        {/* Reflective highlight */}
        <div className="absolute top-2 left-6 w-16 h-8 bg-white/10 rounded-full rotate-[-15deg] pointer-events-none" />
        
        {/* Capsules Container */}
        <div className="absolute inset-4 rounded-full overflow-hidden flex flex-wrap items-center justify-center gap-1 p-4 opacity-90">
          {/* UR capsules (pink) */}
          <div className={`w-8 h-8 rounded-full bg-pink-500 border border-pink-400 shadow-md ${isSpinning ? "animate-ping" : ""}`} />
          <div className="w-8 h-8 rounded-full bg-pink-500 border border-pink-400 shadow-md" />
          
          {/* SSR/SR (Gold/Indigo) */}
          <div className="w-8 h-8 rounded-full bg-yellow-400 border border-yellow-300 shadow-md" />
          <div className="w-8 h-8 rounded-full bg-indigo-500 border border-indigo-400 shadow-md" />
          <div className="w-8 h-8 rounded-full bg-indigo-500 border border-indigo-400 shadow-md" />
          
          {/* Common (Cyan, Blue, Green, etc.) */}
          <div className="w-8 h-8 rounded-full bg-blue-500 border border-blue-400 shadow-md" />
          <div className="w-8 h-8 rounded-full bg-emerald-500 border border-emerald-400 shadow-md" />
          <div className="w-8 h-8 rounded-full bg-cyan-500 border border-cyan-400 shadow-md" />
          <div className="w-8 h-8 rounded-full bg-amber-500 border border-amber-400 shadow-md" />
          <div className="w-8 h-8 rounded-full bg-teal-500 border border-teal-400 shadow-md" />
          <div className="w-8 h-8 rounded-full bg-blue-500 border border-blue-400 shadow-md" />
          <div className="w-8 h-8 rounded-full bg-emerald-500 border border-emerald-400 shadow-md" />
          <div className="w-8 h-8 rounded-full bg-purple-500 border border-purple-400 shadow-md" />
        </div>

        {/* Machine label overlay */}
        <span className="absolute bottom-6 bg-slate-800/90 text-purple-300 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-purple-500/20 uppercase tracking-widest shadow">
          {hasDrawnThisPeriod ? "Locked" : "Ready"}
        </span>
      </div>

      {/* Machine Body & Crank */}
      <div className="w-full flex flex-col items-center mt-4 relative z-10">
        {/* Coin slot */}
        <div className="w-16 h-12 bg-slate-800 border-2 border-slate-600 rounded-lg flex items-center justify-center shadow-inner mb-4">
          <div className="w-2 h-8 bg-black rounded" />
        </div>

        {/* Turn Crank (Interactive) */}
        <button
          onClick={onDrawTen}
          disabled={isSpinning || loading || hasDrawnThisPeriod}
          className={`w-24 h-24 bg-gradient-to-b from-slate-600 to-slate-800 border-4 border-slate-500 rounded-full flex items-center justify-center relative cursor-pointer shadow-lg active:scale-95 transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${isSpinning ? "rotate-[720deg] duration-700" : "hover:brightness-110"}`}
        >
          {/* Crank Handle (Visual bar) */}
          <div className="w-16 h-4 bg-slate-400 rounded-full shadow" />
          <div className="absolute text-[9px] font-black text-slate-300 tracking-tighter uppercase top-2">
            Turn
          </div>
        </button>
        
        {/* Coin display */}
        <p className="text-[10px] text-purple-300 mt-2 font-bold uppercase tracking-wider">
          Price: 0 Coins (Free!)
        </p>
      </div>

      {/* Draw buttons */}
      <div className="w-full mt-6">
        <button
          onClick={onDrawTen}
          disabled={isSpinning || loading || hasDrawnThisPeriod}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-500 disabled:border-slate-800 disabled:opacity-60 text-white font-black text-sm shadow-lg active:translate-y-0.5 transition-all flex items-center justify-center gap-2 shimmer-sweep"
        >
          <FaAward />
          10連ガチャを回す
        </button>
      </div>

      {hasDrawnThisPeriod && (
        <div className="w-full mt-4 text-center px-4 py-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/25 text-yellow-300 font-bold text-[11px] leading-relaxed shadow-sm">
          ⚠️ {nextGachaMessage}
        </div>
      )}
      
      <div className="text-[10px] text-slate-400 mt-4 font-bold text-center leading-relaxed">
        ※ 「SR以上」のカードが1枚確定！<br />
        ※ ガチャは午前（0:00〜11:59）と午後（12:00〜23:59）にそれぞれ1回ずつ引けます。
      </div>
    </div>
  );
};
