import React, { useEffect } from "react";

interface GoogleSearchProps {
  className?: string;
  cx?: string;
}

/**
 * Google カスタム検索 (CSE) 埋め込みコンポーネント
 */
export const GoogleSearch: React.FC<GoogleSearchProps> = ({
  className = "",
  cx = "a24d2c9bde483408d",
}) => {
  useEffect(() => {
    // 既にスクリプトが読み込まれていなければ追加
    const scriptSrc = `https://cse.google.com/cse.js?cx=${cx}`;
    if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      document.body.appendChild(script);
    }
  }, [cx]);

  return (
    <div className={`google-cse-container ${className}`}>
      <div className="gcse-search"></div>
    </div>
  );
};

export default GoogleSearch;
