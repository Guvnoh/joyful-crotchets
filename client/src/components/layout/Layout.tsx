import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ScrollProgress } from './ScrollProgress'
import { SearchModal } from './SearchModal'
import { CartSidebar } from './CartSidebar'
import { NewsletterPopup } from './NewsletterPopup'
import { CookieConsent } from './CookieConsent'
import { QuickViewModal } from '@/components/product/QuickViewModal'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <SearchModal />
      <CartSidebar />
      <QuickViewModal />
      <NewsletterPopup />
      <CookieConsent />
    </div>
  )
}
