import { AreaValue } from "../../setting/area";
import { ClimateArticleData } from "../types";

import { area_100010, area_100020 } from "./42_gunma";
import { area_110010, area_110020, area_110030 } from "./43_saitama";
import { area_120010, area_120020, area_120030 } from "./45_chiba";
import { area_130010, area_130020, area_130030, area_130040 } from "./44_tokyo";
import { area_140010, area_140020 } from "./46_kanagawa";
import { area_150010, area_150020, area_150030, area_150040 } from "./54_niigata";
import { area_160010, area_160020 } from "./55_toyama";
import { area_170010, area_170020 } from "./56_ishikawa";
import { area_180010, area_180020 } from "./57_fukui";
import { area_190010, area_190020 } from "./49_yamanashi";
import { area_200010, area_200020, area_200030 } from "./48_nagano";
import { area_210010, area_210020 } from "./52_gifu";
import { area_220010, area_220020, area_220030, area_220040 } from "./50_shizuoka";
import { area_230010, area_230020 } from "./51_aichi";
import { area_240010, area_240020 } from "./53_mie";
import { area_250010, area_250020 } from "./60_shiga";
import { area_260010, area_260020 } from "./61_kyoto";
import { area_270000 } from "./62_osaka";
import { area_280010, area_280020 } from "./63_hyogo";
import { area_290010, area_290020 } from "./64_nara";
import { area_300010, area_300020 } from "./65_wakayama";
import { area_310010, area_310020 } from "./69_tottori";
import { area_320010, area_320020, area_320030 } from "./68_shimane";
import { area_330010, area_330020 } from "./66_okayama";
import { area_340010, area_340020 } from "./67_hiroshima";
import { area_350010, area_350020, area_350030, area_350040 } from "./81_yamaguchi";
import { area_360010, area_360020 } from "./71_tokushima";
import { area_370000 } from "./72_kagawa";
import { area_380010, area_380020, area_380030 } from "./73_ehime";
import { area_390010, area_390020, area_390030 } from "./74_kochi";
import { area_400010, area_400020, area_400030, area_400040 } from "./82_fukuoka";
import { area_410010, area_410020 } from "./85_saga";
import { area_420010, area_420020, area_420030, area_420040 } from "./84_nagasaki";
import { area_430010, area_430020, area_430030, area_430040 } from "./86_kumamoto";
import { area_440010, area_440020, area_440030, area_440040 } from "./83_oita";
import { area_450010, area_450020, area_450030, area_450040 } from "./87_miyazaki";
import { area_460010, area_460020, area_460030, area_460040 } from "./88_kagoshima";
import { area_471010, area_471020, area_471030 } from "./91_okinawa_main";
import { area_472000 } from "./92_okinawa_daito";
import { area_473000 } from "./93_okinawa_miyako";
import { area_474010, area_474020 } from "./94_okinawa_yaeyama";
import { area_011000, area_012010, area_012020 } from "./11_douhoku";
import { area_013010, area_013020, area_013030, area_014010, area_014020, area_014030 } from "./17_doutou";
import { area_015010, area_015020, area_016010, area_016020, area_016030 } from "./14_douou";
import { area_017010, area_017020 } from "./23_dounan";
import { area_020010, area_020020, area_020030 } from "./31_aomori";
import { area_030010, area_030020, area_030030 } from "./33_iwate";
import { area_040010, area_040020 } from "./34_miyagi";
import { area_050010, area_050020 } from "./32_akita";
import { area_060010, area_060020, area_060030, area_060040 } from "./35_yamagata";
import { area_070010, area_070020, area_070030 } from "./36_fukushima";
import { area_080010, area_080020 } from "./40_ibaraki";
import { area_090010, area_090020 } from "./41_tochigi";

