import { Link } from "react-router-dom";
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";

const footerLinks = {
  shop: [
    { name: "Bags", href: "/shop?category=bags" },
    { name: "Hats", href: "/shop?category=hats" },
    { name: "Clothing", href: "/shop?category=clothing" },
    { name: "Flowers", href: "/shop?category=flowers" },
    { name: "Home Décor", href: "/shop?category=home" },
    { name: "Baby", href: "/shop?category=baby" },
  ],
  help: [
    { name: "FAQs", href: "/faq" },
    { name: "Shipping", href: "/shipping" },
    { name: "Returns", href: "/returns" },
    { name: "Custom Orders", href: "/custom-orders" },
    { name: "Size Guide", href: "/size-guide" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-cream text-chocolate">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <Logo size="md" />
              <span className="font-cormorant text-2xl font-bold text-chocolate group-hover:text-gold transition-colors">
                Joyful Crochets
              </span>
            </Link>
            <p className="text-mocha leading-relaxed mb-6">
              Handcrafted with love, each piece tells a unique story. Premium
              quality crochet items made with care for the modern lifestyle.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Twitter, href: "#", label: "Twitter" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-sand/30 flex items-center justify-center text-mocha hover:bg-gold hover:text-white transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="font-cormorant text-xl font-semibold text-chocolate mb-6">
              Shop
            </h3>
            <ul className="space-y-4">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-mocha hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h3 className="font-cormorant text-xl font-semibold text-chocolate mb-6">
              Help
            </h3>
            <ul className="space-y-4">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-mocha hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-cormorant text-xl font-semibold text-chocolate mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="text-mocha hover:text-gold transition-colors"
                >
                  +2348161342110
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                <a
                  href="mailto:joyfulcrochets@gmail.com"
                  className="text-mocha hover:text-gold transition-colors"
                >
                  joyfulcrochets@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                <span className="text-mocha">
                  Mon - Fri: 9am - 6pm
                  <br />
                  Sat: 10am - 4pm
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-sand/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-mocha text-sm">
              © {new Date().getFullYear()} Joyful Crochets. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                to="/privacy"
                className="text-mocha hover:text-gold text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-mocha hover:text-gold text-sm transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
