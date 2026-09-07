import React from "react";

interface AdMaxProps {
  id?: string;
  type?: "banner" | string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const AdMax: React.FC<AdMaxProps> = ({
  id = "8d30ed4e0e8f5f22736d28d5fe432383",
  type = "banner",
  width = 160,
  height = 600,
  className = "",
}) => {
  const wStr = typeof width === "number" ? `${width}px` : width;
  const hStr = typeof height === "number" ? `${height}px` : height;

  const iframeSrc = `/admax.html?id=${encodeURIComponent(id)}&type=${encodeURIComponent(type)}&w=${encodeURIComponent(wStr)}&h=${encodeURIComponent(hStr)}`;

  const wrapperClass =
    "my-6 flex justify-center items-center overflow-hidden min-h-[90px] " +
    className;

  return (
    <div className={wrapperClass}>
      <iframe
        title={`admax-${id}`}
        src={iframeSrc}
        className="border-0 overflow-hidden"
        style={{
          width: wStr,
          height: hStr,
          border: "none",
          display: "block",
        }}
      />
    </div>
  );
};

export default AdMax;












