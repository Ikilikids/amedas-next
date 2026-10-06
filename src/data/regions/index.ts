import { RegionValue } from "../../setting/region";
import { ClimateArticleData } from "../types";

import { hokkaidoData } from "./1_hokkaido";
import { tohokuData } from "./2_tohoku";
import { kantoData } from "./3_kanto";
import { hokurikuData } from "./4_hokuriku";
import { chubuData } from "./5_chubu";
import { kinkiData } from "./6_kinki";
import { chugokuData } from "./7_chugoku";
import { shikokuData } from "./8_shikoku";
import { kyushuData } from "./9_kyushu";
import { okinawaData } from "./10_okinawa";

export const RegionClimateArticles: Record<RegionValue, ClimateArticleData> = {
  hokkaido: hokkaidoData,
  tohoku: tohokuData,
  kanto: kantoData,
  hokuriku: hokurikuData,
  chubu: chubuData,
  kinki: kinkiData,
  chugoku: chugokuData,
  shikoku: shikokuData,
  kyushu: kyushuData,
  okinawa: okinawaData,
};
