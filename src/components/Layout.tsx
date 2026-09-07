import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import HeroSection from "./HeroSection";
import AdMax from "./AdMax";

export interface HeroSectionProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  Icon: React.ReactNode;
  gradient?: string;
  lastUpdateLabel?: string;
  lastUpdateValue?: string;
}

interface LayoutProps {
  children: React.ReactNode;
  heroProps?: HeroSectionProps;
  hideAd?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  heroProps,
  hideAd = false,
}) => {
  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-sans relative">
      <Header />

      {heroProps && <HeroSection {...heroProps} />}

      <div className="flex-1 w-full flex justify-center relative">
        {/* Left Side Ad: visible on >= 1680px */}
        {!hideAd && (
          <aside
            aria-label="Sponsored Left"
            className="hidden wide1680:block w-[160px] shrink-0 mr-4 self-start sticky top-[128px] z-30 pointer-events-auto pt-4"
          >
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase mb-1">
                SPONSORED
              </span>
              <div className="w-[160px] min-h-[600px] bg-slate-50 border border-slate-200/80 rounded-lg p-1 flex justify-center items-start shadow-sm">
                <AdMax
                  id="8d30ed4e0e8f5f22736d28d5fe432383"
                  type="banner"
                  width={160}
                  height={600}
                  className="!my-0 !min-h-[600px]"
                />
              </div>
            </div>
          </aside>
        )}

        {/* Main Content Area: flex-1 up to 1280px */}
        <main className="w-full max-w-[1280px] min-w-0 flex-1 pb-16 xl:pb-0">
          {children}
        </main>

        {/* Right Side Ad: visible on >= 1280px (xl) */}
        {!hideAd && (
          <aside
            aria-label="Sponsored Right"
            className="hidden xl:block w-[160px] shrink-0 ml-4 self-start sticky top-[128px] z-30 pointer-events-auto pt-4"
          >
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase mb-1">
                SPONSORED
              </span>
              <div className="w-[160px] min-h-[600px] bg-slate-50 border border-slate-200/80 rounded-lg p-1 flex justify-center items-start shadow-sm">
                <AdMax
                  id="8d30ed4e0e8f5f22736d28d5fe432383"
                  type="banner"
                  width={160}
                  height={600}
                  className="!my-0 !min-h-[600px]"
                />
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Mobile Bottom Bar Ad (320x50): ONLY visible when sidebars are hidden (< 1280px) */}
      {!hideAd && (
        <aside
          aria-label="Sponsored Mobile Overlay"
          className="xl:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-2xl py-1 pointer-events-auto"
        >
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-0.5">
            SPONSORED
          </span>
          <div className="w-[320px] h-[50px] flex items-center justify-center overflow-hidden">
            <AdMax
              id="e4c02042afcb98662fa7b5d77620565b"
              type="banner"
              width={320}
              height={50}
              className="!my-0 !min-h-[50px] w-[320px] h-[50px]"
            />
          </div>
        </aside>
      )}

      <Footer />
    </div>
  );
};

export default Layout;