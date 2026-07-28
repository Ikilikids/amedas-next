// pages/privacy.tsx
import { NextPage } from "next";
import Head from "next/head";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Privacy: NextPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>プライバシーポリシー - アメダス図鑑</title>
        <meta
          name="description"
          content="アメダス図鑑のプライバシーポリシーです。広告配信、Cookie、アクセス解析、データ出典について説明しています。"
        />
        <link rel="canonical" href="https://amedas-next--amedas-ppp.asia-east1.hosted.app/privacy" />
      </Head>

      <Header />

      <main className="flex-1 max-w-[800px] mx-auto p-4 bg-white border rounded shadow mt-4 mb-8">
        <h1 className="text-2xl font-bold mb-4">プライバシーポリシー</h1>

        <p>
          アメダス図鑑（以下「当サイト」）は、訪問者のプライバシーを尊重し、以下の方針に基づき運営しています。
        </p>

        <h2 className="mt-4 font-semibold">1. 広告配信について</h2>
        <p>
          当サイトは Google AdSense を利用して広告を配信しています。
          広告はユーザーの興味に基づいて表示されることがあります。
          広告配信事業者は Cookie を使用して広告を配信する場合があります。
        </p>

        <h2 className="mt-4 font-semibold">2. Cookie とアクセス解析</h2>
        <p>
          当サイトでは、サイト改善のために Google Analytics
          を使用してアクセス解析を行っています。 この解析には Cookie
          が使用される場合がありますが、個人を特定する情報は取得していません。
        </p>

        <h2 className="mt-4 font-semibold">3. 個人情報の取り扱い</h2>
        <p>
          当サイトでは、ユーザーから個人情報を取得することは基本的にありません。
          もしお問い合わせフォームなどで情報を取得する場合は、事前に明示して収集・管理します。
        </p>

        <h2 className="mt-4 font-semibold">4. 免責事項</h2>
        <p>
          当サイトの情報は正確を期していますが、内容の完全性や正確性を保証するものではありません。
          また、広告リンク先のサイトのプライバシーポリシーについては当サイトは責任を負いません。
        </p>

        <h2 className="mt-4 font-semibold">5. データの出典について</h2>
        <p>
          当サイトでは、気象庁が公開しているアメダス観測データおよび平年値データをもとに、
          独自に集計した情報を掲載しています。
          掲載内容は気象庁の公式見解や公表値そのものではなく、
          正確性・完全性を保証するものではありません。
        </p>

        <p className="mt-6">最終更新日: 2025年11月23日</p>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
