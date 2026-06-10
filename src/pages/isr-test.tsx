import { GetStaticProps, NextPage } from "next";
import Head from "next/head";

interface Props {
  generatedAt: string;
}

const IsrTestPage: NextPage<Props> = ({ generatedAt }) => {
  return (
    <div style={{ padding: "50px", fontFamily: "sans-serif" }}>
      <h1>ISR Survival Test</h1>
      <p>This page should update every 10 seconds.</p>
      <div style={{ 
        fontSize: "24px", 
        padding: "20px", 
        background: "#f0f0f0", 
        borderRadius: "10px",
        display: "inline-block" 
      }}>
        Generated at: <strong>{generatedAt}</strong>
      </div>
      <p style={{ marginTop: "20px", color: "#666" }}>
        If this time doesn't change after refreshing (wait 10s between refreshes), 
        ISR is completely disabled or failing in this environment.
      </p>
      <hr />
      <button onClick={() => window.location.reload()}>Refresh Page</button>
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const now = new Date();
  const jstTime = now.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
  
  console.log(`[ISR_SYSTEM_MONITOR] ISR-TEST-PAGE generated at ${jstTime}`);
  
  return {
    props: {
      generatedAt: jstTime,
    },
    revalidate: 10, // 10 seconds for quick testing
  };
};

export default IsrTestPage;
