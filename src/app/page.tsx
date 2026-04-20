// Homepage — served at "/".
// Navbar and Footer are embedded here so this page works without a route-group
// layout, keeping it separate from the (public) group used for /tutors.
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/features/home/HeroSection";
import HowItWorks from "@/components/features/home/HowItWorks";
import CategoriesSection from "@/components/features/home/CategoriesSection";
import FeaturedTutors from "@/components/features/home/FeaturedTutors";
import PlatformFeatures from "@/components/features/home/PlatformFeatures";
import Testimonials from "@/components/features/home/Testimonials";
import { fetchPlatformStats } from "@/lib/server-api";

export default async function HomePage() {
  const stats = await fetchPlatformStats();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection stats={stats} />
        <HowItWorks />
        <CategoriesSection />
        <FeaturedTutors />
        <PlatformFeatures />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
