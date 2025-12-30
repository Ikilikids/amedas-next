import type { AppProps } from "next/app";
import Script from "next/script";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Google広告 */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1440692612851416"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />

      <Component {...pageProps} />
    </>
  );
}
