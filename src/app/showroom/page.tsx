import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { siteConfig } from '@/config/siteConfig';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Compass, Calendar, ShieldCheck, Award, FileText } from 'lucide-react';

export const metadata = {
  title: 'Showroom & Atelier | Ambika Jewels Jammu',
  description: 'Visit the Ambika Jewels boutique showroom and karigar atelier in Lower Roop Nagar, Jammu. Showroom hours, directions, interactive map, and statutory store disclosures.',
};

export default function ShowroomPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] pt-24 sm:pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop max-w-6xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 font-sans text-[10px] text-[var(--text-secondary)] mb-6 uppercase tracking-wider font-medium">
            <Link href="/" className="hover:text-[var(--accent-gold)] transition-colors">HOME</Link>
            <span>/</span>
            <span className="text-[var(--accent-gold)] font-semibold">JAMMU SHOWROOM &amp; ATELIER</span>
          </div>

          {/* Page Hero Header */}
          <div className="border-b border-[var(--border-subtle)] pb-6 mb-8 text-center sm:text-left">
            <span className="font-sans text-xs text-[var(--accent-gold)] tracking-[0.25em] uppercase font-semibold block mb-1.5">
              FINE JEWELLERY ATELIER &bull; ESTD. 1998
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] font-normal tracking-tight">
              Visit Our Jammu Showroom
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] mt-2.5 max-w-2xl font-light leading-relaxed">
              Experience the timeless splendour of Dogra bridal heritage in person. Our boutique atelier in Lower Roop Nagar welcomes you for bespoke karigar consultations, purity testing, and heirloom design.
            </p>
          </div>

          {/* Main Grid: Showroom Details & Map */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-stretch">
            {/* Showroom Information Card */}
            <div className="col-span-12 lg:col-span-5 bg-[var(--bg-surface)] border border-[var(--border-card)] p-6 sm:p-7 rounded-[2px] shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[var(--accent-gold)] block mb-1">
                    PHYSICAL LOCATION
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl text-[var(--text-primary)] font-normal mb-2">
                    Ambika Jewels Atelier
                  </h2>
                  <div className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)] leading-relaxed font-light">
                    <MapPin className="w-4 h-4 text-[var(--accent-gold)] shrink-0 mt-0.5" />
                    <span>{siteConfig.fullAddress}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3 text-xs">
                  <div className="flex items-start gap-2.5 text-[var(--text-secondary)]">
                    <Clock className="w-4 h-4 text-[var(--accent-gold)] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[var(--text-primary)] font-medium">Showroom Hours:</strong>
                      <span className="font-light">{siteConfig.timings}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-[var(--text-secondary)]">
                    <Phone className="w-4 h-4 text-[var(--accent-gold)] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[var(--text-primary)] font-medium">Phone &amp; Showroom Desk:</strong>
                      <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-[var(--accent-gold)] transition-colors font-mono">
                        {siteConfig.contact.phone}
                      </a>
                      <span className="mx-1.5 text-[var(--border-subtle)]">|</span>
                      <a href="tel:+919086098457" className="hover:text-[var(--accent-gold)] transition-colors font-mono">
                        +91 9086098457
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-[var(--text-secondary)]">
                    <Mail className="w-4 h-4 text-[var(--accent-gold)] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[var(--text-primary)] font-medium">Official Inquiry:</strong>
                      <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-[var(--accent-gold)] transition-colors">
                        {siteConfig.contact.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row gap-3">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Shop+no.3,+E.W.S+colony,+Sector+1,+Lower+Roop+Nagar,+Jammu,+Jammu+%26+Kashmir+180013"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--accent-gold)] text-white text-xs font-sans font-semibold tracking-wider uppercase rounded-[2px] hover:opacity-90 transition-opacity"
                >
                  <Compass className="w-4 h-4" />
                  <span>Get Directions</span>
                </a>
                <a
                  href="https://wa.me/919086098457?text=Namaste!%20I%20would%20like%20to%20visit%20the%20Ambika%20Jewels%20showroom%20in%20Jammu."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-card)] text-[var(--text-primary)] text-xs font-sans font-medium tracking-wider uppercase rounded-[2px] hover:border-[var(--accent-gold)] transition-colors"
                >
                  <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Book Appointment</span>
                </a>
              </div>
            </div>

            {/* Interactive Embedded Google Map */}
            <div className="col-span-12 lg:col-span-7 bg-[var(--bg-surface)] border border-[var(--border-card)] rounded-[2px] shadow-sm flex flex-col min-h-[380px] overflow-hidden">
              <div className="bg-[var(--bg-card)] px-4 py-2.5 border-b border-[var(--border-subtle)] flex items-center justify-between text-xs font-sans text-[var(--text-secondary)]">
                <span className="flex items-center gap-1.5 font-medium text-[var(--text-primary)]">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                  Lower Roop Nagar, Sector 1, Jammu (180013)
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[var(--accent-gold)] font-medium">Interactive Map</span>
              </div>
              <div className="flex-1 w-full relative min-h-[320px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13414.288277259163!2d74.8304221!3d32.7715891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391e84e5a95f9227%3A0xb7cf9f3238914619!2sRoop%20Nagar%2C%20Jammu%2C%20Jammu%20and%20Kashmir%20180013!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  className="w-full h-full border-0 opacity-90 contrast-[1.05] dark:invert dark:hue-rotate-180 dark:contrast-125 dark:opacity-85 absolute inset-0"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ambika Jewels Showroom Location - Lower Roop Nagar, Jammu"
                />
              </div>
            </div>
          </div>

          {/* Showroom Services Overview */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl text-[var(--text-primary)] font-normal mb-6 text-center sm:text-left">
              In-Store Showroom Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[var(--bg-surface)] border border-[var(--border-card)] p-5 rounded-[2px]">
                <ShieldCheck className="w-6 h-6 text-[var(--accent-gold)] mb-3" />
                <h3 className="font-serif text-base text-[var(--text-primary)] font-semibold mb-1">
                  BIS Hallmark Testing
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-light">
                  Direct digital karigar verification and 6-digit laser HUID traceability on every gold article.
                </p>
              </div>

              <div className="bg-[var(--bg-surface)] border border-[var(--border-card)] p-5 rounded-[2px]">
                <Award className="w-6 h-6 text-[var(--accent-gold)] mb-3" />
                <h3 className="font-serif text-base text-[var(--text-primary)] font-semibold mb-1">
                  Bespoke Dogra Couture
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-light">
                  Custom bridal trousseau design, heirloom gold reimagining, and royal J&amp;K heritage craftsmanship.
                </p>
              </div>

              <div className="bg-[var(--bg-surface)] border border-[var(--border-card)] p-5 rounded-[2px]">
                <Compass className="w-6 h-6 text-[var(--accent-gold)] mb-3" />
                <h3 className="font-serif text-base text-[var(--text-primary)] font-semibold mb-1">
                  Old Gold Exchange
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-light">
                  Transparent melt testing and 100% net weight value on old gold jewellery towards new designer pieces.
                </p>
              </div>

              <div className="bg-[var(--bg-surface)] border border-[var(--border-card)] p-5 rounded-[2px]">
                <FileText className="w-6 h-6 text-[var(--accent-gold)] mb-3" />
                <h3 className="font-serif text-base text-[var(--text-primary)] font-semibold mb-1">
                  Armored Dispatch Hub
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-light">
                  Showroom pickup or fully insured, tamper-evident armored delivery across 19,000+ PIN codes via BVC.
                </p>
              </div>
            </div>
          </div>

          {/* Statutory Disclosures & Compliance Box */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-card)] p-6 sm:p-7 rounded-[2px]">
            <div className="border-b border-[var(--border-subtle)] pb-4 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[var(--accent-gold)] block mb-1">
                  E-COMMERCE REGULATORY DISCLOSURES
                </span>
                <h3 className="font-serif text-lg text-[var(--text-primary)] font-semibold">
                  Statutory Store &amp; Legal Compliance
                </h3>
              </div>
              <Link
                href="/seller-info"
                className="text-xs text-[var(--accent-gold)] font-medium hover:underline inline-flex items-center gap-1"
              >
                <span>Full Legal Disclosures Document</span>
                <span>&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div>
                <strong className="block text-[var(--text-primary)] font-medium mb-1">Legal Entity</strong>
                <p className="text-[var(--text-secondary)]">{siteConfig.legalBusinessName}</p>
                <p className="text-[var(--text-secondary)] text-[11px]">{siteConfig.legalEntityType}</p>
                <p className="text-[var(--text-secondary)] text-[11px] font-mono mt-1">GSTIN: {siteConfig.gstin}</p>
                <p className="text-[var(--text-secondary)] text-[11px] font-mono">PAN: {siteConfig.pan}</p>
              </div>

              <div>
                <strong className="block text-[var(--text-primary)] font-medium mb-1">Bureau of Indian Standards</strong>
                <p className="text-[var(--text-secondary)]">License: {siteConfig.bisHallmarkLicense}</p>
                <p className="text-[var(--text-secondary)] text-[11px] mt-0.5">HSN Code: {siteConfig.hsnCode} (Precious Metal Articles)</p>
                <p className="text-[var(--text-secondary)] text-[11px] mt-0.5">BIS Hallmarked with unique laser HUID</p>
              </div>

              <div>
                <strong className="block text-[var(--text-primary)] font-medium mb-1">Grievance Redressal Officer</strong>
                <p className="text-[var(--text-primary)] font-medium">{siteConfig.grievanceOfficer.name}</p>
                <p className="text-[var(--text-secondary)] text-[11px]">{siteConfig.grievanceOfficer.designation}</p>
                <p className="text-[var(--text-secondary)] text-[11px] mt-0.5">Email: {siteConfig.grievanceOfficer.email}</p>
                <p className="text-[var(--text-secondary)] text-[11px]">Phone: {siteConfig.grievanceOfficer.phone}</p>
              </div>

              <div>
                <strong className="block text-[var(--text-primary)] font-medium mb-1">Jurisdiction &amp; Law</strong>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Compliant with Consumer Protection (E-Commerce) Rules, 2020.
                </p>
                <p className="text-[var(--accent-gold)] text-[11px] mt-1 font-medium">
                  Jurisdiction: Courts of Jammu, J&amp;K, India.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

