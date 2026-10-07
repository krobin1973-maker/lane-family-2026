import { lazy, Suspense } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { signup } from 'virtual:content';

const PdfViewer = lazy(() => import('../components/PdfViewer'));

export default function SignUpPage() {
  return (
    <>
      <Helmet>
        <title>Family Sign-Up Sheet — Lane Family Thanksgiving 2026</title>
        <meta name="description" content="The Lane Family Thanksgiving 2026 sign-up sheet." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main className="min-h-screen py-12 px-4" style={{ background: 'hsl(var(--dark-text))' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <a
              href="/"
              className="inline-flex items-center gap-2 mb-8 text-sm font-bold px-4 py-2 rounded-full transition-all hover:scale-105"
              style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
            >
              ← Back to Home
            </a>
            <div className="text-center mb-10">
              <span
                className="inline-block px-4 py-1 rounded-full text-sm font-bold mb-4"
                style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
              >
                {signup.badge}
              </span>
              <h1
                className="text-4xl md:text-5xl font-black mb-3"
                style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--golden))' }}
              >
                {signup.title}
              </h1>
              <p className="text-lg" style={{ color: 'hsl(var(--cream) / 0.7)' }}>
                {signup.subtitle}
              </p>
            </div>
            <Suspense
              fallback={
                <div
                  className="rounded-2xl h-64 flex items-center justify-center text-lg font-semibold"
                  style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' }}
                >
                  Loading PDF…
                </div>
              }
            >
              <PdfViewer
                fileUrl="/data/Lane_Family_Thanksgiving_Sign up.pdf"
                display="full"
                title="Family Sign-Up Sheet"
              />
            </Suspense>
          </motion.div>
        </div>
      </main>
    </>
  );
}
