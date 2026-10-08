// Site-wide family menu records. Updates are kept in Netlify Blobs, not in this file.
import { getStore } from '@netlify/blobs';

export const categories = ['Main Dish', 'Side Dish', 'Dessert', 'Appetizer', 'Drinks', 'Other'];
export const initialMenu = [
  {
    "id": "menu-1",
    "dish": "Fried Turkey",
    "name": "Ramon Robinson",
    "category": "Main Dish",
    "serves": "",
    "createdAt": ""
  },
  {
    "id": "menu-2",
    "dish": "Grilled Chicken",
    "name": "Jimmy Lee",
    "category": "Main Dish",
    "serves": "",
    "createdAt": ""
  },
  {
    "id": "menu-3",
    "dish": "Ribs",
    "name": "Jimmy Lee",
    "category": "Main Dish",
    "serves": "",
    "createdAt": ""
  },
  {
    "id": "menu-4",
    "dish": "Honey-Baked Ham",
    "name": "Kamron",
    "category": "Main Dish",
    "serves": "",
    "createdAt": ""
  },
  {
    "id": "menu-5",
    "dish": "Duck",
    "name": "Kim",
    "category": "Main Dish",
    "serves": "",
    "createdAt": ""
  },
  {
    "id": "menu-6",
    "dish": "Brisket",
    "name": "Uncle David",
    "category": "Main Dish",
    "serves": "",
    "createdAt": ""
  },
  {
    "id": "menu-7",
    "dish": "Fish",
    "name": "Kendrick",
    "category": "Main Dish",
    "serves": "",
    "createdAt": ""
  },
  {
    "id": "menu-8",
    "dish": "Fried Chicken",
    "name": "Kendrick",
    "category": "Main Dish",
    "serves": "",
    "createdAt": ""
  },
  {
    "id": "menu-9",
    "dish": "Mac & Cheese",
    "name": "Kesha",
    "category": "Side Dish",
    "serves": "",
    "createdAt": ""
  },
  {
    "id": "menu-10",
    "dish": "Greens",
    "name": "Kim",
    "category": "Side Dish",
    "serves": "",
    "createdAt": ""
  },
  {
    "id": "menu-11",
    "dish": "Sweet Potatoes",
    "name": "Pat",
    "category": "Side Dish",
    "serves": "",
    "createdAt": ""
  },
  {
    "id": "menu-12",
    "dish": "Dressing",
    "name": "Natasha",
    "category": "Side Dish",
    "serves": "",
    "createdAt": ""
  },
  {
    "id": "menu-13",
    "dish": "Potato Salad",
    "name": "Kesha",
    "category": "Side Dish",
    "serves": "",
    "createdAt": ""
  },
  {
    "id": "menu-14",
    "dish": "Gravy",
    "name": "Carolyn",
    "category": "Side Dish",
    "serves": "",
    "createdAt": ""
  },
  {
    "id": "menu-15",
    "dish": "Banana Cake",
    "name": "Lauretta",
    "category": "Dessert",
    "serves": "",
    "createdAt": ""
  },
  {
    "id": "menu-16",
    "dish": "German Chocolate Cake",
    "name": "Pat",
    "category": "Dessert",
    "serves": "",
    "createdAt": ""
  },
  {
    "id": "menu-17",
    "dish": "Biscoff Cheesecake",
    "name": "Kesha",
    "category": "Dessert",
    "serves": "",
    "createdAt": ""
  },
  {
    "id": "menu-18",
    "dish": "Banana Pudding",
    "name": "Kesha",
    "category": "Dessert",
    "serves": "",
    "createdAt": ""
  },
  {
    "id": "menu-19",
    "dish": "Cookies",
    "name": "Kesha",
    "category": "Dessert",
    "serves": "",
    "createdAt": ""
  }
];

function store() {
  return getStore({ name: 'lane-family-menu', consistency: 'strong' });
}

export async function readChanges() {
  const raw = await store().get('changes', { type: 'json' });
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  return raw;
}

export async function writeChanges(changes) {
  await store().setJSON('changes', changes);
}

export async function readFoodSubmissions() {
  const token = process.env.LANE_FORMS_API_TOKEN;
  const siteId = process.env.SITE_ID;
  if (!token || !siteId) throw new Error('Netlify Forms token or site ID missing');
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' };
  const api = 'https://api.netlify.com/api/v1';
  const formsResponse = await fetch(`${api}/sites/${encodeURIComponent(siteId)}/forms`, { headers });
  if (!formsResponse.ok) throw new Error(`Unable to access food forms (HTTP ${formsResponse.status})`);
  const forms = await formsResponse.json();
  const foodForm = forms.find((form) => form.name === 'lane-food');
  if (!foodForm) return [];
  const items = [];
  for (let page = 1; page <= 20; page++) {
    const response = await fetch(`${api}/forms/${encodeURIComponent(foodForm.id)}/submissions?page=${page}&per_page=100`, { headers });
    if (!response.ok) throw new Error(`Unable to read food submissions (HTTP ${response.status})`);
    const submissions = await response.json();
    for (const submission of submissions) {
      const d = submission.data || {};
      if (typeof d.dish !== 'string' || typeof d.name !== 'string') continue;
      items.push({
        id: String(submission.id),
        name: d.name.slice(0, 120),
        dish: d.dish.slice(0, 160),
        category: categories.includes(d.category) ? d.category : 'Other',
        serves: typeof d.serves === 'string' ? d.serves.slice(0, 100) : '',
        createdAt: submission.created_at || '',
      });
    }
    if (submissions.length < 100) break;
  }
  return items.reverse();
}

export async function getMenu() {
  const [forms, changes] = await Promise.all([readFoodSubmissions(), readChanges()]);
  const items = [...initialMenu, ...forms];
  const existing = new Set(items.map((item) => item.id));
  const edited = items.flatMap((item) => {
    const change = changes[item.id];
    if (change?.deleted) return [];
    if (change?.item) return [{ ...item, ...change.item, id: item.id }];
    return [item];
  });
  for (const [id, change] of Object.entries(changes)) {
    if (!existing.has(id) && !change?.deleted && change?.item && id.startsWith('admin-')) {
      edited.push({ ...change.item, id, createdAt: change.createdAt || '' });
    }
  }
  return edited;
}
