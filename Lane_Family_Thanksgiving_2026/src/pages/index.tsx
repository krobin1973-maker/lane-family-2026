import { lazy, Suspense } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { home } from 'virtual:content';
import RsvpSection from '../components/RsvpSection';
import FoodSignupList from '../components/FoodSignupList';
import MapSection from '../components/MapSection';

const PdfViewer = lazy(() => import('../components/PdfViewer'));

function PdfSkeleton() {
  return (
    <div
      className="rounded-2xl h-64 flex items-center justify-center text-lg font-semibold animate-pulse"
      style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' }}
    >
      Loading PDF…
    </div>
  );
}

// ── Leaf SVG decoration ──────────────────────────────────────────────────────
function LeafDecoration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="currentColor" aria-hidden="true">
      <path d="M40 5 C10 5 5 40 5 40 C5 40 20 20 40 25 C60 30 70 10 70 10 C70 10 55 5 40 5Z" />
      <path d="M40 75 C70 75 75 40 75 40 C75 40 60 60 40 55 C20 50 10 70 10 70 C10 70 25 75 40 75Z" opacity="0.6" />
      <line x1="40" y1="5" x2="40" y2="75" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}

function TurkeyDecoration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
      <ellipse cx="50" cy="65" rx="22" ry="20" />
      <circle cx="50" cy="38" r="10" />
      <path d="M55 38 L62 36 L55 42Z" />
      <ellipse cx="57" cy="43" rx="3" ry="5" opacity="0.7" />
      <ellipse cx="30" cy="48" rx="7" ry="18" transform="rotate(-30 30 48)" opacity="0.8" />
      <ellipse cx="40" cy="40" rx="7" ry="18" transform="rotate(-10 40 40)" opacity="0.9" />
      <ellipse cx="60" cy="40" rx="7" ry="18" transform="rotate(10 60 40)" opacity="0.9" />
      <ellipse cx="70" cy="48" rx="7" ry="18" transform="rotate(30 70 48)" opacity="0.8" />
      <rect x="42" y="83" width="5" height="12" rx="2" />
      <rect x="53" y="83" width="5" height="12" rx="2" />
    </svg>
  );
}

// ── Stagger variants ─────────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, scale: 0.7, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: 'backOut' as const } },
} as const;

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
} as const;

// ── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const siteUrl = 'https://4lflf2pn8z.preview.c39.airoapp.ai';
  const pageTitle = 'Lane Family Thanksgiving 2026 — Lanes Take Over St. Louis';
  const pageDescription =
    'The Lane family is taking over St. Louis for Thanksgiving 2026! Pack your bags, bring your appetite, and RSVP now.';

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={siteUrl} />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${siteUrl}/airo-assets/images/pages/home/hero`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={`${siteUrl}/airo-assets/images/pages/home/hero`} />
      </Helmet>

      <main>
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
          style={{ background: 'hsl(var(--hero-overlay))' }}
        >
          {/* Background image */}
          <img
            src="/airo-assets/images/pages/home/hero"
            alt="St. Louis Gateway Arch skyline in autumn"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            loading="eager"
            fetchPriority="high"
            width={1600}
            height={900}
          />

          {/* Decorative elements */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="absolute top-16 left-8 md:left-20" style={{ color: 'hsl(var(--golden) / 0.5)' }}>
              <LeafDecoration className="w-16 h-16 rotate-12" />
            </motion.div>
            <motion.div variants={itemVariants} className="absolute top-24 right-10 md:right-32" style={{ color: 'hsl(var(--primary) / 0.6)' }}>
              <LeafDecoration className="w-12 h-12 -rotate-20" />
            </motion.div>
            <motion.div variants={itemVariants} className="absolute bottom-32 left-6 md:left-16" style={{ color: 'hsl(var(--secondary) / 0.5)' }}>
              <LeafDecoration className="w-20 h-20 rotate-45" />
            </motion.div>
            <motion.div variants={itemVariants} className="absolute bottom-24 right-8 md:right-24" style={{ color: 'hsl(var(--golden) / 0.4)' }}>
              <LeafDecoration className="w-14 h-14 -rotate-12" />
            </motion.div>
            <motion.div variants={itemVariants} className="absolute top-20 right-4 md:right-16 hidden sm:block" style={{ color: 'hsl(var(--primary) / 0.35)' }}>
              <TurkeyDecoration className="w-24 h-24" />
            </motion.div>
          </motion.div>

          {/* Hero content — logo large + CTA */}
          <motion.div
            className="relative z-10 text-center px-6 max-w-3xl mx-auto flex flex-col items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Large logo — serves as the visual h1 for this private event page */}
            <motion.div variants={itemVariants} className="mb-8">
              <h1 className="sr-only">Lane Family Thanksgiving 2026 — Lanes Take Over St. Louis</h1>
              <img
                src="/airo-assets/images/logo/horizontal"
                alt="The Lane Family Takes St. Louis — Thanksgiving 2026"
                className="block h-auto w-auto object-contain mx-auto"
                style={{
                  maxHeight: '300px',
                  maxWidth: '700px',
                  mixBlendMode: 'screen',
                  filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.4)) brightness(1.08)',
                }}
                width={700}
                height={300}
                fetchPriority="high"
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-2xl font-semibold max-w-2xl mx-auto mb-10"
              style={{ color: 'hsl(var(--golden))' }}
            >
              {home.hero.tagline}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center">
              <motion.a
                href="#rsvp"
                className="inline-block px-10 py-4 rounded-full text-lg font-black shadow-xl"
                style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                Count Me In! 🙋
              </motion.a>
              <motion.a
                href="#details"
                className="inline-block px-10 py-4 rounded-full text-lg font-black shadow-xl"
                style={{ background: 'hsl(var(--golden))', color: 'hsl(var(--dark-text))' }}
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                See the Details 🍂
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            style={{ color: 'hsl(var(--white-pure) / 0.5)' }}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </section>

        {/* ── EVENT DETAILS ─────────────────────────────────────────────── */}
        <section id="details" className="py-xxl px-6" style={{ background: 'hsl(var(--background))' }}>
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-12"
              variants={slideUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span
                className="inline-block px-4 py-1 rounded-full text-sm font-bold mb-4"
                style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' }}
              >
                {home.details.sectionLabel}
              </span>
              <h2
                className="text-4xl md:text-5xl font-black"
                style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--dark-text))' }}
              >
                Everything You Need to Know
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {home.details.cards.map((card, i) => (
                <motion.div
                  key={card.id}
                  className="rounded-3xl p-8 flex gap-5 items-start"
                  style={{
                    background: i % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--dark-text))',
                    color: 'hsl(var(--white-pure))',
                  }}
                  variants={slideUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <span className="text-4xl flex-shrink-0">{card.emoji}</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-70">{card.title}</p>
                    <p className="text-xl font-black mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{card.body}</p>
                    <p className="text-sm opacity-80">{card.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Fall foliage strip */}
            <motion.div
              className="mt-12 rounded-3xl overflow-hidden h-48 md:h-64 relative"
              variants={slideUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <img
                src="/airo-assets/images/pages/home/fall-foliage"
                alt="Vibrant fall foliage"
                className="w-full h-full object-cover"
                loading="lazy"
                width={800}
                height={400}
              />
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ background: 'hsl(var(--dark-text) / 0.55)' }}
              >
                <p
                  className="text-3xl md:text-4xl font-black text-center px-4"
                  style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--golden))' }}
                >
                  St. Louis is Ready for Us 🍂
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── DOCUMENTS ────────────────────────────────────────────────── */}
        <section id="docs" className="py-xxl px-6" style={{ background: 'hsl(var(--dark-text))' }}>
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-12"
              variants={slideUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span
                className="inline-block px-4 py-1 rounded-full text-sm font-bold mb-4"
                style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
              >
                📄 Family Docs
              </span>
              <h2
                className="text-4xl md:text-5xl font-black"
                style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--golden))' }}
              >
                Sign Up &amp; Itinerary
              </h2>
              <p className="mt-3 text-lg" style={{ color: 'hsl(var(--cream) / 0.7)' }}>
                Everything you need to get ready for the takeover.
              </p>
            </motion.div>

            <div className="flex flex-col gap-14">
              {/* Itinerary PDF — first */}
              <motion.div
                variants={slideUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl">📅</span>
                  <h3
                    className="text-2xl font-black"
                    style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--golden))' }}
                  >
                    Weekend Itinerary 2026
                  </h3>
                </div>
                <Suspense fallback={<PdfSkeleton />}>
                  <PdfViewer
                    fileUrl="/data/Lane_Family_Thanksgiving_Weekend_2026_SMALL.pdf"
                    display="full"
                    title="Weekend Itinerary 2026"
                  />
                </Suspense>
              </motion.div>

              {/* Menu PDF — second */}
              <motion.div
                variants={slideUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl">🍽️</span>
                  <h3
                    className="text-2xl font-black"
                    style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--golden))' }}
                  >
                    Thanksgiving Menu
                  </h3>
                </div>
                <Suspense fallback={<PdfSkeleton />}>
                  <PdfViewer
                    fileUrl="/data/Lane_Family_Thanksgiving_Editable_Menu_Blank_Bottom_Section.pdf"
                    display="full"
                    title="Thanksgiving Menu"
                  />
                </Suspense>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── FOOD SIGN-UP ─────────────────────────────────────────────── */}
        <FoodSignupList />

        {/* ── MAP & ADDRESSES ──────────────────────────────────────────── */}
        <MapSection />

        {/* ── RSVP & HEADCOUNT ─────────────────────────────────────────── */}
        <RsvpSection>
          <span
            className="inline-block px-4 py-1 rounded-full text-sm font-bold mb-4"
            style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
          >
            {home.rsvp.sectionLabel}
          </span>
          <h2
            className="text-5xl md:text-6xl font-black mb-4"
            style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--dark-text))' }}
          >
            {home.rsvp.headline}
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {home.rsvp.body}
          </p>
        </RsvpSection>
      </main>
    </>
  );
}
