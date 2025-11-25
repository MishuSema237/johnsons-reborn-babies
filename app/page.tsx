
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProductGrid } from "@/components/sections/product-grid";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { FeaturesSection } from "@/components/sections/features";
import { ProcessModalContent } from "@/components/sections/modals/process-modal";
import { StoryModalContent } from "@/components/sections/modals/story-modal";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Home() {
  const [processModalOpen, setProcessModalOpen] = useState(false);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [heroImages, setHeroImages] = useState<any[]>([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

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

  // Hero Slider Timer
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const nextSlide = () => {
    setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentHeroIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] mb-12 overflow-hidden group w-full">
        {heroImages.length > 0 ? (
          <>
            {heroImages.map((image, index) => (
              <div
                key={image._id}
                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentHeroIndex ? "opacity-100" : "opacity-0"
                  }`}
              >
                <div className="absolute inset-0 bg-black/40 z-10" />
                <Image
                  src={image.imageUrl}
                  alt="Hero Image"
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}

            {/* Static Overlay */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white px-4 pointer-events-none">
              <h1 className="max-w-4xl mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] text-5xl md:text-7xl font-serif font-bold tracking-wide text-white">
                Discover Our Lifelike Reborn Baby Collection
              </h1>
              <p className="text-2xl md:text-3xl mb-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] max-w-3xl font-light text-white/90">
                Handcrafted with love, designed for your heart.
              </p>
              <div className="pointer-events-auto">
                <Button href="/shop" size="lg" className="bg-white text-pink-600 hover:bg-gray-100 border-none px-10 py-4 text-xl font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  Shop Now
                </Button>
              </div>
            </div>

            {heroImages.length > 1 && (
              <div className="hidden">
                {/* Manual controls removed as requested */}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-50 via-pink-100 to-lavender-50 flex flex-col items-center justify-center text-center p-8">
            <h1 className="max-w-3xl mb-6 text-gray-900 font-serif">
              Discover Our Lifelike Reborn Baby Collection
            </h1>
            <Button href="/shop">Shop Now</Button>
          </div>
        )}
      </section>

      {/* Latest Creations Section */}
      <div className="px-6">
        <ProductGrid products={products} />
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
            <p className="text-lg leading-relaxed text-gray-700">
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
        <section className="mb-24 py-16 bg-pink-50 rounded-3xl text-center px-6">
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-gray-900">
            Ready to Find Your Perfect Baby?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Explore our collection of handcrafted reborn babies and bring home a bundle of joy today.
          </p>
          <Button href="/shop" size="lg" className="px-12 py-6 text-lg">
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
