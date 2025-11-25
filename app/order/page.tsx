"use client";

import { useState, useEffect, FormEvent } from "react";
import { useCart } from "@/lib/context/cart-context";
import { CartItemComponent } from "@/components/cart/cart-item";
import { FormInput, FormSelect, RadioOption } from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { FaInfoCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";

const countries = [
  { value: "", label: "Select a country" },
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "GB", label: "United Kingdom" },
  { value: "AU", label: "Australia" },
  { value: "NZ", label: "New Zealand" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "IT", label: "Italy" },
  { value: "ES", label: "Spain" },
  { value: "OTHER", label: "Other" },
];

export default function OrderPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtherPayment, setShowOtherPayment] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "", isError: false });

  const subtotal = getTotal();
  const estimatedShipping = 50; // This could be calculated based on location
  const total = subtotal + estimatedShipping;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    paymentMethod: "",
    customPaymentMethod: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const res = await fetch("/api/admin/payment-methods");
        if (res.ok) {
          const data = await res.json();
          setPaymentMethods(data.filter((m: any) => m.isActive));
        }
      } catch (error) {
        console.error("Failed to fetch payment methods:", error);
      }
    };

    fetchPaymentMethods();
  }, []);

  if (items.length === 0) {
    return (
      <div className="w-full max-w-viewport mx-auto text-center py-12">
        <h1 className="mb-4">Your Cart is Empty</h1>
        <p className="mb-8 text-gray-500">
          Add items to your cart before placing an order.
        </p>
        <Button href="/shop">Continue Shopping</Button>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Show/hide other payment method field
    if (name === "paymentMethod") {
      setShowOtherPayment(value === "other");
      if (value !== "other") {
        setFormData((prev) => ({ ...prev, customPaymentMethod: "" }));
      }
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.streetAddress.trim())
      newErrors.streetAddress = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "Zip code is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.paymentMethod)
      newErrors.paymentMethod = "Payment method is required";
    if (formData.paymentMethod === "other" && !formData.customPaymentMethod.trim())
      newErrors.customPaymentMethod = "Please specify payment method";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          attributes: item.attributes,
        })),
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone || undefined,
        },
        shipping: {
          address: formData.streetAddress,
          city: formData.city,
          state: formData.state || undefined,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        payment: {
          preferredMethod:
            formData.paymentMethod === "other"
              ? formData.customPaymentMethod
              : formData.paymentMethod,
          customMethod:
            formData.paymentMethod === "other"
              ? formData.customPaymentMethod
              : undefined,
          totalAmount: total,
        },
      };

      // Submit order
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit order");
      }

      const result = await response.json();

      // Redirect to confirmation
      router.push(`/order/${result.orderReference}`);
    } catch (error) {
      console.error("Order submission error:", error);
      setModalContent({
        title: "Order Submission Failed",
        message: "There was an error submitting your order. Please try again.",
        isError: true
      });
      setModalOpen(true);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-viewport mx-auto">
      <h1 className="mb-12">Your Order Request</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            {/* Cart Items */}
            <div className="mb-12">
              <h2 className="mb-8">1. Your Items</h2>
              <div className="space-y-0">
                {items.map((item) => (
                  <CartItemComponent key={item.id} item={item} />
                ))}
              </div>
              <div className="text-right font-medium pt-4 border-t border-gray-300 mt-4">
                <p className="mb-0">Subtotal: ${subtotal.toFixed(2)}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-12">
              <h2 className="mb-8">2. Contact Information</h2>
              <FormInput
                id="fullName"
                name="fullName"
                label="Full Name"
                type="text"
                placeholder="Jane Doe"
                required
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
              />
              <FormInput
                id="email"
                name="email"
                label="Email Address"
                type="email"
                placeholder="jane.doe@example.com"
                required
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <FormInput
                id="phone"
                name="phone"
                label="Phone Number"
                type="tel"
                placeholder="(123) 456-7890"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
              />
            </div>

            {/* Shipping Address */}
            <div className="mb-12">
              <h2 className="mb-8">3. Shipping Address</h2>
              <FormInput
                id="streetAddress"
                name="streetAddress"
                label="Street Address"
                type="text"
                placeholder="123 Main St"
                required
                value={formData.streetAddress}
                onChange={handleChange}
                error={errors.streetAddress}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                  id="city"
                  name="city"
                  label="City"
                  type="text"
                  placeholder="Anytown"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  error={errors.city}
                />
                <FormInput
                  id="state"
                  name="state"
                  label="State / Province"
                  type="text"
                  placeholder="State/Province"
                  value={formData.state}
                  onChange={handleChange}
                  error={errors.state}
                />
                <FormInput
                  id="zipCode"
                  name="zipCode"
                  label="Zip / Postal Code"
                  type="text"
                  placeholder="12345"
                  required
                  value={formData.zipCode}
                  onChange={handleChange}
                  error={errors.zipCode}
                />
              </div>
              <FormSelect
                id="country"
                name="country"
                label="Country"
                required
                options={countries}
                value={formData.country}
                onChange={handleChange}
                error={errors.country}
              />
            </div>

            {/* Payment Method */}
            <div className="mb-12">
              <h2 className="mb-4">4. Preferred Payment Method</h2>
              <p className="text-sm text-gray-500 mb-6">
                We will contact you to arrange payment. Please indicate your
                preferred method below.
              </p>

              {paymentMethods.map((method) => (
                <div key={method._id} className="flex items-center mb-4">
                  <input
                    type="radio"
                    id={method.name}
                    name="paymentMethod"
                    value={method.name}
                    checked={formData.paymentMethod === method.name}
                    onChange={handleChange}
                    className="w-4 h-4 text-pink-600 border-gray-300 focus:ring-pink-500"
                  />
                  <label htmlFor={method.name} className="ml-3 flex items-center gap-3 cursor-pointer">
                    {method.logoUrl && (
                      <div className="w-8 h-8 relative rounded-md overflow-hidden border border-gray-200">
                        <Image src={method.logoUrl} alt={method.name} fill className="object-cover" />
                      </div>
                    )}
                    <span className="text-gray-900 font-medium">{method.name}</span>
                  </label>
                </div>
              ))}

              <RadioOption
                id="otherPayment"
                name="paymentMethod"
                value="other"
                label="Other (please specify):"
                checked={formData.paymentMethod === "other"}
                onChange={handleChange}
              />

              {showOtherPayment && (
                <div className="ml-6 mt-2">
                  <FormInput
                    id="customPaymentMethod"
                    name="customPaymentMethod"
                    label=""
                    type="text"
                    placeholder="e.g., Wise, Zelle, etc."
                    required={showOtherPayment}
                    value={formData.customPaymentMethod}
                    onChange={handleChange}
                    error={errors.customPaymentMethod}
                  />
                </div>
              )}

              {errors.paymentMethod && (
                <p className="text-sm text-red-600 mt-2 mb-0">
                  {errors.paymentMethod}
                </p>
              )}

              <div className="mt-6 p-4 bg-gray-100 border border-gray-300">
                <p className="text-sm text-black mb-0 flex items-start">
                  <FaInfoCircle className="mr-2 mt-0.5 flex-shrink-0" />
                  By clicking 'Place Order Request', you initiate an order, and
                  we will contact you with payment details. No immediate payment
                  will be taken.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-pink-50 p-6 border border-pink-200 sticky top-6 rounded-xl shadow-sm">
              <h2 className="mb-8">Order Summary</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Estimated Shipping</span>
                  <span>${estimatedShipping.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-300 pt-4 mt-4">
                <div className="flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Place Order Request"}
              </Button>

              {/* Trust Badges */}
              <div className="flex justify-center gap-4 mt-6">
                <div className="w-20 h-6 bg-gray-300 flex items-center justify-center text-xs text-gray-500">
                  Secure
                </div>
                <div className="w-20 h-6 bg-gray-300 flex items-center justify-center text-xs text-gray-500">
                  Trusted
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent.title}
      >
        <div className="text-center">
          <p className={`mb-6 ${modalContent.isError ? "text-red-600" : "text-gray-700"}`}>
            {modalContent.message}
          </p>
          <Button onClick={() => setModalOpen(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}

