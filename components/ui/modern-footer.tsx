"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  MapPin, 
  Mail, 
  Phone, 
  Facebook, 
  Twitter, 
  Linkedin,
  Instagram,
  Youtube,
  Shield,
  Users,
  ChevronRight,
  ArrowUp
} from "lucide-react"
import { cn } from "@/lib/utils"

export function ModernFooter() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Report Issue", href: "/complaint-form" },
        { name: "Track Status", href: "/track" },
        { name: "About Us", href: "/about" },
        { name: "Help Center", href: "/help" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "FAQ", href: "/faq" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Cookie Policy", href: "/cookies" }
      ]
    },
    {
      title: "Connect",
      links: [
        { name: "Facebook", href: "https://facebook.com" },
        { name: "Twitter", href: "https://twitter.com" },
        { name: "LinkedIn", href: "https://linkedin.com" },
        { name: "Instagram", href: "https://instagram.com" },
        { name: "YouTube", href: "https://youtube.com" }
      ]
    }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Smart City Portal</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Empowering citizens to build better communities through technology and transparency.
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="font-medium">Government of India Initiative</p>
                    <p className="text-sm text-gray-400">New Delhi, India</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="font-medium">support@smartcity.gov.in</p>
                    <p className="text-sm text-gray-400">24/7 Support</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="font-medium">1800-123-4567</p>
                    <p className="text-sm text-gray-400">Toll Free</p>
                  </div>
                </div>
              </div>

            {/* Footer Links */}
            {footerLinks.slice(0, 2).map((section, index) => (
              <div key={section.title} className="lg:col-span-1">
                <h4 className="text-lg font-semibold mb-4 text-blue-400">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter Section */}
            <div className="lg:col-span-1">
              <h4 className="text-lg font-semibold mb-4 text-blue-400">Stay Updated</h4>
              <p className="text-gray-400 mb-4">
                Get the latest updates on civic initiatives and complaint resolutions.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <Button 
                    type="submit"
                    disabled={!email || isSubscribed}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    {isSubscribed ? "Subscribed ✓" : "Subscribe"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Social Links */}
            <div className="lg:col-span-1">
              <h4 className="text-lg font-semibold mb-4 text-blue-400">Connect With Us</h4>
              <div className="flex space-x-4">
                {footerLinks[2].links.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.name === "Facebook" && <Facebook className="w-5 h-5 text-gray-400" />}
                    {social.name === "Twitter" && <Twitter className="w-5 h-5 text-gray-400" />}
                    {social.name === "LinkedIn" && <Linkedin className="w-5 h-5 text-gray-400" />}
                    {social.name === "Instagram" && <Instagram className="w-5 h-5 text-gray-400" />}
                    {social.name === "YouTube" && <Youtube className="w-5 h-5 text-gray-400" />}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm">
                © 2024 Smart City Complaint Portal. All rights reserved.
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <Link href="/privacy" className="hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
                <span className="text-gray-600">•</span>
                <Link href="/terms" className="hover:text-white transition-colors duration-200">
                  Terms of Service
                </Link>
                <span className="text-gray-600">•</span>
                <Link href="/cookies" className="hover:text-white transition-colors duration-200">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
