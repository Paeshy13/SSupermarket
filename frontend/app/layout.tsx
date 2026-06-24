import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Samrat Supermarket - Nyeri, Kenya",
  description: "Shop fresh groceries online at Samrat Supermarket, Nyeri Town, Kenya. Fast delivery, M-Pesa payments.",
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛒</text></svg>" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AppProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster position="top-right" />
          <footer className="bg-green-900 text-white py-12 mt-16">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl">🛒</span>
                  <div><div className="font-bold text-lg">SAMRAT SUPERMARKET</div><div className="text-green-400 text-sm">Nyeri, Kenya</div></div>
                </div>
                <p className="text-green-300 text-sm">Your trusted neighborhood supermarket in the heart of Nyeri Town since 2005.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-green-300">Contact Us</h4>
                <div className="text-sm text-green-200 space-y-1">
                  <p>📍 Nyeri Town Centre, Nyeri County</p>
                  <p>📞 +254-700-000-000</p>
                  <p>✉️ info@samrat.co.ke</p>
                  <p>⏰ Mon–Sat: 8AM–8PM | Sun: 9AM–6PM</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-green-300">We Accept</h4>
                <div className="flex flex-wrap gap-2">
                  {['📱 M-Pesa', '🏦 Bank Transfer', '💳 Cards'].map(m => (
                    <span key={m} className="bg-green-800 text-green-200 text-xs px-3 py-1 rounded-full">{m}</span>
                  ))}
                </div>
                <p className="text-green-400 text-xs mt-4">© {new Date().getFullYear()} Samrat Supermarket. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
