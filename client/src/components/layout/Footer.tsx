import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  CircleDot,
} from 'lucide-react'

const footerLinks = {
  shop: [
    { name: 'Bags', href: '/shop?category=bags' },
    { name: 'Hats', href: '/shop?category=hats' },
    { name: 'Clothing', href: '/shop?category=clothing' },
    { name: 'Flowers', href: '/shop?category=flowers' },
    { name: 'Home Décor', href: '/shop?category=home' },
    { name: 'Baby', href: '/shop?category=baby' },
  ],
  help: [
    { name: 'FAQs', href: '/faq' },
    { name: 'Shipping', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'Custom Orders', href: '/custom-orders' },
    { name: 'Size Guide', href: '/size-guide' },
  ],
}

export function Footer() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="bg-chocolate-900 text-chocolate-100">
      {/* Newsletter Section */}
      <div className="border-b border-chocolate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-cormorant text-3xl md:text-4xl font-semibold text-white mb-4">
              Stay in the Loop
            </h2>
            <p className="text-chocolate-300 mb-8">
              Subscribe for exclusive offers, early access to new collections, and handmade inspiration.
            </p>

            {isSubscribed ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-green-900/30 border border-green-700 rounded-xl p-6"
              >
                <p className="text-green-400 font-medium">
                  Thank you for subscribing! Check your inbox for a welcome gift.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-5 py-4 rounded-xl bg-chocolate-800 border border-chocolate-700 text-white placeholder-chocolate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-amber-600 to-yellow-500 text-white font-medium rounded-xl hover:from-amber-700 hover:to-yellow-600 transition-all shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center">
                <CircleDot className="w-5 h-5 text-white" />
              </div>
              <span className="font-cormorant text-2xl font-bold text-white">
                Joyful Crotchets
              </span>
            </Link>
            <p className="text-chocolate-300 leading-relaxed mb-6">
              Handcrafted with love, each piece tells a unique story. Premium quality crochet items 
              made with care for the modern lifestyle.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Pinterest' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-chocolate-800 flex items-center justify-center text-chocolate-400 hover:bg-amber-600 hover:text-white transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="font-cormorant text-xl font-semibold text-white mb-6">
              Shop
            </h3>
            <ul className="space-y-4">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-chocolate-300 hover:text-amber-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h3 className="font-cormorant text-xl font-semibold text-white mb-6">
              Help
            </h3>
            <ul className="space-y-4">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-chocolate-300 hover:text-amber-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-cormorant text-xl font-semibold text-white mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-chocolate-300">
                  123 Crochet Lane<br />
                  Artisan District, CA 90210
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <a href="tel:+1234567890" className="text-chocolate-300 hover:text-amber-400 transition-colors">
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <a href="mailto:hello@joyfulcrotchets.com" className="text-chocolate-300 hover:text-amber-400 transition-colors">
                  hello@joyfulcrotchets.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-chocolate-300">
                  Mon - Fri: 9am - 6pm<br />
                  Sat: 10am - 4pm
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-chocolate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-chocolate-400 text-sm">
              © {new Date().getFullYear()} Joyful Crotchets. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-chocolate-400 hover:text-amber-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-chocolate-400 hover:text-amber-400 text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
