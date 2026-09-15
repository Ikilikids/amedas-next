import { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Privacy: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/about#privacy");
  }, [router]);

  return (
    <>
      <Head>
        <title>プライバシーポリシー - アメダス図鑑</title>
        <meta httpEquiv="refresh" content="0;url=/about#privacy" />
        <link rel="canonical" href="https://amedas-zukan.jp/about#privacy" />
      </Head>
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-slate-500">
          「このサイトについて・プライバシーポリシー」へ移動しています...
        </p>
      </div>
    </>
  );
};

export default Privacy;
