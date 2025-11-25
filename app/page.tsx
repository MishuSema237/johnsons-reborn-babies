
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProductGrid } from "@/components/sections/product-grid";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { FeaturesSection } from "@/components/sections/features";
import { ProcessModalContent } from "@/components/sections/modals/process-modal";
import Image from "next/image";

export default function Home() {
  const [processModalOpen, setProcessModalOpen] = useState(false);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [heroImages, setHeroImages] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Products
        const productsRes = await fetch("/api/admin/products");
        if (productsRes.ok) {
          const data = await productsRes.json();
          setProducts(data.filter((p: any) => p.status === 'active').slice(0, 4));
        }

        // Fetch Hero Images
        const heroRes = await fetch("/api/admin/hero");
        if (heroRes.ok) {
          const data = await heroRes.json();
          setHeroImages(data.filter((i: any) => i.active));
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section - Syngri Style */}
      <section className="relative w-full min-h-screen bg-[#050505] text-white overflow-hidden flex items-center">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-3/4 h-full bg-gradient-to-l from-purple-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-10" />

        {/* Mobile Background Image (Behind Text) */}
        <div className="absolute inset-0 md:hidden z-0 opacity-40">
          {heroImages.length > 0 && (
            <Image
              src={heroImages[0].imageUrl}
              alt="Hero Background"
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-20 flex flex-col md:flex-row items-center gap-12 h-full pt-20 md:pt-0">
          {/* Left Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium text-gray-300">New Collection Available</span>
            </div>

            <h1 className="text-5xl text-white md:text-7xl font-bold leading-tight mb-6 tracking-tight drop-shadow-lg">
              Transform your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">nursery</span> into a <br />
              world of joy.
            </h1>

            <p className="text-lg text-gray-300 mb-10 max-w-xl leading-relaxed mx-auto md:mx-0 drop-shadow-md">
              Discover our handcrafted silicone reborn babies, designed with passion and precision to bring warmth and life to your home.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Button href="/shop" size="lg" className="bg-pink-600 text-white hover:bg-pink-700 border-none px-8 py-6 text-lg font-bold rounded-full min-w-[160px] shadow-lg shadow-pink-600/20">
                Shop Now
              </Button>
              <Button href="/gallery" variant="outline" size="lg" className="border-white/30 text-pink-600 hover:bg-white/10 px-8 py-6 text-lg font-medium rounded-full min-w-[160px] backdrop-blur-sm">
                View Gallery
              </Button>
            </div>
          </div>

          {/* Right Image (Desktop Only) */}
          <div className="hidden md:flex flex-1 relative w-full h-[500px] md:h-[700px] items-center justify-center">
            <div className="relative w-full h-full max-w-lg mx-auto">
              {/* Main abstract shape/image placeholder */}
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src="/assets/baby1.png"
                  alt="Reborn Baby"
                  width={600}
                  height={800}
                  className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Creations Section */}
      <div className="w-full">
        <ProductGrid products={products} itemsPerPage={3} enablePagination={true} />
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-6">
        <section className="mb-24 flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="flex-1 w-full md:max-w-[50%] h-[400px] relative rounded-2xl overflow-hidden shadow-lg group">
            <Image
              src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Artisan at Work"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="font-serif text-2xl">Masterful Craftsmanship</p>
            </div>
          </div>
          <div className="flex-1 w-full md:max-w-[50%] flex flex-col gap-6">
            <h2 className="text-left text-4xl font-serif">Crafting Dreams, One Baby at a Time</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              At Reborn Babies, we pour our heart and soul into every silicone
              reborn baby. Our artists bring these lifelike creations to being
              through meticulous sculpting, detailed hand-painting, and precise
              weighting, ensuring each one is a unique masterpiece.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              We are dedicated to providing collectors with unparalleled realism,
              quality, and an unforgettable experience that goes beyond a mere
              purchase. Each baby is designed to bring joy and comfort to
              collectors worldwide.
            </p>
            <Button
              variant="outline"
              className="w-auto self-start mt-4"
              onClick={() => setProcessModalOpen(true)}
            >
              Learn More About Our Process
            </Button>
          </div>
        </section>
      </div>

      {/* Features Section */}
      <FeaturesSection />

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-6">
        <section className="mb-24 flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16">
          <div className="flex-1 w-full md:max-w-[50%] flex flex-col gap-6">
            <h2 className="text-left text-4xl font-serif">Our Story</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              Reborn Babies was founded on a passion for transforming silicone
              into breathing works of art. Our journey began with a single
              artist's dream to create dolls that not only look real but also
              evoke the same warmth and emotion as a real baby.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              Over the years, this dream has grown into a collective of dedicated
              artisans, each bringing their unique talent to craft these precious
              creations. We pour our heart and soul into every silicone reborn
              baby, ensuring each one is a unique masterpiece that brings joy and
              comfort to collectors worldwide.
            </p>

            <div className={`transition-all duration-500 overflow-hidden ${storyModalOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                Our commitment to artistry, quality, and integrity guides everything
                we do. We use only premium, ethically sourced silicone and
                materials, ensuring that each Reborn baby is safe, durable, and a
                joy to hold. Every stitch, every brushstroke, every detail is a
                testament to our dedication to artistry and realism.
              </p>
              <p className="text-lg leading-relaxed text-gray-700">
                Thank you for being a part of our story. We look forward to
                crafting a piece of art that brings joy and warmth into your life.
              </p>
            </div>

            {!storyModalOpen && (
              <button
                onClick={() => setStoryModalOpen(true)}
                className="text-pink-600 font-semibold hover:text-pink-700 self-start underline underline-offset-4"
              >
                Read More
              </button>
            )}
          </div>
          <div className="flex-1 w-full md:max-w-[50%] h-[450px] relative rounded-2xl overflow-hidden shadow-lg group">
            <Image
              src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Our Story"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-pink-900/10 mix-blend-multiply" />
          </div>
        </section>
      </div>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Call to Action Section */}
      <div className="max-w-7xl mx-auto px-6">
        <section className="py-16 bg-pink-50 rounded-3xl text-center px-6">
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-gray-900">
            Ready to Find Your Perfect Baby?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Explore our collection of handcrafted reborn babies and bring home a bundle of joy today.
          </p>
          <Button href="/shop" size="lg" className="px-12 py-6 text-lg text-white">
            View Collection
          </Button>
        </section>
      </div>

      {/* Process Modal */}
      <Modal
        isOpen={processModalOpen}
        onClose={() => setProcessModalOpen(false)}
        title="Our Process: Crafting Perfection"
      >
        <ProcessModalContent />
      </Modal>
    </div>
  );
}
