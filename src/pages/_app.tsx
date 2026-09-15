import React, { Component as ReactComponent, useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import "../styles/globals.css";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends ReactComponent<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary caught error]:", error, errorInfo);

    // 10秒以内にリロードしていなければ自動リロードして最新キャッシュを取得
    const lastReload = sessionStorage.getItem("last_auto_reload");
    const now = Date.now();
    if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
      sessionStorage.setItem("last_auto_reload", now.toString());
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-lg border border-slate-200 text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              🔄
            </div>
            <h1 className="text-xl font-black text-slate-800 mb-2">
              データを更新しています
            </h1>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              最新データへの更新中か、一時的な通信エラーが発生しました。
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  sessionStorage.removeItem("last_auto_reload");
                  window.location.reload();
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors shadow-md"
              >
                ページを再読み込みする
              </button>
              <a
                href="/"
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors block text-center"
              >
                トップページに戻る
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
        err?.message?.includes("Failed to fetch") ||
        err?.message?.includes("turbopack")
      ) {
        window.location.reload();
      }
    };

    // 2. 予期せぬチャンクエラーや古いスクリプト実行時エラーを拾って自動リロード
    const handleWindowError = (e: Event) => {
      const errorEvent = e as ErrorEvent;
      const target = e?.target as HTMLScriptElement | null;
      const src = target?.src || "";
      const msg = errorEvent?.message || String(e || "");

      if (
        msg.includes("Loading chunk") ||
        msg.includes("ChunkLoadError") ||
        msg.includes("turbopack") ||
        (target?.tagName === "SCRIPT" && src.includes("/_next/"))
      ) {
        window.location.reload();
      }
    };

    // 3. Unhandled Promise Rejection (非同期チャンク読み込み失敗) を自動リロード
    const handleUnhandledRejection = (e: PromiseRejectionEvent) => {
      const reason = e?.reason;
      if (
        reason?.name === "ChunkLoadError" ||
        reason?.message?.includes("Loading chunk") ||
        reason?.message?.includes("Failed to fetch") ||
        reason?.message?.includes("turbopack")
      ) {
        window.location.reload();
      }
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleRouteChangeError);
    // スクリプト取得失敗 (404) はバブリングしないため useCapture: true が必須
    window.addEventListener("error", handleWindowError, true);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleRouteChangeError);
      window.removeEventListener("error", handleWindowError, true);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, [router]);

  return (
    <ErrorBoundary>
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-1 overflow-hidden bg-slate-200">
          <div className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-600 animate-pulse w-full"></div>
        </div>
      )}
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}



