import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const handleStart = (_url: string, { shallow }: { shallow: boolean }) => {
      if (!shallow) setIsNavigating(true);
    };
    const handleComplete = () => setIsNavigating(false);

    // 1. 画面遷移時に古いチャンクのロード失敗を検知して自動リロード
    const handleRouteChangeError = (err: any) => {
      setIsNavigating(false);
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

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleRouteChangeError);
    window.addEventListener("error", handleWindowError);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleRouteChangeError);
      window.removeEventListener("error", handleWindowError);
    };
  }, [router]);

  return (
    <>
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-1 overflow-hidden bg-slate-200">
          <div className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-600 animate-pulse w-full"></div>
        </div>
      )}
      <Component {...pageProps} />
    </>
  );
}


