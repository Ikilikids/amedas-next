import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/Header";

interface Props {
  time: string;
}

const ISRTest: NextPage<Props> = ({ time }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Head>
        <title>ISR Test Page</title>
      </Head>
      <Header />
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-blue-600">ISR (Incremental Static Regeneration) Test</h1>
          <p className="mb-4 text-gray-700">
            This page demonstrates ISR. The timestamp below is generated on the server and cached.
          </p>
          <div className="bg-blue-50 p-4 rounded border border-blue-200 mb-6">
            <p className="text-sm text-blue-800 font-semibold mb-1">Generated at:</p>
            <p className="text-3xl font-mono text-blue-900">{time}</p>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Settings: <code className="bg-gray-100 px-1">revalidate: 10</code> (The page will be updated at most once every 10 seconds when a request comes in).
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Reload Page
            </button>
            <Link href="/" className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  console.log("[ISR Test] Generating page...");
  return {
    props: {
      time: new Date().toLocaleTimeString("ja-JP"),
    },
    revalidate: 10, // 10秒ごとに再生成可能
  };
};

export default ISRTest;
