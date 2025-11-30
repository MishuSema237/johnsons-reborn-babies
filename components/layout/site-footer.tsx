"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaTiktok, FaFacebookF, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt, FaTwitter, FaPinterest, FaYoutube } from "react-icons/fa";

const iconMap: any = {
  FaTiktok: <FaTiktok />,
  FaFacebook: <FaFacebookF />,
  FaInstagram: <FaInstagram />,
  FaTwitter: <FaTwitter />,
  FaPinterest: <FaPinterest />,
  FaYoutube: <FaYoutube />,
};

export function SiteFooter() {
  const pathname = usePathname();
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

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 mt-14">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand Section */}
        <div className="space-y-4">
          <div className="flex flex-col items-center md:items-start">
            <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/owners-logo/Joannas Reborns Logo.jpg"
                alt="Joanna's Reborns"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-pink-100 text-sm leading-relaxed max-w-xs text-center md:text-left">
              Handcrafted with love, bringing comfort and joy to your arms. Each baby is a unique masterpiece of healing art.
            </p>
          </div>
          <div className="flex gap-4 pt-4">
            {socials.map((social) => (
              <a
                key={social._id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.platform}
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-pink-500 hover:bg-pink-600 hover:text-white transition-all duration-300 overflow-hidden"
              >
                {social.imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={social.imageUrl}
                    alt={social.platform}
                    className="w-full h-full object-cover"
                  />
                ) : social.svgContent ? (
                  <div
                    className="w-5 h-5 fill-current"
                    dangerouslySetInnerHTML={{ __html: social.svgContent }}
                  />
                ) : (
                  iconMap[social.icon] || <span className="text-xs">{social.platform[0]}</span>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-medium mb-14">Quick Links</h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li>
              <Link href="/" className="text-gray-300 hover:text-pink-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/shop" className="text-gray-300 hover:text-pink-400 transition-colors">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="text-gray-300 hover:text-pink-400 transition-colors">
                Gallery
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-300 hover:text-pink-400 transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-gray-300 hover:text-pink-400 transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/track-order" className="text-gray-300 hover:text-pink-400 transition-colors">
                Track Order
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-medium mb-6">Contact Us</h4>
          <ul className="space-y-4 text-sm text-gray-300">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 text-pink-500" />
              <span>123 Artisan Way,<br />Creative District, NY 10001</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhone className="text-pink-500" />
              <span>+1 (555) 123-4567</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-pink-500" />
              <span>hello@rebornbabies.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} Reborn Babies Studio. All rights reserved.</p>
      </div>
    </footer>
  );
}
