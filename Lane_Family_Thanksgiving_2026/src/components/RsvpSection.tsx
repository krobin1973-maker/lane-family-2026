import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

interface Headcount {
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
}

interface HeadcountData {
  headcount: Headcount;
  totalRsvps: number;
}

const DAYS = [
  { key: 'thursday' as const, label: 'Thursday', date: 'Nov 26', emoji: '🦃' },
  { key: 'friday' as const, label: 'Friday', date: 'Nov 27', emoji: '🏈' },
  { key: 'saturday' as const, label: 'Saturday', date: 'Nov 28', emoji: '🎉' },
  { key: 'sunday' as const, label: 'Sunday', date: 'Nov 29', emoji: '🍂' },
];

function HeadcountBoard({ data, loading }: { data: HeadcountData | null; loading: boolean }) {
  return (
    <div
      className="rounded-3xl p-6 md:p-8 mb-10"
      style={{ background: 'hsl(var(--dark-text))' }}
    >
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h3
            className="text-2xl font-black"
            style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--golden))' }}
          >
            Live Headcount
          </h3>
          <p className="text-sm mt-0.5" style={{ color: 'hsl(var(--cream) / 0.6)' }}>
            Updates as family RSVPs roll in
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
          style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: 'hsl(var(--golden))' }}
          />
          {loading ? '…' : `${data?.totalRsvps ?? 0} RSVPs`}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {DAYS.map((day) => (
          <div
            key={day.key}
            className="rounded-2xl p-4 text-center"
            style={{ background: 'hsl(var(--primary) / 0.15)' }}
          >
            <div className="text-2xl mb-1">{day.emoji}</div>
            <div
              className="text-xs font-bold uppercase tracking-wide mb-1"
              style={{ color: 'hsl(var(--cream) / 0.6)' }}
            >
              {day.label}
            </div>
            <div
              className="text-xs mb-2"
              style={{ color: 'hsl(var(--cream) / 0.4)' }}
            >
              {day.date}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={loading ? 'loading' : String(data?.headcount[day.key] ?? 0)}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'backOut' as const }}
                className="text-4xl font-black"
                style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--golden))' }}
              >
                {loading ? '–' : (data?.headcount[day.key] ?? 0)}
              </motion.div>
            </AnimatePresence>
            <div
              className="text-xs mt-1"
              style={{ color: 'hsl(var(--cream) / 0.4)' }}
            >
              guests
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GuestCounter({
  label,
  date,
  emoji,
  name,
  value,
  onChange,
}: {
  label: string;
  date: string;
  emoji: string;
  name: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div
      className="rounded-2xl p-4 flex items-center justify-between gap-4"
      style={{ background: 'hsl(var(--muted))' }}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <div className="font-bold text-sm" style={{ color: 'hsl(var(--dark-text))' }}>
            {label}
          </div>
          <div className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
            {date}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-9 h-9 rounded-full flex items-center justify-center text-xl font-bold transition-all hover:scale-110 active:scale-95 disabled:opacity-30"
          style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
          disabled={value === 0}
          aria-label={`Decrease ${label} guests`}
        >
          −
        </button>
        <input type="hidden" name={name} value={value} />
        <span
          className="w-8 text-center text-xl font-black"
          style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--dark-text))' }}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(50, value + 1))}
          className="w-9 h-9 rounded-full flex items-center justify-center text-xl font-bold transition-all hover:scale-110 active:scale-95"
          style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
          aria-label={`Increase ${label} guests`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function RsvpSection({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [headcountData, setHeadcountData] = useState<HeadcountData | null>(null);
  const [headcountLoading, setHeadcountLoading] = useState(true);
  const [guests, setGuests] = useState({ thursday: 0, friday: 0, saturday: 0, sunday: 0 });

  const fetchHeadcount = useCallback(async () => {
    try {
     
const res = await fetch('/.netlify/functions/guest-counts');
if (res.ok) {
  const counts = await res.json();
  setHeadcountData({
    headcount: {
      thursday: counts.thursday ?? 0,
      friday: counts.friday ?? 0,
      saturday: counts.saturday ?? 0,
      sunday: counts.sunday ?? 0,
    },
    totalRsvps: counts.totalRsvps ?? 0,
  });
}
} catch {
      // silently ignore
    } finally {
      setHeadcountLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchHeadcount();
    const interval = setInterval(() => { void fetchHeadcount(); }, 30_000);
    return () => clearInterval(interval);
  }, [fetchHeadcount]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (formData.get('_gotcha')) return;

    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const notes = String(formData.get('notes') ?? '').trim();

    setStatus('sending');
    setErrorMsg('');

    try {
     
const dbRes = await fetch('/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    'form-name': 'lane-rsvp',
    name,
    email,
    guestsThursday: String(guests.thursday),
    guestsFriday: String(guests.friday),
    guestsSaturday: String(guests.saturday),
    guestsSunday: String(guests.sunday),
    notes,
  }).toString(),
});


      if (!dbRes.ok) throw new Error('Could not save RSVP');

      // Field mapping: only notes go in messages_attributes[0].body. All other fields go in conversation.data.
      await fetch('/api/contact/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation: {
            messages_attributes: [{ body: notes || 'New RSVP submitted' }],
            data: {
              __gd_contact_form_title: 'Lane Family Thanksgiving RSVP',
              'Thursday (Nov 26) guests': String(guests.thursday),
              'Friday (Nov 27) guests': String(guests.friday),
              'Saturday (Nov 28) guests': String(guests.saturday),
              'Sunday (Nov 29) guests': String(guests.sunday),
              'Notes': notes || '—',
            },
          },
          user: { email, name },
        }),
      });

      setStatus('success');
      form.reset();
      setGuests({ thursday: 0, friday: 0, saturday: 0, sunday: 0 });
      void fetchHeadcount();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  return (
    <section id="rsvp" className="py-xxl px-6" style={{ background: 'hsl(var(--muted))' }}>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' as const }}
        >
          {/* Section header — rendered by parent page for inline editability */}
          <div className="text-center mb-10">
            {children}
          </div>

          {/* Live headcount board */}
          <HeadcountBoard data={headcountData} loading={headcountLoading} />

          {/* RSVP Form */}
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl p-10 text-center shadow-2xl"
                style={{ background: 'hsl(var(--dark-text))' }}
              >
                <div className="text-6xl mb-4">🎉</div>
                <h3
                  className="text-3xl font-black mb-3"
                  style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--golden))' }}
                >
                  You're In!
                </h3>
                <p className="text-lg mb-6" style={{ color: 'hsl(var(--cream) / 0.8)' }}>
                  We've got you on the list. See you in St. Louis! 🦃
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="px-6 py-2 rounded-full text-sm font-bold"
                  style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
                >
                  Submit another RSVP
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={(e) => { void handleSubmit(e); }}
                className="rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col gap-6"
                style={{ background: 'hsl(var(--dark-text))' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Honeypot */}
                <input
                  type="text"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ position: 'absolute', left: '-9999px' }}
                  aria-hidden="true"
                />

                {/* Name + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="rsvp-name"
                      className="text-sm font-bold"
                      style={{ color: 'hsl(var(--cream))' }}
                    >
                      Your Name *
                    </label>
                    <input
                      id="rsvp-name"
                      name="name"
                      type="text"
                      required
                      placeholder="First & Last Name"
                      className="rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 transition-all"
                      style={{
                        background: 'hsl(var(--background))',
                        color: 'hsl(var(--foreground))',
                        border: '2px solid hsl(var(--border))',
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="rsvp-email"
                      className="text-sm font-bold"
                      style={{ color: 'hsl(var(--cream))' }}
                    >
                      Email Address *
                    </label>
                    <input
                      id="rsvp-email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@email.com"
                      className="rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 transition-all"
                      style={{
                        background: 'hsl(var(--background))',
                        color: 'hsl(var(--foreground))',
                        border: '2px solid hsl(var(--border))',
                      }}
                    />
                  </div>
                </div>

                {/* Guest counters per day */}
                <div>
                  <p
                    className="text-sm font-bold mb-3"
                    style={{ color: 'hsl(var(--cream))' }}
                  >
                    How many guests are coming each day? (including yourself)
                  </p>
                  <div className="flex flex-col gap-3">
                    {DAYS.map((day) => (
                      <GuestCounter
                        key={day.key}
                        label={day.label}
                        date={day.date}
                        emoji={day.emoji}
                        name={`guests_${day.key}`}
                        value={guests[day.key]}
                        onChange={(v) => setGuests((prev) => ({ ...prev, [day.key]: v }))}
                      />
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="rsvp-notes"
                    className="text-sm font-bold"
                    style={{ color: 'hsl(var(--cream))' }}
                  >
                    Notes / Dietary needs / Anything else?
                  </label>
                  <textarea
                    id="rsvp-notes"
                    name="notes"
                    rows={3}
                    placeholder="Allergies, who you're bringing, what dish you're making…"
                    className="rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 transition-all resize-none"
                    style={{
                      background: 'hsl(var(--background))',
                      color: 'hsl(var(--foreground))',
                      border: '2px solid hsl(var(--border))',
                    }}
                  />
                </div>

                {/* Error */}
                {status === 'error' && (
                  <p role="alert" className="text-sm font-semibold text-center" style={{ color: 'hsl(var(--error-text))' }}>
                    {errorMsg}
                  </p>
                )}

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full py-4 rounded-full text-lg font-black transition-all disabled:opacity-60"
                  style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  {status === 'sending' ? 'Sending…' : 'Count Me In! 🙋'}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
