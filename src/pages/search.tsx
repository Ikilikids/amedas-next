// pages/search.tsx
import { NextPage } from "next";
import Head from "next/head";
import Footer from "../components/Footer";
import Header from "../components/Header";

interface PageProps {
  query?: string;
}

const SearchPage: NextPage<PageProps> = ({ query }) => {
  return (
    <>
      <Head>
        <title>サイト内検索 - アメダス図鑑</title>
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 p-4">
          <h1 className="text-2xl font-bold mb-4">サイト内検索</h1>

          {/* Google CSE */}
          <div>
            <script
              async
              src="https://cse.google.com/cse.js?cx=a24d2c9bde483408d"
            ></script>
            <div className="gcse-search"></div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SearchPage;
