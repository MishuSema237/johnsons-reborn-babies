"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { Modal } from "@/components/ui/modal";
import { FormInput } from "@/components/ui/form-input";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function ManageSocialsPage() {
    const [socials, setSocials] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSocial, setEditingSocial] = useState<any | null>(null);

    // Form State
    const [platform, setPlatform] = useState("");
    const [url, setUrl] = useState("");
    const [icon, setIcon] = useState("FaFacebook"); // Default
    const [active, setActive] = useState(true);

    const iconOptions = [
        { label: "Facebook", value: "FaFacebook" },
        { label: "Instagram", value: "FaInstagram" },
        { label: "Twitter/X", value: "FaTwitter" },
        { label: "TikTok", value: "FaTiktok" },
        { label: "Pinterest", value: "FaPinterest" },
        { label: "YouTube", value: "FaYoutube" },
    ];

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

    const handleEdit = (social: any) => {
        setEditingSocial(social);
        setPlatform(social.platform);
        setUrl(social.url);
        setIcon(social.icon);
        setActive(social.active);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this social link?")) return;

        try {
            const res = await fetch(`/api/admin/socials?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setSocials(socials.filter((s) => s._id !== id));
            } else {
                alert("Failed to delete social link");
            }
        } catch (error) {
            console.error("Error deleting social link:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            platform,
            url,
            icon,
            active,
        };

        try {
            const url = editingSocial
                ? `/api/admin/socials?id=${editingSocial._id}`
                : "/api/admin/socials";

            const method = editingSocial ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                fetchSocials();
                setIsModalOpen(false);
                resetForm();
            } else {
                const error = await res.json();
                alert(error.error || "Failed to save social link");
            }
        } catch (error) {
            console.error("Error saving social link:", error);
        }
    };

    const resetForm = () => {
        setEditingSocial(null);
        setPlatform("");
        setUrl("");
        setIcon("FaFacebook");
        setActive(true);
    };

    const columns = [
        { header: "Platform", accessor: (row: any) => row.platform },
        { header: "URL", accessor: (row: any) => row.url },
        {
            header: "Status",
            accessor: (row: any) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs ${row.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                >
                    {row.active ? "Active" : "Inactive"}
                </span>
            ),
        },
        {
            header: "Actions",
            accessor: (row: any) => (
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => handleEdit(row)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={() => handleDelete(row._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                        <FaTrash />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Social Media</h1>
                    <p className="text-gray-500">Manage social media links</p>
                </div>
                <Button
                    onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                    }}
                >
                    <FaPlus className="mr-2" /> Add Social
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <DataTable columns={columns} data={socials} isLoading={isLoading} keyField="_id" />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingSocial ? "Edit Social Link" : "Add Social Link"}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormInput
                        label="Platform Name"
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        placeholder="e.g., Facebook"
                        required
                    />

                    <FormInput
                        label="URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://..."
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Icon
                        </label>
                        <select
                            value={icon}
                            onChange={(e) => setIcon(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                        >
                            {iconOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="active"
                            checked={active}
                            onChange={(e) => setActive(e.target.checked)}
                            className="w-4 h-4 text-pink-600 rounded border-gray-300 focus:ring-pink-500"
                        />
                        <label htmlFor="active" className="text-sm text-gray-700">
                            Active
                        </label>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            {editingSocial ? "Update Social" : "Add Social"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
