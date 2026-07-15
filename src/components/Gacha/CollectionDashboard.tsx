// src/components/Gacha/CollectionDashboard.tsx
import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FaAward,
  FaSearch,
  FaChevronDown,
  FaLock,
} from "react-icons/fa";
import {
  CollectionItem,
  StationRaw,
  Rarity,
  RARITY_META,
  getPrefLabel,
  getPrefRegionColor,
  getCategoryLabel,
  getCategoryIcon,
} from "./gachaUtils";
import { StationCard } from "./StationCard";

import { RawOverviewData } from "../../types/raw";

interface DashboardProps {
  collection: Record<string, CollectionItem>;
  stations: StationRaw[];
  onReset: () => void;
  stationsOverview?: Record<string, RawOverviewData>;
}

export const CollectionDashboard: React.FC<DashboardProps> = ({
  collection,
  stations,
  onReset,
  stationsOverview,
}) => {
  // Collection UI states
  const [filterRarity, setFilterRarity] = useState<string>("ALL");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"date" | "rarity" | "count" | "id">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedCard, setSelectedCard] = useState<{ station: StationRaw; rarity: Rarity; count: number } | null>(null);

  // Format date helper
  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  // List of collected stations mapped to full data
  const collectedStationsList = useMemo(() => {
    if (stations.length === 0) return [];
    
    return Object.values(collection)
      .map((item) => {
        const original = stations.find((s) => s.id === item.id);
        return {
          ...item,
          station: original,
        };
      })
      .filter((item) => !!item.station) as (CollectionItem & { station: StationRaw })[];
  }, [collection, stations]);

  // Filter and Sort collected list
  const processedCollection = useMemo(() => {
    let result = [...collectedStationsList];

    // 1. Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.station.station_name.toLowerCase().includes(q) ||
          (item.station.official_name && item.station.official_name.toLowerCase().includes(q)) ||
          getPrefLabel(item.station.pref).toLowerCase().includes(q) ||
          (item.station.city && item.station.city.toLowerCase().includes(q)) ||
          item.id.includes(q)
      );
    }

    // 2. Filter by Rarity
    if (filterRarity !== "ALL") {
      result = result.filter((item) => item.rarity === filterRarity);
    }

    // 3. Filter by Category
    if (filterCategory !== "ALL") {
      result = result.filter((item) => {
        if (filterCategory === "special") {
          return item.station.category === "special" || item.station.category === "submeteo";
        }
        return item.station.category === filterCategory;
      });
    }

    // 4. Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "date") {
        comparison = new Date(a.lastDrawnAt).getTime() - new Date(b.lastDrawnAt).getTime();
      } else if (sortBy === "rarity") {
        const rarities: Rarity[] = ["C", "UC", "R", "SR", "SSR", "UR"];
        comparison = rarities.indexOf(a.rarity) - rarities.indexOf(b.rarity);
      } else if (sortBy === "count") {
        comparison = a.count - b.count;
      } else if (sortBy === "id") {
        comparison = a.id.localeCompare(b.id);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [collectedStationsList, searchQuery, filterRarity, filterCategory, sortBy, sortOrder]);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md w-full text-slate-700">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <FaAward className="text-purple-600" />
            <span>マイ・アメダスコレクション</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            獲得したアメダスカードを表示・検索できます。（現在 {processedCollection.length} 地点表示中）
          </p>
        </div>

        {collectedStationsList.length > 0 && (
          <button
            onClick={onReset}
            className="text-xs font-black text-red-500 hover:text-red-600 transition-all border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-50 cursor-pointer"
          >
            リセット
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch mb-6">
        
        {/* Search */}
        <div className="flex-1 min-w-0 bg-slate-50 rounded-xl px-4 py-2 border border-slate-200 focus-within:border-purple-400 transition-all flex items-center gap-2">
          <FaSearch className="text-slate-400 text-sm" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="地点名、市区町村、都道府県、ID..."
            className="bg-transparent border-none outline-none text-sm text-slate-700 w-full placeholder:text-slate-400 font-bold"
          />
        </div>

        {/* Selector filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          {/* Rarity */}
          <div className="relative">
            <select
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value)}
              className="w-full bg-slate-50 text-slate-700 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold appearance-none cursor-pointer focus:border-purple-400 focus:outline-none"
            >
              <option className="bg-white text-slate-700" value="ALL">レア度: すべて</option>
              <option className="bg-white text-slate-700" value="UR">URのみ</option>
              <option className="bg-white text-slate-700" value="SSR">SSRのみ</option>
              <option className="bg-white text-slate-700" value="SR">SRのみ</option>
              <option className="bg-white text-slate-700" value="R">Rのみ</option>
              <option className="bg-white text-slate-700" value="UC">UCのみ</option>
              <option className="bg-white text-slate-700" value="C">Cのみ</option>
            </select>
            <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400 text-[10px]">
              <FaChevronDown />
            </div>
          </div>

          {/* Category */}
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-slate-50 text-slate-700 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold appearance-none cursor-pointer focus:border-purple-400 focus:outline-none"
            >
              <option className="bg-white text-slate-700" value="ALL">カテゴリ: すべて</option>
              <option className="bg-white text-slate-700" value="meteo">気象台</option>
              <option className="bg-white text-slate-700" value="special">特別地域観測所</option>
              <option className="bg-white text-slate-700" value="aviation">航空気象観測所</option>
              <option className="bg-white text-slate-700" value="amedas">アメダス</option>
            </select>
            <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400 text-[10px]">
              <FaChevronDown />
            </div>
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-50 text-slate-700 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold appearance-none cursor-pointer focus:border-purple-400 focus:outline-none"
            >
              <option className="bg-white text-slate-700" value="date">獲得日時</option>
              <option className="bg-white text-slate-700" value="rarity">レア度</option>
              <option className="bg-white text-slate-700" value="count">所持数</option>
              <option className="bg-white text-slate-700" value="id">観測所ID</option>
            </select>
            <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400 text-[10px]">
              <FaChevronDown />
            </div>
          </div>

          {/* Order toggle */}
          <button
            onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
            className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
          >
            <span>{sortOrder === "asc" ? "昇順 ▲" : "降順 ▼"}</span>
          </button>

        </div>

      </div>

      {/* Cards Grid */}
      {collectedStationsList.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-2xl p-16 flex flex-col items-center text-center">
          <FaLock className="text-slate-300 text-4xl mb-4" />
          <p className="text-slate-400 font-bold text-sm">
            コレクションはありません。上のガチャを回してみましょう！
          </p>
        </div>
      ) : processedCollection.length === 0 ? (
        <div className="p-16 text-center text-slate-400 font-bold text-sm">
          条件にマッチするカードが見つかりません。
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {processedCollection.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedCard({ station: item.station, rarity: item.rarity, count: item.count })}
              className="group flex flex-col rounded-2xl overflow-hidden border border-slate-200 bg-white hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-100 transition-all text-left w-full cursor-pointer focus:outline-none"
            >
              {/* Mini visual ribbon */}
              <div className={`h-2 w-full ${RARITY_META[item.rarity].bgClass}`} />
              
              <div className="p-4 flex-1 flex flex-col justify-between text-slate-500 w-full">
                <div>
                  {/* Rarity & Prefecture */}
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase leading-none ${RARITY_META[item.rarity].bgClass}`}>
                      {item.rarity}
                    </span>
                    <span
                      className="text-[10px] font-black pb-0.5 text-slate-500"
                      style={{ borderBottom: `2px solid ${getPrefRegionColor(item.station.pref)}` }}
                    >
                      {getPrefLabel(item.station.pref)}
                    </span>
                  </div>

                  {/* Station Name with Category Icon */}
                  <h4 className="text-sm font-black text-slate-800 group-hover:text-purple-600 transition-colors line-clamp-1 flex items-center gap-1.5">
                    <span className="text-base leading-none">{getCategoryIcon(item.station.category)}</span>
                    <span>{item.station.station_name}</span>
                  </h4>
                  
                  {/* Official Name */}
                  <p className="text-[10px] text-slate-400 font-bold mt-1 line-clamp-1">
                    {item.station.official_name || `${item.station.station_name}アメダス`}
                  </p>
                </div>

                {/* Metadata footer */}
                <div className="mt-4 pt-2 border-t border-slate-100 flex justify-between items-baseline text-[9px] text-slate-400 font-bold">
                  <span>所持数: {item.count}</span>
                  <span>{formatDate(item.lastDrawnAt).split(" ")[0]}</span>
                </div>
              </div>
            </button>
          ))}
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
