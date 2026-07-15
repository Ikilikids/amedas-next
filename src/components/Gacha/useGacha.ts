import { useState, useEffect } from "react";
import { StationRaw, Rarity, CollectionItem, RARITY_META, determineRarity } from "./gachaUtils";
import { playSynthSound } from "./SoundSynth";
import { RawOverviewData } from "../../types/raw";

export function useGacha(
  initialStations: StationRaw[] = [],
  stationsOverview: Record<string, RawOverviewData> = {}
) {
  const [stations, setStations] = useState<StationRaw[]>(initialStations);
  const [loading, setLoading] = useState<boolean>(initialStations.length === 0);
  const [collection, setCollection] = useState<Record<string, CollectionItem>>({});
  
  // Audio state
  const [muted, setMuted] = useState<boolean>(false);

  // Gacha states
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [drawnCards, setDrawnCards] = useState<{ station: StationRaw; rarity: Rarity; isNew: boolean }[]>([]);
  const [showReveal, setShowReveal] = useState<boolean>(false);
  const [revealIndex, setRevealIndex] = useState<number>(0);
  const [animationClass, setAnimationClass] = useState<string>("");
  const [hasDrawnThisPeriod, setHasDrawnThisPeriod] = useState<boolean>(false);
  const [nextGachaMessage, setNextGachaMessage] = useState<string>("");

  // Period check helper
  const getPeriodKey = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const period = date.getHours() < 12 ? "AM" : "PM";
    return `${y}-${m}-${d}-${period}`;
  };

  const updateGachaLimitState = () => {
    const lastDraw = localStorage.getItem("amedas_last_draw_period");
    const now = new Date();
    const currentKey = getPeriodKey(now);
    const hasDrawn = lastDraw === currentKey;
    setHasDrawnThisPeriod(hasDrawn);

    if (hasDrawn) {
      if (now.getHours() < 12) {
        setNextGachaMessage("午前のガチャは引き終わりました。午後の部は 12:00 から引けます。");
      } else {
        setNextGachaMessage("午後のガチャは引き終わりました。次の部は 明日 0:00 から引けます。");
      }
    } else {
      setNextGachaMessage("");
    }
  };

  // Load stations & collection
  useEffect(() => {
    if (stations.length === 0) {
      fetch("/stations.json")
        .then((res) => res.json())
        .then((data: Record<string, StationRaw>) => {
          const list = Object.values(data);
          setStations(list);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load stations:", err);
          setLoading(false);
        });
    }

    const saved = localStorage.getItem("amedas_collection");
    if (saved) {
      try {
        setCollection(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse collection storage:", e);
      }
    }

    // Check limit
    updateGachaLimitState();
  }, [stations.length]);

  // Save collection helper
  const updateCollection = (newItems: { station: StationRaw; rarity: Rarity }[]) => {
    setCollection((prev) => {
      const next = { ...prev };
      const nowStr = new Date().toISOString();

      newItems.forEach(({ station, rarity }) => {
        if (next[station.id]) {
          next[station.id] = {
            ...next[station.id],
            count: next[station.id].count + 1,
            lastDrawnAt: nowStr,
          };
        } else {
          next[station.id] = {
            id: station.id,
            count: 1,
            firstDrawnAt: nowStr,
            lastDrawnAt: nowStr,
            rarity,
          };
        }
      });

      localStorage.setItem("amedas_collection", JSON.stringify(next));
      return next;
    });
  };

  // Draw 10 stations
  const handleDrawTen = () => {
    if (stations.length === 0 || isSpinning || hasDrawnThisPeriod) return;

    setIsSpinning(true);
    setDrawnCards([]);
    setShowReveal(false);
    playSynthSound("coin", muted);

    let timer = 100;
    for (let i = 0; i < 6; i++) {
      setTimeout(() => playSynthSound("clack", muted), timer);
      timer += 100;
    }

    setTimeout(() => {
      const rolled: { station: StationRaw; rarity: Rarity; isNew: boolean }[] = [];
      const collectionUpdates: { station: StationRaw; rarity: Rarity }[] = [];

      for (let i = 0; i < 10; i++) {
        let chosen = stations[Math.floor(Math.random() * stations.length)];
        let finalRarity = determineRarity(chosen, stationsOverview[chosen.id]);

        // Guarantee SR or higher on the 10th card if no SR/SSR/UR was drawn in the first 9 cards
        if (i === 9) {
          const hasSrOrHigher = rolled.some((r) => ["SR", "SSR", "UR"].includes(r.rarity));
          if (!hasSrOrHigher) {
            const srOrHigherCandidates = stations.filter((s) =>
              ["SR", "SSR", "UR"].includes(determineRarity(s, stationsOverview[s.id]))
            );
            if (srOrHigherCandidates.length > 0) {
              chosen = srOrHigherCandidates[Math.floor(Math.random() * srOrHigherCandidates.length)];
              finalRarity = determineRarity(chosen, stationsOverview[chosen.id]);
            }
          }
        }

        const isNew = !collection[chosen.id] && !collectionUpdates.some(u => u.station.id === chosen.id);

        rolled.push({ station: chosen, rarity: finalRarity, isNew });
        collectionUpdates.push({ station: chosen, rarity: finalRarity });
      }

      const hasUR = rolled.some((r) => r.rarity === "UR");
      const hasSSR = rolled.some((r) => r.rarity === "SSR");
      
      playSynthSound("pop", muted);
      setTimeout(() => {
        if (hasUR) playSynthSound("fanfare_epic", muted);
        else if (hasSSR) playSynthSound("fanfare_sr", muted);
        else playSynthSound("fanfare_c", muted);
      }, 300);

      // Save draw period to block further draws
      const currentKey = getPeriodKey(new Date());
      localStorage.setItem("amedas_last_draw_period", currentKey);
      setHasDrawnThisPeriod(true);
      setNextGachaMessage(new Date().getHours() < 12 
        ? "午前のガチャは引き終わりました。午後の部は 12:00 から引けます。"
        : "午後のガチャは引き終わりました。次の部は 明日 0:00 から引けます。"
      );

      setDrawnCards(rolled);
      updateCollection(collectionUpdates);
      
      setIsSpinning(false);
      setShowReveal(true);
      setRevealIndex(0);
      setAnimationClass("animate-drop");
    }, 1000);
  };

  const handleResetCollection = () => {
    if (confirm("これまでにコレクションしたカードをすべてリセットしますか？（この操作は取り消せません）")) {
      localStorage.removeItem("amedas_collection");
      localStorage.removeItem("amedas_last_draw_period");
      setCollection({});
      setHasDrawnThisPeriod(false);
      setNextGachaMessage("");
      alert("コレクションとガチャの回数制限をリセットしました。");
    }
  };

  return {
    stations,
    loading,
    collection,
    muted,
    setMuted,
    isSpinning,
    drawnCards,
    showReveal,
    setShowReveal,
    revealIndex,
    setRevealIndex,
    animationClass,
    setAnimationClass,
    hasDrawnThisPeriod,
    nextGachaMessage,
    handleDrawTen,
    handleResetCollection,
  };
}
