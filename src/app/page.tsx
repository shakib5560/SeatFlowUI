import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import RoomsPreview from '@/components/RoomsPreview';
import HowItWorks from '@/components/HowItWorks';
import Stats from '@/components/Stats';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="dark bg-[#09090B] text-[#FAFAFA] min-h-screen selection:bg-[#7C3AED]/30 selection:text-white flex flex-col font-sans antialiased overflow-x-hidden">
      {/* Interactive premium navigation header */}
      <Header />

      {/* Main marketing sections */}
      <main className="flex-1 flex flex-col">
        {/* Elegant typography and primary calls-to-action */}
        <Hero />

        {/* User-value focused features grid */}
        <Features />

        {/* Dynamic visual preview of sample conference rooms */}
        <RoomsPreview />

        {/* Beautiful step-by-step breakdown */}
        <HowItWorks />

        {/* Highlighted platform metric values */}
        <Stats />

        {/* Final conversion section */}
        <CTA />
      </main>

      {/* Minimal copyright and links footer */}
      <Footer />
    </div>
  );
}
