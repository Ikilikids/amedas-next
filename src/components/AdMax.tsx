import React, { useEffect, useRef } from "react";

interface AdMaxProps {
  id?: string;
  className?: string;
}

export const AdMax: React.FC<AdMaxProps> = ({
  id = "8cba4bdc8615266b125daa75aeb3671b",
  className = "",
}) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = adRef.current;
    if (!container) return;

    container.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://adm.shinobi.jp/s/" + id;
    script.async = true;

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [id]);

  const wrapperClass = "my-6 flex justify-center items-center overflow-hidden min-h-[90px] " + className;

  return (
    <div className={wrapperClass}>
      <div ref={adRef} className="ninja-admax-container text-center" />
    </div>
  );
};

export default AdMax;
