"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { FaPlus } from "react-icons/fa";

export default function ManageProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/admin/products");
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (product: any) => {
        if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

        try {
            const res = await fetch(`/api/admin/products?id=${product._id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchProducts(); // Refresh list
            } else {
                alert("Failed to delete product");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const columns = [
        {
            header: "Image",
            accessor: (product: any) => (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                    {product.images?.[0] && (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    )}
                </div>
            ),
        },
        {
            header: "Name",
            accessor: (product: any) => (
                <div>
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.slug}</div>
                </div>
            ),
        },
        {
            header: "Price",
            accessor: (product: any) => (
                <span className="font-medium">${product.price.toFixed(2)}</span>
            ),
        },
        {
            header: "Status",
            accessor: (product: any) => (
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
          ${product.status === "active"
                            ? "bg-green-100 text-green-800"
                            : product.status === "sold_out"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                >
                    {product.status.replace("_", " ")}
                </span>
            ),
        },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                        Products
                    </h1>
                    <p className="text-gray-500">Manage your babies inventory.</p>
                </div>
                <Link href="/admin/babies/add">
                    <Button className="flex items-center gap-2">
                        <FaPlus /> Add Baby
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Loading products...</div>
                ) : products.length > 0 ? (
                    <DataTable
                        data={products}
                        columns={columns}
                        keyField="_id"
                        onDelete={handleDelete}
                        onEdit={(product) => router.push(`/admin/products/edit/${product._id}`)}
                        isLoading={isLoading}
                    />
                ) : (
                    <div className="p-12 text-center">
                        <p className="text-gray-500 mb-4">No babies found.</p>
                        <Link href="/admin/babies/add">
                            <Button variant="outline">Add your first baby</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
