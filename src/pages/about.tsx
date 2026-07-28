// pages/about.tsx
import { NextPage } from "next";
import Head from "next/head";
import Footer from "../components/Footer";
import Header from "../components/Header";

const About: NextPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>このサイトについて - アメダス図鑑</title>
        <meta
          name="description"
          content="アメダス図鑑は、日本のアメダス観測データをもとに気象情報を整理・可視化する情報提供サイトです。"
        />
        <link rel="canonical" href="https://amedas-next--amedas-ppp.asia-east1.hosted.app/about" />
      </Head>

      <Header />

      <main className="flex-1 max-w-[800px] mx-auto p-4 bg-white border rounded shadow mt-4 mb-8">
        <h1 className="text-2xl font-bold mb-4">このサイトについて</h1>

        <p>
          アメダス図鑑は、日本各地の気象の特徴を把握しやすくすることを目的とした、
          気象データの集計・可視化を行う情報提供サイトです。
        </p>

        <p className="mt-3">
          本サイトでは、気象庁が公開しているアメダス観測データや平年値データをもとに、
          独自に集計・整理した情報を掲載しています。
        </p>

        <p className="mt-3">
          掲載している情報は、研究・学習・一般的な情報参照を目的としたものであり、
          特定の地点や期間の気象傾向を確認できるよう設計されています。
        </p>

        <p className="mt-3">
          本サイトは個人によって運営されており、
          公的機関の公式発表や予報を代替するものではありません。
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default About;
