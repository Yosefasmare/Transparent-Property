import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import ExploreByLocation from "@/components/ExploreByLocation";
import Highlights from "@/components/Highlights";
import ContactCta from "@/components/ContactCta";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-blue-50 to-pink-50">
      <main className="flex flex-col gap-0">
        <section className="mb-0">
          <Hero />
        </section>
        <section className="py-2 md:py-4">
          <FeaturedProperties />
        </section>
        <section className="py-2 md:py-4">
          <ExploreByLocation />
        </section>
        <section className="py-2 md:py-4">
          <Highlights />
        </section>
        <section className="py-2 md:py-4">
          <ContactCta />
        </section>
      </main>
    </div>
  );
}
