"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { Modal } from "@/components/ui/modal";
import { FormInput, FormTextarea } from "@/components/ui/form-input";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function ManageFAQsPage() {
    const [faqs, setFaqs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<any | null>(null);

    // Form State
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [order, setOrder] = useState(0);
    const [active, setActive] = useState(true);

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            const res = await fetch("/api/admin/faqs");
            if (res.ok) {
                const data = await res.json();
                setFaqs(data);
            }
        } catch (error) {
            console.error("Failed to fetch FAQs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (faq: any) => {
        setEditingFaq(faq);
        setQuestion(faq.question);
        setAnswer(faq.answer);
        setOrder(faq.order);
        setActive(faq.active);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this FAQ?")) return;

        try {
            const res = await fetch(`/api/admin/faqs?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setFaqs(faqs.filter((f) => f._id !== id));
            } else {
                alert("Failed to delete FAQ");
            }
        } catch (error) {
            console.error("Error deleting FAQ:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            question,
            answer,
            order: Number(order),
            active,
        };

        try {
            const url = editingFaq
                ? `/api/admin/faqs?id=${editingFaq._id}`
                : "/api/admin/faqs";

            const method = editingFaq ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                fetchFaqs();
                setIsModalOpen(false);
                resetForm();
            } else {
                const error = await res.json();
                alert(error.error || "Failed to save FAQ");
            }
        } catch (error) {
            console.error("Error saving FAQ:", error);
        }
    };

    const resetForm = () => {
        setEditingFaq(null);
        setQuestion("");
        setAnswer("");
        setOrder(0);
        setActive(true);
    };

    const columns = [
        { header: "Question", accessor: (row: any) => row.question },
        { header: "Order", accessor: (row: any) => row.order },
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
                    <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
                    <p className="text-gray-500">Manage frequently asked questions</p>
                </div>
                <Button
                    onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                    }}
                >
                    <FaPlus className="mr-2" /> Add FAQ
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <DataTable columns={columns} data={faqs} isLoading={isLoading} keyField="_id" />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingFaq ? "Edit FAQ" : "Add FAQ"}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormInput
                        label="Question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="e.g., What is your return policy?"
                        required
                    />

                    <FormTextarea
                        label="Answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Enter the answer..."
                        required
                        rows={4}
                    />

                    <FormInput
                        label="Order"
                        type="number"
                        value={order}
                        onChange={(e) => setOrder(Number(e.target.value))}
                        required
                    />

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
                            {editingFaq ? "Update FAQ" : "Add FAQ"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
