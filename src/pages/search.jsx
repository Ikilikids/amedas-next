// pages/search.jsx
import Head from "next/head";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function SearchPage({ query }) {
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
            <div class="gcse-search"></div>
            <div className="gcse-search"></div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
