import { useEffect } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // 1. 画面遷移時に古いチャンクのロード失敗を検知して自動リロード
    const handleRouteChangeError = (err: any) => {
      if (
        err?.name === "ChunkLoadError" ||
        err?.message?.includes("Loading chunk") ||
        err?.message?.includes("Failed to fetch")
      ) {
        window.location.reload();
      }
    };

    // 2. 予期せぬチャンクエラーや古いスクリプト実行時エラーを拾って自動リロード
    const handleWindowError = (e: ErrorEvent) => {
      if (
        e?.message?.includes("Loading chunk") ||
        e?.message?.includes("ChunkLoadError")
      ) {
        window.location.reload();
      }
    };

    router.events.on("routeChangeError", handleRouteChangeError);
    window.addEventListener("error", handleWindowError);

    return () => {
      router.events.off("routeChangeError", handleRouteChangeError);
      window.removeEventListener("error", handleWindowError);
    };
  }, [router]);

  return <Component {...pageProps} />;
}

