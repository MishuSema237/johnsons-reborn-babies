"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FormInput, FormTextarea, FormSelect } from "@/components/ui/form-input";
import { ImageUpload } from "@/components/admin/image-upload";

export default function AddBabyPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        price: "",
        description: "",
        detailedDescription: "",
        materialsAndCare: "",
        shippingInfo: "",
        testimonial: {
            quote: "",
            author: "",
            title: "",
        },
        images: [] as string[],
        status: "active",
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/admin/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to create product");
            }

            router.push("/admin/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-serif font-bold mb-8 text-gray-900">Add New Baby</h1>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm">
                <div className="block lg:grid lg:grid-cols-2 gap-6">
                    <FormInput
                        id="name"
                        name="name"
                        label="Name"
                        required
                        value={formData.name}
                        onChange={(e) => {
                            const name = e.target.value;
                            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                            setFormData({ ...formData, name, slug });
                        }}
                    />

                    <FormInput
                        id="slug"
                        name="slug"
                        label="Slug (URL friendly)"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    />
                    <p className="text-xs text-gray-500 mt-1 col-span-2 -mt-4">
                        The "slug" is the URL-friendly version of the name (e.g., "ella-realistic-newborn"). It is auto-generated but you can edit it.
                    </p>
                </div>

                <FormInput
                    id="price"
                    name="price"
                    label="Price ($)"
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />

                <FormTextarea
                    id="description"
                    label="Short Description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                />

                <FormTextarea
                    id="detailedDescription"
                    label="Detailed Description"
                    value={formData.detailedDescription}
                    onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                    rows={5}
                />

                <FormTextarea
                    id="materialsAndCare"
                    label="Materials & Care"
                    value={formData.materialsAndCare}
                    onChange={(e) => setFormData({ ...formData, materialsAndCare: e.target.value })}
                    rows={4}
                />

                <FormTextarea
                    id="shippingInfo"
                    label="Shipping Information"
                    value={formData.shippingInfo}
                    onChange={(e) => setFormData({ ...formData, shippingInfo: e.target.value })}
                    rows={3}
                />

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Testimonial (Optional)</h3>
                    <FormTextarea
                        id="testimonialQuote"
                        label="Quote"
                        value={formData.testimonial.quote}
                        onChange={(e) => setFormData({
                            ...formData,
                            testimonial: { ...formData.testimonial, quote: e.target.value }
                        })}
                        rows={3}
                    />
                    <div className="block lg:grid lg:grid-cols-2 gap-6">
                        <FormInput
                            id="testimonialAuthor"
                            label="Author Name"
                            value={formData.testimonial.author}
                            onChange={(e) => setFormData({
                                ...formData,
                                testimonial: { ...formData.testimonial, author: e.target.value }
                            })}
                        />
                        <FormInput
                            id="testimonialTitle"
                            label="Author Title (e.g. Collector)"
                            value={formData.testimonial.title}
                            onChange={(e) => setFormData({
                                ...formData,
                                testimonial: { ...formData.testimonial, title: e.target.value }
                            })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                    <ImageUpload
                        value={formData.images}
                        onChange={(urls) => setFormData({ ...formData, images: urls })}
                    />
                </div>

                <FormSelect
                    id="status"
                    label="Status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    options={[
                        { value: "active", label: "Active" },
                        { value: "inactive", label: "Inactive" },
                        { value: "sold_out", label: "Sold Out" },
                    ]}
                />

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Baby"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
