import React from "react";
import {
  FaChartBar,
  FaCloudSun,
  FaSnowflake,
  FaSun,
  FaMountain,
  FaWater,
} from "react-icons/fa";
import { StationLink } from "../StationLink";
import { TocItem } from "../../Sidebar";

export const japanClimateTocItems: TocItem[] = [
  { id: "section1", label: "1. なぜ日本は南北・東西で気候が激変するのか？" },
  { id: "section2", label: "2. 気候を読み解くツール「雨温図」とは" },
  { id: "section3", label: "3. 日本の6大気候区分の特徴と雨温図パターン" },
  { id: "section4", label: "4. 気候の違いを生み出す2大メカニズム" },
  { id: "section5", label: "5. アメダス図鑑で雨温図を楽しむポイント" },
];

export const JapanClimateClassificationArticle: React.FC = () => {
  return (
    <div className="space-y-10 text-slate-700 leading-relaxed text-sm ">
      {/* セクション1 */}
      <section id="section1">
        <h2 className="text-xl  font-black text-slate-800 pb-3 border-b border-slate-200 flex items-center gap-2 mb-4">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
          1. なぜ日本は南北・東西で気候が激変するのか？
        </h2>
        <p>
          「東京が冬晴れの青空でカラカラに乾燥しているとき、新幹線でトンネルを抜けた新潟では視界を遮る猛吹雪が吹き荒れている」——。
        </p>
        <p className="mt-3">
          川端康成の小説『雪国』の冒頭「国境の長いトンネルを抜けると雪国であった」は、日本の気候の劇的な変化を見事に表現した一節です。
        </p>
        <p className="mt-3">
          日本列島は、南北に約3,000kmにわたって細長く延びており、亜寒帯（北海道）から温帯（本州・四国・九州）、さらには亜熱帯（南西諸島）まで、多種多様な気候帯にまたがっています。さらに驚くべきは、東西わずか数百kmの幅の中に、標高2,000〜3,000m級の険しい脊梁山脈（日本アルプスなど）が背骨のように貫いている点です。
        </p>
        <p className="mt-3">
          この「緯度の広がり」と「険しい山脈」が組み合わさることで、世界的に見ても極めてユニークな、地域ごとの個性あふれる気候が形成されています。
        </p>
      </section>

      {/* セクション2 */}
      <section id="section2">
        <h2 className="text-xl  font-black text-slate-800 pb-3 border-b border-slate-200 flex items-center gap-2 mb-4">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
          2. 気候を読み解くツール「雨温図」とは
        </h2>
        <p>
          ある地域の気候的個性をひと目で理解するために世界中で用いられているのが、<strong>「雨温図」</strong>です。
        </p>
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl my-4 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <FaChartBar className="text-blue-600" />
            <span>雨温図の基本ルール</span>
          </div>
          <ul className="text-xs  text-slate-600 list-disc list-inside space-y-1">
            <li><strong>折れ線グラフ（赤色）:</strong> 月平均気温の推移（1月〜12月）</li>
            <li><strong>棒グラフ（青色）:</strong> 月降水量の合計値（1月〜12月）</li>
          </ul>
        </div>
        <p>
          雨温図を見るだけで、「夏と冬の寒暖差（気温の山が高くとがっているか、緩やかか）」や「雨が降る季節（夏に集中しているか、冬に多いか、年中均等か）」が瞬時に分かります。
        </p>
        <p className="mt-3">
          アメダス図鑑では、気象庁が公表する1991〜2020年の平年値統計をもとに、全国約1,300地点すべての雨温図を自動生成して掲載しています。
        </p>
      </section>

      {/* セクション3 */}
      <section id="section3">
        <h2 className="text-xl  font-black text-slate-800 pb-3 border-b border-slate-200 flex items-center gap-2 mb-6">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
          3. 日本の6大気候区分の特徴と雨温図パターン
        </h2>
        <p className="mb-6">
          日本の気候は、地理的条件や季節風の影響から大きく以下の<strong>6つの気候区分</strong>に分類されます。それぞれの雨温図の特徴と、代表的なアメダス観測所を見ていきましょう。
        </p>

        {/* 区分1: 太平洋側 */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl mb-6">
          <div className="flex items-center gap-2.5 text-lg font-black text-slate-800 mb-2">
            <FaSun className="text-orange-500 text-xl" />
            <span>① 太平洋側気候（夏多雨・冬晴天乾燥）</span>
          </div>
          <p className="text-xs  text-slate-600 mb-3 leading-relaxed">
            本州・四国・九州の太平洋側に広がる気候です。夏は南東からの太平洋高気圧による暖湿流や台風、梅雨の影響で雨が多く、蒸し暑くなります。一方、冬は北西の季節風が中央山脈で雪を落とした後に吹き降りるため、晴天の日が続き空気がカラカラに乾燥します。
          </p>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/70 text-xs">
            <span className="font-bold text-slate-700">【雨温図のサイン】</span>
            <span className="text-slate-600 ml-1">夏（6〜9月）に降水量の棒が跳ね上がり、冬（12〜2月）は極端に棒が短くなる。</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs items-center">
            <span className="font-bold text-slate-500 py-1">代表地点:</span>
            <StationLink id="44132" name="東京" region="kanto" />
            <StationLink id="50331" name="静岡" region="chubu" />
            <StationLink id="74182" name="高知" region="shikoku" />
          </div>
        </div>

        {/* 区分2: 日本海側 */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl mb-6">
          <div className="flex items-center gap-2.5 text-lg font-black text-slate-800 mb-2">
            <FaSnowflake className="text-sky-500 text-xl" />
            <span>② 日本海側気候（冬の豪雪・夏のフェーン現象）</span>
          </div>
          <p className="text-xs  text-slate-600 mb-3 leading-relaxed">
            北海道から山陰地方にかけての日本海沿岸部です。シベリア高気圧から吹き出す冷たい北西季節風が、温かい対馬海流から大量の水蒸気を補給し、雪雲となって山脈に衝突します。世界でも屈指の豪雪地帯となり、冬の降水量が夏の降水量を上回ることも珍しくありません。
          </p>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/70 text-xs">
            <span className="font-bold text-slate-700">【雨温図のサイン】</span>
            <span className="text-slate-600 ml-1">冬（12〜1月）の降水量（降雪量換算）の棒がグラフの両端で突き抜けて高くなる。</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs items-center">
            <span className="font-bold text-slate-500 py-1">代表地点:</span>
            <StationLink id="54232" name="新潟" region="hokuriku" />
            <StationLink id="55102" name="富山" region="hokuriku" />
            <StationLink id="31482" name="酸ケ湯" region="tohoku" />
          </div>
        </div>

        {/* 区分3: 瀬戸内海式 */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl mb-6">
          <div className="flex items-center gap-2.5 text-lg font-black text-slate-800 mb-2">
            <FaCloudSun className="text-amber-500 text-xl" />
            <span>③ 瀬戸内海式気候（年間通して温暖少雨）</span>
          </div>
          <p className="text-xs  text-slate-600 mb-3 leading-relaxed">
            中国山地と四国山地の二大山脈に挟まれた瀬戸内海沿岸地域です。南からの湿った夏の風は四国山地に、北からの冬の雪雲は中国山地に遮られるため、年間を通じて雨が少なく、日照時間が長いのが最大の特徴です。古くから塩田やため池（讃岐平野など）が発達した理由がここにあります。
          </p>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/70 text-xs">
            <span className="font-bold text-slate-700">【雨温図のサイン】</span>
            <span className="text-slate-600 ml-1">年間降水量（棒の高さ）全体が低く、年合計が1,000〜1,200mm程度にとどまる。</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs items-center">
            <span className="font-bold text-slate-500 py-1">代表地点:</span>
            <StationLink id="66408" name="岡山" region="chugoku" />
            <StationLink id="72086" name="高松" region="shikoku" />
          </div>
        </div>

        {/* 区分4: 中央高地式 */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl mb-6">
          <div className="flex items-center gap-2.5 text-lg font-black text-slate-800 mb-2">
            <FaMountain className="text-emerald-600 text-xl" />
            <span>④ 中央高地式気候（大きな寒暖差と高原の冷涼）</span>
          </div>
          <p className="text-xs  text-slate-600 mb-3 leading-relaxed">
            長野県や山梨県、岐阜県飛騨地方などの山間盆地・高原地帯です。標高が高いため年平均気温が低く、海から遠く離れているため「日較差（昼と夜の温度差）」や「年較差（夏と冬の温度差）」が極めて大きくなります。周囲を険しい山々に囲まれているため、降水量も比較的少なめです。
          </p>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/70 text-xs">
            <span className="font-bold text-slate-700">【雨温図のサイン】</span>
            <span className="text-slate-600 ml-1">気温の折れ線が夏高く冬低くシャープにとがり、降水量は全体的に控えめ。</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs items-center">
            <span className="font-bold text-slate-500 py-1">代表地点:</span>
            <StationLink id="48361" name="松本" region="chubu" />
            <StationLink id="48331" name="軽井沢" region="chubu" />
          </div>
        </div>

        {/* 区分5: 南西諸島 */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl mb-6">
          <div className="flex items-center gap-2.5 text-lg font-black text-slate-800 mb-2">
            <FaWater className="text-cyan-500 text-xl" />
            <span>⑤ 南西諸島気候（年間通して高温多湿の亜熱帯）</span>
          </div>
          <p className="text-xs  text-slate-600 mb-3 leading-relaxed">
            沖縄県および鹿児島県奄美群島などの島嶼部です。黒潮に囲まれた海洋性亜熱帯気候で、最寒月（1月）でも平均気温が16〜18℃前後あり、霜や雪が降ることは原則ありません。年降水量は2,000mmを超え、台風や前線の影響を強く受けます。
          </p>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/70 text-xs">
            <span className="font-bold text-slate-700">【雨温図のサイン】</span>
            <span className="text-slate-600 ml-1">気温の折れ線グラフが常に15℃以上の高い位置を推移し、冬も平坦。</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs items-center">
            <span className="font-bold text-slate-500 py-1">代表地点:</span>
            <StationLink id="91197" name="那覇" region="okinawa" />
            <StationLink id="94081" name="石垣島" region="okinawa" />
          </div>
        </div>

        {/* 区分6: オホーツク海側・北海道 */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="flex items-center gap-2.5 text-lg font-black text-slate-800 mb-2">
            <FaSnowflake className="text-indigo-400 text-xl" />
            <span>⑥ オホーツク海側・北海道気候（冷涼少雨と冬の厳寒）</span>
          </div>
          <p className="text-xs  text-slate-600 mb-3 leading-relaxed">
            北海道のオホーツク海沿岸や道東地方です。亜寒帯気候に属し、冬には流氷が接岸して気温は氷点下深くまで急降下します。一方で梅雨前線が届かないため初夏に梅雨がなく、年間降水量は日本の他の地域に比べてかなり少なくなります。
          </p>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/70 text-xs">
            <span className="font-bold text-slate-700">【雨温図のサイン】</span>
            <span className="text-slate-600 ml-1">折れ線グラフが冬に氷点下（0℃以下）へ深く沈み込み、夏も20℃前後と冷涼。</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs items-center">
            <span className="font-bold text-slate-500 py-1">代表地点:</span>
            <StationLink id="17341" name="網走" region="hokkaido" />
            <StationLink id="20432" name="帯広" region="hokkaido" />
          </div>
        </div>
      </section>

      {/* セクション4 */}
      <section id="section4">
        <h2 className="text-xl  font-black text-slate-800 pb-3 border-b border-slate-200 flex items-center gap-2 mb-4">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
          4. 気候の違いを生み出す2大メカニズム
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-black text-slate-800 text-base mb-1">
              【メカニズム1: 季節風（モンスーン）の反転】
            </h3>
            <p className="text-sm ">
              ユーラシア大陸と太平洋に挟まれた日本は、季節によって風向きが180度入れ替わります。冬は大陸高気圧からの「北西モンスーン」、夏は太平洋高気圧からの「南東モンスーン」が吹き付けます。
            </p>
          </div>

          <div>
            <h3 className="font-black text-slate-800 text-base mb-1">
              【メカニズム2: 脊梁山脈による水蒸気トラップとフェーン現象】
            </h3>
            <p className="text-sm ">
              湿った風が山脈に衝突すると、強制的に上昇させられて冷却され、雨や雪を降らせます（風上側）。水分を失った空気は山を越えて吹き降りる際、乾燥断熱減率（約1℃/100m）で急激に気温を上昇させながら乾燥した風（からっ風やフェーン現象）となって風下側の平野に届きます。
            </p>
          </div>
        </div>
      </section>

      {/* セクション5 */}
      <section id="section5">
        <h2 className="text-xl  font-black text-slate-800 pb-3 border-b border-slate-200 flex items-center gap-2 mb-4">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
          5. アメダス図鑑で雨温図を楽しむポイント
        </h2>
        <p>
          アメダス図鑑では、地点詳細ページを開くだけで、その観測所の雨温図が即座にカラー表示されます。
        </p>
        <ul className="mt-3 space-y-2 list-disc list-inside text-sm ">
          <li><strong>「類似地点」をチェック:</strong> 自分の住む街と、遠く離れた別の街の雨温図がそっくりな形をしている驚きを発見できます。</li>
          <li><strong>「標高」との関係:</strong> 同じ都道府県内でも、標高が500m上がるだけで雨温図の折れ線が全体的に下へシフトする様子が手に取るように分かります。</li>
        </ul>
        <p className="mt-4">
          ぜひ、身近な地点や旅先、気になる観測所の雨温図を探検してみてください！
        </p>
      </section>
    </div>
  );
};
