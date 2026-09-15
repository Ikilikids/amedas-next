import { NextPage } from "next";
import Head from "next/head";
import Layout from "../components/Layout";
import Breadcrumb from "../components/Breadcrumb";
import HeroSection from "../components/HeroSection";
import { FaSearch } from "react-icons/fa";

interface PageProps {
  query?: string;
}

const SearchPage: NextPage<PageProps> = ({ query }) => {
  return (
    <Layout>
      <Head>
        <title>サイト内検索 - アメダス図鑑</title>
        <meta
          name="description"
          content="アメダス図鑑のサイト内検索ページです。探したいアメダス観測所の名前や地域からデータを検索できます。"
        />
        <link rel="canonical" href="https://amedas-zukan.jp/search" />
      </Head>

      <main className="max-w-[1280px] mx-auto p-4 my-4 w-full">
        {/* パンくずリスト */}
        <Breadcrumb
          items={[
            { label: "サイト内検索" },
          ]}
        />

        <div className="space-y-6">
          <HeroSection
            badgeIcon={<FaSearch className="text-sky-300" />}
            badgeText="Site Search"
            title="サイト内検索"
            description="探したいアメダス観測所の名前や地域、気になる気象キーワードからデータを検索できます。"
            watermark="SEARCH"
            gradient="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600"
          />

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            {/* Google CSE */}
            <div>
              <script
                async
                src="https://cse.google.com/cse.js?cx=a24d2c9bde483408d"
              ></script>
              <div className="gcse-search"></div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default SearchPage;
