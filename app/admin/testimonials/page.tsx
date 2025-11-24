"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { FormInput, FormTextarea, FormSelect } from "@/components/ui/form-input";
import { Modal } from "@/components/ui/modal";
import { FaPlus, FaStar } from "react-icons/fa";

export default function ManageTestimonialsPage() {
    const [testimonials, setTestimonials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        role: "",
        content: "",
        rating: 5,
    });

    const fetchTestimonials = async () => {
        try {
            const res = await fetch("/api/admin/testimonials");
            if (res.ok) {
                const data = await res.json();
                setTestimonials(data);
            }
        } catch (error) {
            console.error("Failed to fetch testimonials:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleEdit = (item: any) => {
        setEditingId(item._id);
        setFormData({
            name: item.name,
            role: item.role,
            content: item.content,
            rating: item.rating,
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: "", role: "", content: "", rating: 5 });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const url = editingId
                ? `/api/admin/testimonials?id=${editingId}`
                : "/api/admin/testimonials";

            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                handleCloseModal();
                fetchTestimonials();
            } else {
                alert("Failed to save testimonial");
            }
        } catch (error) {
            console.error("Error saving testimonial:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (item: any) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;

        try {
            const res = await fetch(`/api/admin/testimonials?id=${item._id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchTestimonials();
            } else {
                alert("Failed to delete testimonial");
            }
        } catch (error) {
            console.error("Error deleting testimonial:", error);
        }
    };

    const columns = [
        {
            header: "Author",
            accessor: (item: any) => (
                <div>
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.role}</div>
                </div>
            ),
        },
        {
            header: "Rating",
            accessor: (item: any) => (
                <div className="flex text-yellow-400 text-sm">
                    {[...Array(item.rating)].map((_, i) => (
                        <FaStar key={i} />
                    ))}
                </div>
            ),
        },
        {
            header: "Content",
            accessor: (item: any) => (
                <p className="text-sm text-gray-600 line-clamp-2 max-w-md">
                    {item.content}
                </p>
            ),
        },
        {
            header: "Date",
            accessor: (item: any) => (
                <span className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                </span>
            ),
        },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                        Testimonials
                    </h1>
                    <p className="text-gray-500">Manage customer reviews.</p>
                </div>
                <Button onClick={() => { setEditingId(null); setIsModalOpen(true); }} className="flex items-center gap-2">
                    <FaPlus /> Add Testimonial
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Loading testimonials...</div>
                ) : testimonials.length > 0 ? (
                    <DataTable
                        data={testimonials}
                        columns={columns}
                        keyField="_id"
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        isLoading={isLoading}
                    />
                ) : (
                    <div className="p-12 text-center">
                        <p className="text-gray-500 mb-4">No testimonials yet.</p>
                        <Button variant="outline" onClick={() => { setEditingId(null); setIsModalOpen(true); }}>
                            Add your first testimonial
                        </Button>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingId ? "Edit Testimonial" : "Add Testimonial"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormInput
                        id="name"
                        label="Name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <FormInput
                        id="role"
                        label="Role (e.g. Happy Mom)"
                        required
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    />
                    <FormSelect
                        id="rating"
                        label="Rating"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                        options={[
                            { value: "5", label: "5 Stars" },
                            { value: "4", label: "4 Stars" },
                            { value: "3", label: "3 Stars" },
                            { value: "2", label: "2 Stars" },
                            { value: "1", label: "1 Star" },
                        ]}
                    />
                    <FormTextarea
                        id="content"
                        label="Content"
                        required
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={4}
                    />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCloseModal}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Testimonial"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
