import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Layout shared by all public-facing pages (home, tutor listing, tutor detail).
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
