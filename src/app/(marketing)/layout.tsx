import { FloatingSports } from "@/components/shared/floating-sports";
import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { getSiteSettings } from "@/server/queries";

export default async function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  return (
    <>
      <FloatingSports />
      <ScrollProgress />
      <Navbar
        instagramUrl={settings.instagram_url}
        whatsappUrl={settings.whatsapp_community_url}
      />
      <main className="flex-1 pt-20 sm:pt-24">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
