import { PrefValue } from "../../setting/pref";
import { ClimateArticleData } from "../types";

import {
  hokkaidoDououData,
  hokkaidoDounanData,
  hokkaidoDoutouData,
  hokkaidoDouhokuData,
} from "./1_hokkaido";
import {
  aomoriData,
  akitaData,
  iwateData,
  miyagiData,
  yamagataData,
  fukushimaData,
} from "./2_tohoku";
import {
  tokyoData,
  kanagawaData,
  saitamaData,
  chibaData,
  ibarakiData,
  tochigiData,
  gunmaData,
} from "./3_kanto";
import {
  niigataData,
  toyamaData,
  ishikawaData,
  fukuiData,
} from "./4_hokuriku";
import {
  naganoData,
  yamanashiData,
  shizuokaData,
  aichiData,
  gifuData,
  mieData,
} from "./5_chubu";
import {
  shigaData,
  kyotoData,
  osakaData,
  hyogoData,
  naraData,
  wakayamaData,
} from "./6_kinki";
import {
  okayamaData,
  hiroshimaData,
  shimaneData,
  tottoriData,
  yamaguchiData,
} from "./7_chugoku";
import {
  tokushimaData,
  kagawaData,
  ehimeData,
  kochiData,
} from "./8_shikoku";
import {
  fukuokaData,
  oitaData,
  nagasakiData,
  sagaData,
  kumamotoData,
  miyazakiData,
  kagoshimaData,
} from "./9_kyushu";
import {
  okinawaMainData,
  okinawaDaitoData,
  okinawaMiyakoData,
  okinawaYaeyamaData,
} from "./10_okinawa";

export const PrefClimateArticles: Record<PrefValue, ClimateArticleData> = {
  hokkaido_douou: hokkaidoDououData,
  hokkaido_dounan: hokkaidoDounanData,
  hokkaido_doutou: hokkaidoDoutouData,
  hokkaido_douhoku: hokkaidoDouhokuData,

  aomori: aomoriData,
  akita: akitaData,
  iwate: iwateData,
  miyagi: miyagiData,
  yamagata: yamagataData,
  fukushima: fukushimaData,

  ibaraki: ibarakiData,
  tochigi: tochigiData,
  gunma: gunmaData,
  saitama: saitamaData,
  tokyo: tokyoData,
  chiba: chibaData,
  kanagawa: kanagawaData,

  nagano: naganoData,
  yamanashi: yamanashiData,
  shizuoka: shizuokaData,
  aichi: aichiData,
  gifu: gifuData,
  mie: mieData,

  niigata: niigataData,
  toyama: toyamaData,
  ishikawa: ishikawaData,
  fukui: fukuiData,

  shiga: shigaData,
  kyoto: kyotoData,
  osaka: osakaData,
  hyogo: hyogoData,
  nara: naraData,
  wakayama: wakayamaData,

  okayama: okayamaData,
  hiroshima: hiroshimaData,
  shimane: shimaneData,
  tottori: tottoriData,
  yamaguchi: yamaguchiData,

  tokushima: tokushimaData,
  kagawa: kagawaData,
  ehime: ehimeData,
  kochi: kochiData,

  fukuoka: fukuokaData,
  oita: oitaData,
  nagasaki: nagasakiData,
  saga: sagaData,
  kumamoto: kumamotoData,
  miyazaki: miyazakiData,
  kagoshima: kagoshimaData,

  okinawa_main: okinawaMainData,
  okinawa_daito: okinawaDaitoData,
  okinawa_miyako: okinawaMiyakoData,
  okinawa_yaeyama: okinawaYaeyamaData,
};
