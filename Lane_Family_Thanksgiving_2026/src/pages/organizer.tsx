import { useState, type FormEvent } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router';

type Dish = {
  id: string;
  dish: string;
  name: string;
  category: string;
  serves: string;
  createdAt: string;
};

const categories = ['Main Dish', 'Side Dish', 'Dessert', 'Appetizer', 'Drinks', 'Other'];
const emptyDish = (): Dish => ({
  id: '', dish: '', name: '', category: 'Side Dish', serves: '', createdAt: '',
});
const endpoint = '/.netlify/functions/menu-admin';

export default function OrganizerPage() {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [items, setItems] = useState<Dish[]>([]);
  const [draft, setDraft] = useState<Dish | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function loadMenu(code: string) {
    const response = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${code}` },
      cache: 'no-store',
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Could not load the family menu.');
    setItems(data.items as Dish[]);
    setUnlocked(true);
  }

  async function signIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await loadMenu(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to unlock organizer tools.');
    } finally {
      setBusy(false);
    }
  }

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!draft) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({
          action: 'save',
          id: draft.id || undefined,
          item: {
            dish: draft.dish,
            name: draft.name,
            category: draft.category,
            serves: draft.serves,
          },
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to save changes.');
      await loadMenu(password);
      setDraft(null);
      setNotice('Saved! Your updated dish assignment is now in the shared list.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save changes.');
    } finally {
      setBusy(false);
    }
  }

  async function remove(item: Dish) {
    if (!window.confirm(`Remove "${item.dish}" by ${item.name} from the family website?\n\nThe original Netlify form submission, if any, will remain in Netlify.`)) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ action: 'remove', id: item.id }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to remove dish.');
      await loadMenu(password);
      if (draft?.id === item.id) setDraft(null);
      setNotice('Dish removed from the shared website list.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to remove dish.');
    } finally {
      setBusy(false);
    }
  }

  function signOut() {
    setPassword('');
    setItems([]);
    setDraft(null);
    setUnlocked(false);
    setError('');
    setNotice('');
  }

  const inputClass = 'w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500';
  const buttonClass = 'rounded-full px-5 py-3 font-bold disabled:opacity-50 transition-opacity hover:opacity-90';

  return (
    <>
      <Helmet>
        <title>Family Organizer · Lane Family Thanksgiving 2026</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main className="min-h-screen px-4 pt-32 pb-20" style={{ background: 'hsl(var(--background))' }}>
        <div className="max-w-4xl mx-auto">
          <p className="font-bold text-sm tracking-widest uppercase mb-3" style={{ color: 'hsl(var(--primary))' }}>Private organizer tools</p>
          <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ color: 'hsl(var(--dark-text))', fontFamily: 'var(--font-heading)' }}>
            Family Menu Manager
          </h1>
          <p className="text-lg mb-8 text-gray-700">
            Correct names, change dishes, add new assignments, or remove mistakes from the family website — no GitHub editing.
          </p>
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <Link to="/" className={buttonClass + ' text-white'} style={{ background: 'hsl(var(--primary))' }}>← Family website</Link>
            {unlocked && (
              <>
                <button type="button" onClick={() => { void loadMenu(password).then(() => setNotice('List refreshed.')).catch((err: Error) => setError(err.message)); }} disabled={busy} className={buttonClass + ' border-2 border-gray-300'}>Refresh list</button>
                <button type="button" onClick={signOut} className={buttonClass + ' border-2 border-gray-300'}>Lock page</button>
              </>
            )}
          </div>
          {error && <p role="alert" className="rounded-xl p-4 mb-5 bg-red-100 text-red-900 font-semibold">{error}</p>}
          {notice && <p role="status" className="rounded-xl p-4 mb-5 bg-green-100 text-green-900 font-semibold">{notice}</p>}

          {!unlocked ? (
            <form onSubmit={(e) => { void signIn(e); }} className="max-w-lg rounded-3xl p-7 shadow-lg border border-gray-200 bg-white">
              <h2 className="text-2xl font-black mb-3 text-gray-900">Organizer sign-in</h2>
              <p className="text-gray-700 mb-5">Enter the private organizer password you set in Netlify. It is kept in this page only until you leave or refresh.</p>
              <label htmlFor="organizer-password" className="block font-bold text-gray-900 mb-2">Organizer password</label>
              <input
                id="organizer-password" type="password" autoComplete="off" required
                className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)}
              />
              <button className={buttonClass + ' mt-5 text-white'} style={{ background: 'hsl(var(--primary))' }} disabled={busy} type="submit">
                {busy ? 'Checking…' : 'Unlock menu manager'}
              </button>
            </form>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <h2 className="text-2xl font-black" style={{ color: 'hsl(var(--dark-text))' }}>{items.length} assigned dishes</h2>
                <button type="button" className={buttonClass + ' text-white'} style={{ background: 'hsl(var(--primary))' }} onClick={() => { setDraft(emptyDish()); setNotice(''); }}>
                  + Add assignment
                </button>
              </div>

              {draft && (
                <form onSubmit={(e) => { void save(e); }} className="rounded-3xl p-6 bg-white shadow-lg border-2 border-orange-300 mb-8">
                  <h3 className="text-xl font-black mb-5 text-gray-900">{draft.id ? 'Edit assignment' : 'Add a new assignment'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="edit-dish" className="block font-bold text-gray-900 mb-2">Dish name *</label>
                      <input id="edit-dish" className={inputClass} value={draft.dish} maxLength={160} required onChange={(e) => setDraft({ ...draft, dish: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="edit-name" className="block font-bold text-gray-900 mb-2">Who's bringing it? *</label>
                      <input id="edit-name" className={inputClass} value={draft.name} maxLength={120} required onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="edit-category" className="block font-bold text-gray-900 mb-2">Category</label>
                      <select id="edit-category" className={inputClass} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="edit-serves" className="block font-bold text-gray-900 mb-2">How many does it serve? (optional)</label>
                      <input id="edit-serves" className={inputClass} maxLength={100} value={draft.serves} onChange={(e) => setDraft({ ...draft, serves: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-5">
                    <button type="submit" disabled={busy} className={buttonClass + ' text-white'} style={{ background: 'hsl(var(--primary))' }}>{busy ? 'Saving…' : 'Save changes'}</button>
                    <button type="button" disabled={busy} className={buttonClass + ' border-2 border-gray-300 text-gray-900'} onClick={() => setDraft(null)}>Cancel</button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xl font-black text-gray-900">{item.dish}</p>
                      <p className="text-gray-700"><strong>{item.name}</strong> · {item.category}{item.serves ? ` · serves ${item.serves}` : ''}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" disabled={busy} className={buttonClass + ' border-2 border-gray-300 text-gray-900'} onClick={() => { setDraft({ ...item }); setNotice(''); }}>Edit</button>
                      <button type="button" disabled={busy} className={buttonClass + ' border-2 border-red-300 text-red-800'} onClick={() => { void remove(item); }}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-700 mt-8">
                Your changes update the website's shared dish list. The separate downloadable Thanksgiving PDF does not automatically change. RSVP attendance is managed separately in Netlify Forms.
              </p>
            </>
          )}
        </div>
      </main>
    </>
  );
}
