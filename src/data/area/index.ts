import { ClimateArticleData } from "../types";
import { gunmaAreas } from "./42_gunma";
import { saitamaAreas } from "./43_saitama";
import { chibaAreas } from "./45_chiba";
import { tokyoAreas } from "./44_tokyo";
import { kanagawaAreas } from "./46_kanagawa";
import { niigataAreas } from "./54_niigata";
import { toyamaAreas } from "./55_toyama";
import { ishikawaAreas } from "./56_ishikawa";
import { fukuiAreas } from "./57_fukui";
import { yamanashiAreas } from "./49_yamanashi";
import { naganoAreas } from "./48_nagano";
import { gifuAreas } from "./52_gifu";
import { shizuokaAreas } from "./50_shizuoka";
import { aichiAreas } from "./51_aichi";
import { mieAreas } from "./53_mie";
import { shigaAreas } from "./60_shiga";
import { kyotoAreas } from "./61_kyoto";
import { osakaAreas } from "./62_osaka";
import { hyogoAreas } from "./63_hyogo";
import { naraAreas } from "./64_nara";
import { wakayamaAreas } from "./65_wakayama";
import { tottoriAreas } from "./69_tottori";
import { shimaneAreas } from "./68_shimane";
import { okayamaAreas } from "./66_okayama";
import { hiroshimaAreas } from "./67_hiroshima";
import { yamaguchiAreas } from "./81_yamaguchi";
import { tokushimaAreas } from "./71_tokushima";
import { kagawaAreas } from "./72_kagawa";
import { ehimeAreas } from "./73_ehime";
import { kochiAreas } from "./74_kochi";
import { fukuokaAreas } from "./82_fukuoka";
import { sagaAreas } from "./85_saga";
import { nagasakiAreas } from "./84_nagasaki";
import { kumamotoAreas } from "./86_kumamoto";
import { oitaAreas } from "./83_oita";
import { miyazakiAreas } from "./87_miyazaki";
import { kagoshimaAreas } from "./88_kagoshima";
import { okinawa_mainAreas } from "./91_okinawa_main";
import { okinawa_daitoAreas } from "./92_okinawa_daito";
import { okinawa_miyakoAreas } from "./93_okinawa_miyako";
import { okinawa_yaeyamaAreas } from "./94_okinawa_yaeyama";
import { douhokuAreas } from "./11_douhoku";
import { doutouAreas } from "./17_doutou";
import { dououAreas } from "./14_douou";
import { dounanAreas } from "./23_dounan";
import { aomoriAreas } from "./31_aomori";
import { iwateAreas } from "./33_iwate";
import { miyagiAreas } from "./34_miyagi";
import { akitaAreas } from "./32_akita";
import { yamagataAreas } from "./35_yamagata";
import { fukushimaAreas } from "./36_fukushima";
import { ibarakiAreas } from "./40_ibaraki";
import { tochigiAreas } from "./41_tochigi";

export const PREF_AREAS_MAP: Record<string, ClimateArticleData[]> = {
  gunma: gunmaAreas,
  saitama: saitamaAreas,
  chiba: chibaAreas,
  tokyo: tokyoAreas,
  kanagawa: kanagawaAreas,
  niigata: niigataAreas,
  toyama: toyamaAreas,
  ishikawa: ishikawaAreas,
  fukui: fukuiAreas,
  yamanashi: yamanashiAreas,
  nagano: naganoAreas,
  gifu: gifuAreas,
  shizuoka: shizuokaAreas,
  aichi: aichiAreas,
  mie: mieAreas,
  shiga: shigaAreas,
  kyoto: kyotoAreas,
  osaka: osakaAreas,
  hyogo: hyogoAreas,
  nara: naraAreas,
  wakayama: wakayamaAreas,
  tottori: tottoriAreas,
  shimane: shimaneAreas,
  okayama: okayamaAreas,
  hiroshima: hiroshimaAreas,
  yamaguchi: yamaguchiAreas,
  tokushima: tokushimaAreas,
  kagawa: kagawaAreas,
  ehime: ehimeAreas,
  kochi: kochiAreas,
  fukuoka: fukuokaAreas,
  saga: sagaAreas,
  nagasaki: nagasakiAreas,
  kumamoto: kumamotoAreas,
  oita: oitaAreas,
  miyazaki: miyazakiAreas,
  kagoshima: kagoshimaAreas,
  okinawa_main: okinawa_mainAreas,
  okinawa_daito: okinawa_daitoAreas,
  okinawa_miyako: okinawa_miyakoAreas,
  okinawa_yaeyama: okinawa_yaeyamaAreas,
  hokkaido_douhoku: douhokuAreas,
  hokkaido_doutou: doutouAreas,
  hokkaido_douou: dououAreas,
  hokkaido_dounan: dounanAreas,
  aomori: aomoriAreas,
  iwate: iwateAreas,
  miyagi: miyagiAreas,
  akita: akitaAreas,
  yamagata: yamagataAreas,
  fukushima: fukushimaAreas,
  ibaraki: ibarakiAreas,
  tochigi: tochigiAreas,
};

export function getAreasForPref(prefKey: string): ClimateArticleData[] {
  return PREF_AREAS_MAP[prefKey] || [];
}
