import React from "react";

interface AdMaxProps {
  id?: string;
  type?: "banner" | string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const AdMax: React.FC<AdMaxProps> = () => {
  // 一旦広告を完全無効化（通信・iframe読み込みを発生させない）
  return null;
};

export default AdMax;












