"use client";

import { useState, useEffect, FormEvent } from "react";
import { FormInput, FormTextarea } from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaFacebook, FaPinterest } from "react-icons/fa";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Send contact form via EmailJS or API route
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitStatus({
        type: "success",
        message: "Thank you! Your message has been sent. We'll get back to you soon.",
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ type: null, message: "" });
      }, 5000);

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "There was an error sending your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [socials, setSocials] = useState<any[]>([]);

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const res = await fetch("/api/admin/socials");
        if (res.ok) {
          const data = await res.json();
          setSocials(data.filter((s: any) => s.active));
        }
      } catch (error) {
        console.error("Failed to fetch socials:", error);
      }
    };

    fetchSocials();
  }, []);

  const iconMap: any = {
    FaTiktok: <FaInstagram />, // Fallback
    FaFacebook: <FaFacebook />,
    FaInstagram: <FaInstagram />,
    FaTwitter: <FaPinterest />, // Fallback
    FaPinterest: <FaPinterest />,
    FaYoutube: <FaPinterest />, // Fallback
  };

  return (
    <div className="w-full max-w-viewport mx-auto">
      <div className="text-center mb-16">
        <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/owners-logo/Joannas Reborns Logo.jpg"
            alt="Joanna's Reborns"
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif mb-4 text-gray-900">Get In Touch</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Have a question about Joanna's Reborns or your order? We'd love to
          hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl shadow-sm border border-pink-100">
          <h2 className="text-2xl font-serif mb-6 text-gray-800">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                id="name"
                name="name"
                label="Your Name"
                type="text"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />
              <FormInput
                id="email"
                name="email"
                label="Your Email"
                type="email"
                placeholder="john.doe@example.com"
                required
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
            </div>
            <FormInput
              id="subject"
              name="subject"
              label="Subject"
              type="text"
              placeholder="Inquiry about Reborn Baby"
              required
              value={formData.subject}
              onChange={handleChange}
              error={errors.subject}
            />
            <FormTextarea
              id="message"
              name="message"
              label="Your Message"
              placeholder="Type your message here..."
              required
              rows={6}
              value={formData.message}
              onChange={handleChange}
              error={errors.message}
            />

            {submitStatus.type && (
              <div
                className={`p-4 rounded-lg border ${submitStatus.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
                  }`}
              >
                <p className="mb-0 text-sm font-medium">{submitStatus.message}</p>
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-8">
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl border border-pink-100 shadow-sm">
            <h3 className="text-2xl font-serif mb-6 text-gray-800">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-pink-500 shadow-sm group-hover:scale-110 transition-transform">
                  <FaEnvelope />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Email Us</p>
                  <a
                    href="mailto:info@joannasreborns.com"
                    className="text-gray-600 hover:text-pink-600 transition-colors no-underline"
                  >
                    info@joannasreborns.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-pink-500 shadow-sm group-hover:scale-110 transition-transform">
                  <FaPhone />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Call Us</p>
                  <a
                    href="tel:+15551234567"
                    className="text-gray-600 hover:text-pink-600 transition-colors no-underline"
                  >
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-pink-500 shadow-sm group-hover:scale-110 transition-transform">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Visit Us</p>
                  <p className="text-gray-600 mb-0">
                    123 Artisan Lane<br />
                    Craftville, CA 90210
                  </p>
                  <p className="text-xs text-gray-400 mt-2 italic">
                    (Studio visits by appointment only)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
            <h3 className="text-xl font-serif mb-6 text-gray-800">Follow Our Journey</h3>
            <div className="flex justify-center gap-6">
              {socials.map((social) => (
                <a
                  key={social._id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-all hover:-translate-y-1"
                >
                  {social.imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={social.imageUrl}
                      alt={social.platform}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    iconMap[social.icon] || <FaFacebook />
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
