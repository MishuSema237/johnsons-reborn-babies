import Link from "next/link";
import Image from "next/image";
import { Button } from "./button";
import { FaShoppingCart } from "react-icons/fa";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  slug: string;
  description?: string;
}

import { useCart } from "@/lib/context/cart-context";

export function ProductCard({
  id,
  name,
  price,
  imageUrl,
  slug,
  description,
}: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    addItem({
      id,
      name,
      price,
      slug,
      imageUrl,
    });
  };

  return (
    <div className="relative group w-full aspect-[3/4] rounded-[32px] p-4 overflow-hidden border-4 border-white shadow-xl transition-all duration-300 hover:-translate-y-2">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-50 opacity-80" />

      {/* Product Image - Full Height Background */}
      <div className="absolute inset-0 z-10">
        <Link href={`/product/${slug}`} className="relative w-full h-full block">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              No Image
            </div>
          )}
        </Link>
      </div>

      {/* Content Overlay - Dark Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-black/90 via-black/50 to-transparent backdrop-blur-[2px] z-20 p-6 flex flex-col justify-end">
        <Link href={`/product/${slug}`} className="block">
          <h3 style={{ color: "white" }} className="text-2xl font-black capitalize drop-shadow-md mb-1 truncate tracking-wide !text-white">{name}</h3>
          <p className="text-white/90 text-sm mb-4 line-clamp-2 drop-shadow-sm font-medium">
            {description || "Handcrafted silicone reborn baby with lifelike details."}
          </p>
        </Link>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white drop-shadow-md">
            ${(price || 0).toFixed(0)}
          </span>
          <Button
            onClick={handleAddToCart}
            className="bg-pink-600 hover:bg-pink-700 text-white border-none rounded-full px-5 py-2 h-10 font-bold shadow-lg flex items-center gap-2 text-sm backdrop-blur-sm transition-all hover:scale-105"
          >
            <FaShoppingCart className="text-lg " />
            <span className="hidden sm:inline">Add to Cart</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

