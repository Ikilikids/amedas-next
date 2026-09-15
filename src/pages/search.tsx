import { NextPage } from "next";
import Head from "next/head";
import Layout from "../components/Layout";
import Breadcrumb from "../components/Breadcrumb";

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

      <main className="max-w-[1280px] mx-auto p-4  my-4 w-full">
        {/* パンくずリスト */}
        <Breadcrumb
          items={[
            { label: "サイト内検索" },
          ]}
        />

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6  shadow-sm">
          <h1 className="text-2xl font-black text-slate-800 mb-6">サイト内検索</h1>

          {/* Google CSE */}
          <div>
            <script
              async
              src="https://cse.google.com/cse.js?cx=a24d2c9bde483408d"
            ></script>
            <div className="gcse-search"></div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default SearchPage;
