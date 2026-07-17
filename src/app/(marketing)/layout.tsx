import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
