import React from "react";

interface PageLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, sidebar }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-1 min-w-0 w-full">{children}</div>
      {sidebar}
    </div>
  );
};

export default PageLayout;
