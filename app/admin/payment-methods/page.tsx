"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { Modal } from "@/components/ui/modal";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-input";
import { ImageUpload } from "@/components/admin/image-upload";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Image from "next/image";

export default function ManagePaymentMethodsPage() {
    const [methods, setMethods] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMethod, setEditingMethod] = useState<any | null>(null);

    // Form State
    const [name, setName] = useState("");

    // const [details, setDetails] = useState(""); // Removed
    const [logoUrl, setLogoUrl] = useState("");
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        fetchMethods();
    }, []);

    const fetchMethods = async () => {
        try {
            const res = await fetch("/api/admin/payment-methods");
            if (res.ok) {
                const data = await res.json();
                setMethods(data);
            }
        } catch (error) {
            console.error("Failed to fetch payment methods:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (method: any) => {
        setEditingMethod(method);
        setName(method.name);
        setEditingMethod(method);
        setName(method.name);
        // setDetails(method.details); // Removed
        setLogoUrl(method.logoUrl || "");
        setIsActive(method.isActive);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this payment method?")) return;

        try {
            const res = await fetch(`/api/admin/payment-methods?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setMethods(methods.filter((m) => m._id !== id));
            } else {
                alert("Failed to delete payment method");
            }
        } catch (error) {
            console.error("Error deleting payment method:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            name,
            logoUrl,
            isActive,
        };

        try {
            const url = editingMethod
                ? `/api/admin/payment-methods?id=${editingMethod._id}`
                : "/api/admin/payment-methods";

            const method = editingMethod ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                fetchMethods();
                setIsModalOpen(false);
                resetForm();
            } else {
                const error = await res.json();
                alert(error.error || "Failed to save payment method");
            }
        } catch (error) {
            console.error("Error saving payment method:", error);
        }
    };

    const resetForm = () => {
        setEditingMethod(null);
        setName("");
        setEditingMethod(null);
        setName("");
        // setDetails(""); // Removed
        setLogoUrl("");
        setIsActive(true);
    };

    const columns = [
        {
            header: "Logo",
            accessor: (row: any) => (
                row.logoUrl ? (
                    <div className="w-12 h-12 relative rounded-md overflow-hidden border border-gray-200">
                        <Image src={row.logoUrl} alt="Logo" fill className="object-cover" />
                    </div>
                ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">
                        No Logo
                    </div>
                )
            ),
        },
        { header: "Name", accessor: (row: any) => row.name },
        {
            header: "Status",
            accessor: (row: any) => (
                <span className={`px-2 py-1 rounded-full text-xs ${row.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {row.isActive ? 'Active' : 'Inactive'}
                </span>
            )
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
                    <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
                    <p className="text-gray-500">Manage payment options for checkout</p>
                </div>
                <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
                    <FaPlus className="mr-2" /> Add Method
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={methods}
                    isLoading={isLoading}
                    keyField="_id"
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingMethod ? "Edit Payment Method" : "Add Payment Method"}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormInput
                        label="Method Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Bank Transfer, PayPal"
                        required
                    />

                    {/* Details field removed as requested */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Logo (Optional)
                        </label>
                        <ImageUpload
                            value={logoUrl ? [logoUrl] : []}
                            onChange={(urls) => setLogoUrl(urls[0] || "")}
                            maxFiles={1}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="w-4 h-4 text-pink-600 rounded border-gray-300 focus:ring-pink-500"
                        />
                        <label htmlFor="isActive" className="text-sm text-gray-700">
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
                            {editingMethod ? "Update Method" : "Add Method"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
