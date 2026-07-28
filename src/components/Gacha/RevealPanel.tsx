// src/components/Gacha/RevealPanel.tsx
import React from "react";
import { FaCheckCircle, FaChevronRight } from "react-icons/fa";
import {
  StationRaw,
  Rarity,
  CollectionItem,
  RARITY_META,
  getPrefLabel,
  getPrefRegionColor,
  getCategoryIcon,
} from "./gachaUtils";
import { StationCard } from "./StationCard";
import { StationCardMini } from "./StationCardMini";
import { playSynthSound } from "./SoundSynth";

import { RawOverviewData } from "../../types/raw";

interface RevealPanelProps {
  showReveal: boolean;
  setShowReveal: (show: boolean) => void;
  drawnCards: { station: StationRaw; rarity: Rarity; isNew: boolean }[];
  revealIndex: number;
  setRevealIndex: React.Dispatch<React.SetStateAction<number>>;
  collection: Record<string, CollectionItem>;
  animationClass: string;
  setAnimationClass: (cls: string) => void;
  muted: boolean;
  stationsOverview?: Record<string, RawOverviewData>;
}

export const RevealPanel: React.FC<RevealPanelProps> = ({
  showReveal,
  setShowReveal,
  drawnCards,
  revealIndex,
  setRevealIndex,
  collection,
  animationClass,
  setAnimationClass,
  muted,
  stationsOverview,
}) => {
  const [selectedCard, setSelectedCard] = React.useState<{ station: StationRaw; rarity: Rarity; count: number } | null>(null);

  if (!showReveal || drawnCards.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 mb-12 shadow-xl relative overflow-hidden flex flex-col items-center">
      {/* Header info */}
      <div className="w-full flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
        <h3 className="text-lg font-black text-purple-600">
          {drawnCards.length === 1 ? "カプセル開封！" : `10連カプセル開封 (${revealIndex + 1} / 10)`}
        </h3>
        {drawnCards.length > 1 && (
          <button
            onClick={() => setRevealIndex(drawnCards.length - 1)}
            className="text-xs text-purple-600 hover:text-purple-700 font-bold bg-purple-50 border border-purple-200 px-3 py-1 rounded-full transition cursor-pointer"
          >
            すべて開封する
          </button>
        )}
      </div>

      {/* Displaying Single Reveal or Grid of all results */}
      {drawnCards.length === 1 ? (
        <div className={`w-full max-w-sm flex justify-center ${animationClass}`}>
          <StationCard
            station={drawnCards[0].station}
            rarity={drawnCards[0].rarity}
            isNew={drawnCards[0].isNew}
            count={collection[drawnCards[0].station.id]?.count || 1}
            overview={stationsOverview?.[drawnCards[0].station.id]}
          />
        </div>
      ) : revealIndex < drawnCards.length - 1 ? (
        <div className="flex flex-col items-center w-full">
          <div className={`w-full max-w-sm flex justify-center mb-6 ${animationClass}`}>
            <StationCard
              station={drawnCards[revealIndex].station}
              rarity={drawnCards[revealIndex].rarity}
              isNew={drawnCards[revealIndex].isNew}
              count={collection[drawnCards[revealIndex].station.id]?.count || 1}
              overview={stationsOverview?.[drawnCards[revealIndex].station.id]}
            />
          </div>
          
          <button
            onClick={() => {
              playSynthSound("pop", muted);
              setRevealIndex((prev) => prev + 1);
              setAnimationClass("");
              setTimeout(() => setAnimationClass("animate-drop"), 10);
            }}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-black text-sm rounded-full shadow-lg flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <span>次のカプセルをあける</span>
            <FaChevronRight />
          </button>
        </div>
      ) : (
        // End of 10-draw: Grid of all 10 cards drawn
        <div className="w-full flex flex-col items-center">
          <h4 className="text-sm font-black text-green-600 mb-6 flex items-center gap-2">
            <FaCheckCircle />
            <span>ガチャ結果一覧</span>
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full">
            {drawnCards.map((card, idx) => {
              const count = collection[card.station.id]?.count || 1;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedCard({ station: card.station, rarity: card.rarity, count })}
                  className="group flex flex-col rounded-2xl overflow-hidden border border-slate-200 bg-white hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-100 transition-all text-left w-full cursor-pointer focus:outline-none"
                >
                  {/* Mini visual ribbon */}
                  <div className={`h-2 w-full ${RARITY_META[card.rarity].bgClass}`} />
                  
                  <div className="p-4 flex-1 flex flex-col justify-between text-slate-500 w-full">
                    <div>
                      {/* Rarity & Prefecture */}
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase leading-none ${RARITY_META[card.rarity].bgClass}`}>
                          {card.rarity}
                        </span>
                        <span
                          className="text-[10px] font-black pb-0.5 text-slate-500"
                          style={{ borderBottom: `2px solid ${getPrefRegionColor(card.station.pref)}` }}
                        >
                          {getPrefLabel(card.station.pref)}
                        </span>
                      </div>

                      {/* Station Name with Category Icon */}
                      <h4 className="text-sm font-black text-slate-800 group-hover:text-purple-600 transition-colors line-clamp-1 flex items-center gap-1.5">
                        <span className="text-base leading-none">{getCategoryIcon(card.station.category)}</span>
                        <span>{card.station.station_name}</span>
                      </h4>
                      
                      {/* Official Name */}
                      <p className="text-[10px] text-slate-400 font-bold mt-1 line-clamp-1">
                        {card.station.official_name || `${card.station.station_name}アメダス`}
                      </p>
                    </div>

                    {/* Metadata footer */}
                    <div className="mt-4 pt-2 border-t border-slate-100 flex justify-between items-baseline text-[9px] text-slate-400 font-bold">
                      <span>所持数: {count}</span>
                      {card.isNew && (
                        <span className="text-red-500 animate-pulse font-extrabold">NEW!</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowReveal(false)}
            className="mt-8 px-8 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-black text-sm border border-slate-700 rounded-full transition-all cursor-pointer"
          >
            閉じる
          </button>
        </div>
      )}

      {selectedCard && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative animate-drop">
            {/* Close Button */}
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 font-bold flex items-center justify-center shadow-lg cursor-pointer z-10"
            >
              ×
            </button>
            <StationCard
              station={selectedCard.station}
              rarity={selectedCard.rarity}
              isNew={false}
              count={selectedCard.count}
              overview={stationsOverview?.[selectedCard.station.id]}
            />
          </div>
          {/* Click background to close */}
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedCard(null)} />
        </div>
      )}
    </div>
  );
};
