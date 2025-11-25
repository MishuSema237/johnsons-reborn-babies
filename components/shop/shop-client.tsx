"use client";

import { useState, useMemo } from "react";
import { ProductGrid } from "@/components/sections/product-grid";
import { FormInput, FormSelect } from "@/components/ui/form-input";
import { FaSearch, FaFilter } from "react-icons/fa";

interface ShopClientProps {
    initialProducts: any[];
}

export function ShopClient({ initialProducts }: ShopClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("newest");
    const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({
        min: "",
        max: "",
    });

    const filteredProducts = useMemo(() => {
        let result = [...initialProducts];

        // Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(query) ||
                    p.description?.toLowerCase().includes(query)
            );
        }

        // Price Filter
        if (priceRange.min) {
            result = result.filter((p) => p.price >= Number(priceRange.min));
        }
        if (priceRange.max) {
            result = result.filter((p) => p.price <= Number(priceRange.max));
        }

        // Sort
        switch (sortOption) {
            case "price-asc":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                result.sort((a, b) => b.price - a.price);
                break;
            case "name-asc":
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "newest":
            default:
                // Assuming initialProducts is already sorted by newest or has createdAt
                result.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                break;
        }

        return result;
    }, [initialProducts, searchQuery, priceRange, sortOption]);

    return (
        <div className="w-full max-w-viewport mx-auto px-4 py-12">
            <h1 className="text-center text-4xl md:text-5xl font-serif mb-4 text-gray-900">
                Our Collection
            </h1>
            <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
                Discover our handcrafted silicone reborn babies, each one a unique masterpiece waiting to be loved.
            </p>

            {/* Filters & Search Bar */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-12">
                <div className="flex flex-col gap-4">
                    {/* Search - Full Width on Mobile */}
                    <div className="relative w-full">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <FaSearch />
                        </div>
                        <input
                            type="text"
                            placeholder="Search babies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-12 gap-4 items-center">
                        {/* Price Range */}
                        <div className="col-span-1 md:col-span-4 flex gap-2 items-center">
                            <input
                                type="number"
                                placeholder="Min"
                                value={priceRange.min}
                                onChange={(e) =>
                                    setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                                }
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={priceRange.max}
                                onChange={(e) =>
                                    setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                                }
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        {/* Sort */}
                        <div className="col-span-1 md:col-span-4 md:col-start-9">
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all cursor-pointer bg-white"
                            >
                                <option value="newest">Newest Arrivals</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="name-asc">Name: A to Z</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results */}
            {filteredProducts.length > 0 ? (
                <ProductGrid products={filteredProducts} showViewAll={false} mobileLayout="grid" />
            ) : (
                <div className="text-center py-24 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <div className="text-gray-300 text-6xl mb-4 flex justify-center">
                        <FaSearch />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                        No matches found
                    </h3>
                    <p className="text-gray-500">
                        Try adjusting your search or filters to find what you're looking for.
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery("");
                            setPriceRange({ min: "", max: "" });
                            setSortOption("newest");
                        }}
                        className="mt-6 text-pink-600 hover:text-pink-700 font-medium hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    );
}
