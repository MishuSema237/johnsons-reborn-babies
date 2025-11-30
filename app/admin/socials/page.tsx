"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FaTrash, FaEdit } from "react-icons/fa";

interface SocialMedia {
    _id: string;
    platform: string;
    url: string;
    icon?: string;
    svgContent?: string;
    imageUrl?: string;
    active: boolean;
}

export default function AdminSocialsPage() {
    const [socials, setSocials] = useState<SocialMedia[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        platform: "",
        url: "",
        icon: "",
        imageUrl: "",
    });
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchSocials();
    }, []);

    const fetchSocials = async () => {
        try {
            const res = await fetch("/api/admin/socials");
            if (res.ok) {
                const data = await res.json();
                setSocials(data);
            }
        } catch (error) {
            console.error("Failed to fetch socials:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setFormData((prev) => ({ ...prev, imageUrl: data.url }));
            } else {
                throw new Error("Upload failed");
            }
        } catch (err) {
            console.error("Upload error:", err);
            setError("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const url = editingId
                ? `/api/admin/socials?id=${editingId}`
                : "/api/admin/socials";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to save social media");
            }

            await fetchSocials();
            resetForm();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (social: SocialMedia) => {
        setEditingId(social._id);
        setFormData({
            platform: social.platform,
            url: social.url,
            icon: social.icon || "",
            imageUrl: social.imageUrl || "",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this social media link?")) return;

        try {
            const res = await fetch(`/api/admin/socials?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchSocials();
            }
        } catch (error) {
            console.error("Failed to delete social:", error);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({ platform: "", url: "", icon: "", imageUrl: "" });
        setError("");
        // Reset file input if possible, or just let it be
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Manage Social Media</h1>

            {/* Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                <h2 className="text-lg font-semibold mb-4">
                    {editingId ? "Edit Social Media" : "Add New Social Media"}
                </h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                            id="platform"
                            name="platform"
                            label="Platform Name"
                            placeholder="e.g., Facebook"
                            value={formData.platform}
                            onChange={handleChange}
                            required
                        />
                        <FormInput
                            id="url"
                            name="url"
                            label="URL"
                            placeholder="https://..."
                            value={formData.url}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-sm font-medium text-gray-700 block mb-2">
                            Logo Image
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-pink-50 file:text-pink-700
                                    hover:file:bg-pink-100
                                "
                            />
                            {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
                        </div>
                        {formData.imageUrl && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-1">Current Image URL:</p>
                                <input
                                    type="text"
                                    value={formData.imageUrl}
                                    readOnly
                                    className="w-full text-xs p-2 bg-gray-50 border rounded text-gray-500 mb-2"
                                />
                                <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={formData.imageUrl}
                                    alt="Preview"
                                    className="w-16 h-16 object-contain border border-gray-200 rounded p-1"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button type="submit" disabled={isSubmitting || uploading}>
                            {isSubmitting ? "Saving..." : editingId ? "Update Link" : "Add Link"}
                        </Button>
                        {editingId && (
                            <Button type="button" variant="outline" onClick={resetForm}>
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                                <th className="p-4">Icon</th>
                                <th className="p-4">Platform</th>
                                <th className="p-4">URL</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : socials.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        No social media links found. Add one above.
                                    </td>
                                </tr>
                            ) : (
                                socials.map((social) => (
                                    <tr key={social._id} className="hover:bg-gray-50">
                                        <td className="p-4">
                                            {social.imageUrl ? (
                                                /* eslint-disable-next-line @next/next/no-img-element */
                                                <img
                                                    src={social.imageUrl}
                                                    alt={social.platform}
                                                    className="w-8 h-8 object-contain"
                                                />
                                            ) : social.svgContent ? (
                                                <div
                                                    className="w-6 h-6 text-gray-600"
                                                    dangerouslySetInnerHTML={{ __html: social.svgContent }}
                                                />
                                            ) : (
                                                <span className="text-xs text-gray-400">No Icon</span>
                                            )}
                                        </td>
                                        <td className="p-4 font-medium">{social.platform}</td>
                                        <td className="p-4 text-gray-500 truncate max-w-xs">
                                            {social.url}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(social)}
                                                    className="text-blue-600 hover:text-blue-800 p-1"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(social._id)}
                                                    className="text-red-600 hover:text-red-800 p-1"
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
