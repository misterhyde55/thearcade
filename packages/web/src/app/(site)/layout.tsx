import { DemoModeBanner } from "@/components/layout/DemoModeBanner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArcadeIntro } from "@/components/intro/ArcadeIntro";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ArcadeIntro />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-brand-magenta focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <DemoModeBanner />
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
