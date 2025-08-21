import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import ExploreByLocation from "@/components/ExploreByLocation";
import Highlights from "@/components/Highlights";
import ContactCta from "@/components/ContactCta";
import { getProperties } from "@/lib/supabaseClient";

export const revalidate = 30; // re-fetch from Supabase every 30 seconds


export default async function Home() {
  const properties = await getProperties(6);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-blue-50 to-pink-50">
      <main className="flex flex-col gap-0">
        <section className="mb-0">
          <Hero />
        </section>
        <section className="py-2 md:py-4 flex flex-col">
         <div className="text-center mb-5 mt-3 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-neutral-800 mb-4">
              Featured Properties
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium properties in prime locations
            </p>
          </div>
          <FeaturedProperties properties={properties} />
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
