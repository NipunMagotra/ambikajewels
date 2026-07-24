import Link from 'next/link';
import { siteConfig } from "@/config/siteConfig";
import { WhatsAppButton, CallButton } from '@/components/ui/ContactButtons';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant py-section-gap pb-32 lg:pb-section-gap">
      <div className="container mx-auto px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-margin-desktop mb-section-gap">
          <div className="col-span-1">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-stack-md">{siteConfig.name}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-md whitespace-pre-line">
              {siteConfig.address.replace(', ', ',\n')}
            </p>
            <div className="flex gap-4">
              <a className="text-on-surface-variant hover:text-primary transition-colors" href={siteConfig.social.instagram} aria-label="Instagram">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href={siteConfig.social.facebook} aria-label="Facebook">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.714 5H18V0h-3.808C10.592 0 9 1.838 9 5.062V8z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-label-caps text-label-caps text-on-surface mb-stack-md">COLLECTIONS</h3>
            <ul className="flex flex-col gap-2 font-body-md text-body-md text-on-surface-variant">
              <li><Link className="hover:text-primary transition-colors" href="/collections?category=Bridal Couture">Bridal Couture</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/collections?category=Daily Luxury">Daily Luxury</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/collections?category=Temple Jewelry">Temple Jewelry</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/collections?category=Men's Accessories">Men's Accessories</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-label-caps text-label-caps text-on-surface mb-stack-md">QUICK LINKS</h3>
            <ul className="flex flex-col gap-2 font-body-md text-body-md text-on-surface-variant">
              <li><Link className="hover:text-primary transition-colors" href="#">Privacy Policy</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Terms of Service</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Shipping & Returns</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Certification FAQ</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-label-caps text-label-caps text-on-surface mb-stack-md">CONTACT US</h3>
            <div className="flex flex-col gap-stack-md">
              <WhatsAppButton />
              <CallButton />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-12 gap-stack-lg items-center">
          <div className="col-span-12 lg:col-span-8 h-64 bg-surface-container border border-outline-variant overflow-hidden relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13414.288277259163!2d74.8304221!3d32.7715891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391e84e5a95f9227%3A0xb7cf9f3238914619!2sRoop%20Nagar%2C%20Jammu%2C%20Jammu%20and%20Kashmir%20180013!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.2) opacity(0.85)' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ambika Jewels Location Map - Roop Nagar, Jammu"
            />
          </div>
          <div className="col-span-12 lg:col-span-4 text-center lg:text-right mt-stack-md lg:mt-0">
            <p className="font-body-md text-body-md text-on-surface-variant opacity-60">
              © {new Date().getFullYear()} AMBIKA JEWELS. ROOP NAGAR, JAMMU. <br/>DESIGNED FOR THE DISCERNING.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
