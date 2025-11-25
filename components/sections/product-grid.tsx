import { useState } from "react";
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Product {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  imageUrl?: string;
  images?: string[];
  slug: string;
  description?: string;
}

interface ProductGridProps {
  products: Product[];
  title?: string;
  showViewAll?: boolean;
  itemsPerPage?: number;
  enablePagination?: boolean;
  mobileLayout?: "carousel" | "grid";
}

export function ProductGrid({
  products,
  title = "Our Latest Creations",
  showViewAll = true,
  itemsPerPage = 8,
  enablePagination = false,
  mobileLayout = "carousel",
}: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = enablePagination ? products.slice(startIndex, startIndex + itemsPerPage) : products;

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <section className="mb-12">
      <div className="container mx-auto">
        <h2 className="text-center mb-12 pt-8 text-4xl font-bold">{title}</h2>

        {/* Mobile View */}
        <div className="md:hidden">
          {mobileLayout === "carousel" ? (
            /* Horizontal Scroll (Carousel) */
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 px-6 scrollbar-hide">
              {products.slice(0, enablePagination ? itemsPerPage * totalPages : undefined).map((product) => (
                <div key={product._id || product.id} className="snap-center shrink-0 w-[85vw] sm:w-[300px]">
                  <ProductCard
                    id={product._id || product.id || ""}
                    name={product.name}
                    price={product.price}
                    slug={product.slug}
                    imageUrl={product.imageUrl || (product.images && product.images[0])}
                    description={product.description}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Vertical Grid */
            <div className="grid grid-cols-1 gap-8">
              {currentProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  id={product._id || product.id || ""}
                  name={product.name}
                  price={product.price}
                  slug={product.slug}
                  imageUrl={product.imageUrl || (product.images && product.images[0])}
                  description={product.description}
                />
              ))}
            </div>
          )}
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 mb-12">
          {currentProducts.map((product) => (
            <ProductCard
              key={product._id || product.id}
              id={product._id || product.id || ""}
              name={product.name}
              price={product.price}
              slug={product.slug}
              imageUrl={product.imageUrl || (product.images && product.images[0])}
              description={product.description}
            />
          ))}
        </div>

        {/* Pagination Controls */}
        {enablePagination && totalPages > 1 && (
          <div className="hidden md:flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="rounded-full w-12 h-12 p-0 flex items-center justify-center disabled:opacity-30"
            >
              <FaChevronLeft />
            </Button>
            <span className="font-medium text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="rounded-full w-12 h-12 p-0 flex items-center justify-center disabled:opacity-30"
            >
              <FaChevronRight />
            </Button>
          </div>
        )}

        {showViewAll && !enablePagination && (
          <div className="text-center mt-8">
            <Button variant="outline" href="/shop">
              View All Babies
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