export const AreaClimateArticles: Record<AreaValue, ClimateArticleData> = {
  "100010": area_100010,
  "100020": area_100020,
  "110010": area_110010,
  "110020": area_110020,
  "110030": area_110030,
  "120010": area_120010,
  "120020": area_120020,
  "120030": area_120030,
  "130010": area_130010,
  "130020": area_130020,
  "130030": area_130030,
  "130040": area_130040,
  "140010": area_140010,
  "140020": area_140020,
  "150010": area_150010,
  "150020": area_150020,
  "150030": area_150030,
  "150040": area_150040,
  "160010": area_160010,
  "160020": area_160020,
  "170010": area_170010,
  "170020": area_170020,
  "180010": area_180010,
  "180020": area_180020,
  "190010": area_190010,
  "190020": area_190020,
  "200010": area_200010,
  "200020": area_200020,
  "200030": area_200030,
  "210010": area_210010,
  "210020": area_210020,
  "220010": area_220010,
  "220020": area_220020,
  "220030": area_220030,
  "220040": area_220040,
  "230010": area_230010,
  "230020": area_230020,
  "240010": area_240010,
  "240020": area_240020,
  "250010": area_250010,
  "250020": area_250020,
  "260010": area_260010,
  "260020": area_260020,
  "270000": area_270000,
  "280010": area_280010,
  "280020": area_280020,
  "290010": area_290010,
  "290020": area_290020,
  "300010": area_300010,
  "300020": area_300020,
  "310010": area_310010,
  "310020": area_310020,
  "320010": area_320010,
  "320020": area_320020,
  "320030": area_320030,
  "330010": area_330010,
  "330020": area_330020,
  "340010": area_340010,
  "340020": area_340020,
  "350010": area_350010,
  "350020": area_350020,
  "350030": area_350030,
  "350040": area_350040,
  "360010": area_360010,
  "360020": area_360020,
  "370000": area_370000,
  "380010": area_380010,
  "380020": area_380020,
  "380030": area_380030,
  "390010": area_390010,
  "390020": area_390020,
  "390030": area_390030,
  "400010": area_400010,
  "400020": area_400020,
  "400030": area_400030,
  "400040": area_400040,
  "410010": area_410010,
  "410020": area_410020,
  "420010": area_420010,
  "420020": area_420020,
  "420030": area_420030,
  "420040": area_420040,
  "430010": area_430010,
  "430020": area_430020,
  "430030": area_430030,
  "430040": area_430040,
  "440010": area_440010,
  "440020": area_440020,
  "440030": area_440030,
  "440040": area_440040,
  "450010": area_450010,
  "450020": area_450020,
  "450030": area_450030,
  "450040": area_450040,
  "460010": area_460010,
  "460020": area_460020,
  "460030": area_460030,
  "460040": area_460040,
  "471010": area_471010,
  "471020": area_471020,
  "471030": area_471030,
  "472000": area_472000,
  "473000": area_473000,
  "474010": area_474010,
  "474020": area_474020,
  "011000": area_011000,
  "012010": area_012010,
  "012020": area_012020,
  "013010": area_013010,
  "013020": area_013020,
  "013030": area_013030,
  "014010": area_014010,
  "014020": area_014020,
  "014030": area_014030,
  "015010": area_015010,
  "015020": area_015020,
  "016010": area_016010,
  "016020": area_016020,
  "016030": area_016030,
  "017010": area_017010,
  "017020": area_017020,
  "020010": area_020010,
  "020020": area_020020,
  "020030": area_020030,
  "030010": area_030010,
  "030020": area_030020,
  "030030": area_030030,
  "040010": area_040010,
  "040020": area_040020,
  "050010": area_050010,
  "050020": area_050020,
  "060010": area_060010,
  "060020": area_060020,
  "060030": area_060030,
  "060040": area_060040,
  "070010": area_070010,
  "070020": area_070020,
  "070030": area_070030,
  "080010": area_080010,
  "080020": area_080020,
  "090010": area_090010,
  "090020": area_090020,
};
