import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FoodItem {
  id: number;
  name: string;
  dish: string;
  category: string;
  serves: string;
  createdAt: string;
}

const CATEGORIES = ['Main Dish', 'Side Dish', 'Dessert', 'Appetizer', 'Drinks', 'Other'];

const CATEGORY_COLORS: Record<string, string> = {
  'Main Dish':  'hsl(var(--primary))',
  'Side Dish':  'hsl(var(--secondary))',
  'Dessert':    '#9333ea',
  'Appetizer':  '#0891b2',
  'Drinks':     '#059669',
  'Other':      'hsl(var(--muted-foreground))',
};

const CATEGORY_EMOJIS: Record<string, string> = {
  'Main Dish':  '🦃',
  'Side Dish':  '🥗',
  'Dessert':    '🥧',
  'Appetizer':  '🧀',
  'Drinks':     '🍹',
  'Other':      '🍽️',
};

export default function FoodSignupList() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [dish, setDish] = useState('');
  const [category, setCategory] = useState('Side Dish');
  const [serves, setServes] = useState('');
  const [error, setError] = useState('');

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('/api/food');
      if (res.ok) {
        const data = await res.json() as FoodItem[];
        setItems(data);
      }
    } catch {
      // silently ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchItems();
    const interval = setInterval(() => { void fetchItems(); }, 20_000);
    return () => clearInterval(interval);
  }, [fetchItems]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !dish.trim()) {
      setError('Please enter your name and dish.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), dish: dish.trim(), category, serves: serves.trim() }),
      });
      if (!res.ok) throw new Error('Could not add dish');
      const newItem = await res.json() as FoodItem;
      setItems((prev) => [...prev, newItem]);
      setName('');
      setDish('');
      setServes('');
      setCategory('Side Dish');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await fetch(`/api/food/${id}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      // silently ignore
    }
  }

  // Group by category
  const grouped = CATEGORIES.reduce<Record<string, FoodItem[]>>((acc, cat) => {
    acc[cat] = items.filter((i) => i.category === cat);
    return acc;
  }, {});

  const inputClass = 'rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 transition-all w-full';
  const inputStyle = {
    background: 'hsl(var(--background))',
    color: 'hsl(var(--foreground))',
    border: '2px solid hsl(var(--border))',
  };

  return (
    <section id="food" className="py-xxl px-6" style={{ background: 'hsl(var(--background))' }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' as const }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <span
              className="inline-block px-4 py-1 rounded-full text-sm font-bold mb-4"
              style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
            >
              🍽️ The Feast
            </span>
            <h2
              className="text-5xl md:text-6xl font-black mb-4"
              style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--dark-text))' }}
            >
              Who's Bringing What?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Sign up for a dish so we don't end up with 12 mac &amp; cheeses (or do we?). Updates live as family adds their contributions.
            </p>
          </div>

          {/* Add dish form */}
          <form
            onSubmit={(e) => { void handleSubmit(e); }}
            className="rounded-3xl p-8 mb-10 shadow-xl"
            style={{ background: 'hsl(var(--dark-text))' }}
          >
            <h3
              className="text-xl font-black mb-5"
              style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--golden))' }}
            >
              Add Your Dish
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold" style={{ color: 'hsl(var(--cream))' }}>
                  Your Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="First & Last Name"
                  className={inputClass}
                  style={inputStyle}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold" style={{ color: 'hsl(var(--cream))' }}>
                  Dish Name *
                </label>
                <input
                  type="text"
                  value={dish}
                  onChange={(e) => setDish(e.target.value)}
                  placeholder="e.g. Sweet Potato Pie"
                  className={inputClass}
                  style={inputStyle}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold" style={{ color: 'hsl(var(--cream))' }}>
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{CATEGORY_EMOJIS[c]} {c}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold" style={{ color: 'hsl(var(--cream))' }}>
                  Serves (optional)
                </label>
                <input
                  type="text"
                  value={serves}
                  onChange={(e) => setServes(e.target.value)}
                  placeholder="e.g. 8–10 people"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
            </div>
            {error && (
              <p className="text-sm font-semibold mb-3" style={{ color: 'hsl(var(--error-text))' }}>
                {error}
              </p>
            )}
            <motion.button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-full text-lg font-black disabled:opacity-60"
              style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              {submitting ? 'Adding…' : 'Add My Dish 🍽️'}
            </motion.button>
          </form>

          {/* Live list */}
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading the feast…</div>
          ) : items.length === 0 ? (
            <div
              className="rounded-3xl p-12 text-center"
              style={{ background: 'hsl(var(--muted))' }}
            >
              <p className="text-4xl mb-3">🍽️</p>
              <p className="text-lg font-bold text-muted-foreground">No dishes yet — be the first to sign up!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {CATEGORIES.map((cat) => {
                const catItems = grouped[cat];
                if (!catItems || catItems.length === 0) return null;
                return (
                  <div key={cat}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{CATEGORY_EMOJIS[cat]}</span>
                      <h3
                        className="text-xl font-black"
                        style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--dark-text))' }}
                      >
                        {cat}
                      </h3>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                        style={{ background: CATEGORY_COLORS[cat] }}
                      >
                        {catItems.length}
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      <AnimatePresence>
                        {catItems.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="rounded-2xl p-4 flex items-center justify-between gap-4"
                            style={{ background: 'hsl(var(--muted))' }}
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <div
                                className="w-2 h-10 rounded-full flex-shrink-0"
                                style={{ background: CATEGORY_COLORS[cat] }}
                              />
                              <div className="min-w-0">
                                <p
                                  className="font-black text-base truncate"
                                  style={{ color: 'hsl(var(--dark-text))' }}
                                >
                                  {item.dish}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  by <span className="font-semibold">{item.name}</span>
                                  {item.serves ? ` · serves ${item.serves}` : ''}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => { void handleDelete(item.id); }}
                              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm opacity-40 hover:opacity-100 transition-opacity"
                              style={{ background: 'hsl(var(--destructive))', color: 'white' }}
                              aria-label={`Remove ${item.dish}`}
                              title="Remove"
                            >
                              ✕
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
