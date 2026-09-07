import React from "react";

interface AdMaxProps {
  id?: string;
  className?: string;
}

export const AdMax: React.FC<AdMaxProps> = ({
  id = "8cba4bdc8615266b125daa75aeb3671b",
  className = "",
}) => {
  const adHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            background: transparent;
          }
        </style>
      </head>
      <body>
        <script type="text/javascript" src="https://adm.shinobi.jp/s/${id}"></script>
      </body>
    </html>
  `;

  const wrapperClass =
    "my-6 flex justify-center items-center overflow-hidden min-h-[90px] " +
    className;

  return (
    <div className={wrapperClass}>
      <iframe
        title={`admax-${id}`}
        srcDoc={adHtml}
        scrolling="no"
        frameBorder="0"
        className="w-full h-full border-0 overflow-hidden"
        style={{ minHeight: "inherit", minWidth: "100%" }}
      />
    </div>
  );
};

export default AdMax;


