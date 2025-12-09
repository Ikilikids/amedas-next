// pages/_app.js
import Script from "next/script";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* Google Maps API */}
      <Script
        id="google-maps"
        strategy="beforeInteractive"
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`}
      />

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
