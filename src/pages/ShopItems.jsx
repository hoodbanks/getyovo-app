// src/pages/ShopItems.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BottomNav from "./BottomNav.jsx";

/* ---------- CATEGORY SETS BY VENDOR TYPE ---------- */
const CATEGORY_SETS = {
  Shops: ["All", "Pets", "Frozen", "Electronics", "Snacks"],
  Restaurant: ["All", "Soups", "Swallow", "Rice", "Grills", "Drinks"],
  Pharmacy: ["All", "Prescription", "OTC", "Personal Care", "Vitamins", "Devices"],
};

/* ---------- DEMO DATA (replace with your backend data) ---------- */
const SHOP_ITEMS = [
  { id: "s1", vendorId: "1", title: "Dog Food", price: 1500, category: "Pets", img: "/dog.jpeg" },
  { id: "s2", vendorId: "1", title: "French Fries", price: 900, category: "Frozen", img: "/items/fries.jpg", oldPrice: 900 },
  { id: "s3", vendorId: "2", title: "Wireless Earbuds", price: 7000, category: "Electronics", img: "/items/earbuds.jpg" },
  { id: "s4", vendorId: "2", title: "Chocolate Cookies", price: 1350, category: "Snacks", img: "/items/cookies.jpg", badge: "10% OFF" },
];

const RESTAURANT_ITEMS = [
  { id: "r1", vendorId: "1", title: "Egusi Soup", price: 1200, category: "Soups", img: "/egusi.jpeg" },
  { id: "r2", vendorId: "1", title: "Jollof Rice", price: 1000, category: "Rice", img: "/jollof.jpeg" },
  { id: "r3", vendorId: "2", title: "Chicken Suya", price: 1500, category: "Grills", img: "/items/suya.jpg" },
  { id: "r4", vendorId: "2", title: "Eba & Ogbono", price: 1300, category: "Swallow", img: "/items/ogbono.jpg" },

  // Candles (vendorId "4")
  { id: "r41", vendorId: "4", title: "Ogbono Soup", price: 1300, category: "Soups", img: "/ogono.jpeg" },
  { id: "r42", vendorId: "4", title: "Jollof Rice & Chicken", price: 1800, category: "Rice", img: "/jollofrice.jpeg" },
  { id: "r43", vendorId: "4", title: "Goat Meat Pepper Soup", price: 1900, category: "Soups", img: "/peppersoup.jpeg" },
  { id: "r44", vendorId: "4", title: "Eba & Egusi", price: 1600, category: "Swallow", img: "/egusi.jpeg" },

  { id: "r45", vendorId: "4", title: "Coca-Cola 50cl",     price: 500,  category: "Drinks", img: "/coke.jpeg" },
  { id: "r46", vendorId: "4", title: "Fanta 50cl",         price: 500,  category: "Drinks", img: "/fanta.jpeg" },
  { id: "r47", vendorId: "4", title: "Sprite 50cl",        price: 500,  category: "Drinks", img: "/sprite.jpeg" },
  { id: "r48", vendorId: "4", title: "Bottled Water 75cl", price: 300,  category: "Drinks", img: "/water.jpeg" },
  { id: "r49", vendorId: "4", title: "Malt 33cl",          price: 800,  category: "Drinks", img: "/malt.jpeg" },
  { id: "r50", vendorId: "4", title: "Chapman",            price: 1200, category: "Drinks", img: "/chapman.jpeg" },
];

const PHARMACY_ITEMS = [
  { id: "p1", vendorId: "3", title: "Paracetamol 500mg", price: 350, category: "OTC", img: "/paracetamol.jpeg" },
  { id: "p2", vendorId: "3", title: "Amoxicillin 500mg", price: 1200, category: "Prescription", img: "/items/amox.jpg", rx: true },
  { id: "p3", vendorId: "3", title: "Vitamin C 1000mg", price: 800, category: "Vitamins", img: "/vitc.jpeg" },
  { id: "p4", vendorId: "3", title: "Digital Thermometer", price: 2500, category: "Devices", img: "/items/thermo.jpg" },
];

/* ---------- DEFAULT ADD-ONS for Restaurant (non-Drinks) ---------- */
const DEFAULT_ADDONS = [
  { id: "meat", label: "Meat", price: 500, max: 2 },
  { id: "fish", label: "Fish", price: 700, max: 2 },
  { id: "pomo", label: "Pomo", price: 400, max: 2 },
];

/* ---------- CART HELPER ---------- */
function addToCartLS(vendorId, vendorName, payload) {
  const key = "cart";
  const cart = JSON.parse(localStorage.getItem(key) || "[]");
  const idx = cart.findIndex((g) => String(g.vendorId) === String(vendorId));
  if (idx === -1) cart.push({ vendorId, vendorName, items: [payload] });
  else {
    const itIdx = cart[idx].items.findIndex(
      (i) => i.id === payload.id && JSON.stringify(i.options) === JSON.stringify(payload.options)
    );
    if (itIdx === -1) cart[idx].items.push(payload);
    else cart[idx].items[itIdx].qty += payload.qty;
  }
  localStorage.setItem(key, JSON.stringify(cart));
}

/* ---------- PAGE ---------- */
export default function ShopItems() {
  const { id: vendorId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const vendorName = state?.vendorName || "Vendor Items";
  const vendorCategory = state?.vendorCategory || "Shops";
  const TABS = CATEGORY_SETS[vendorCategory] || CATEGORY_SETS.Shops;

  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [qty, setQty] = useState({});
  const [customizing, setCustomizing] = useState(null);
  const [addonCounts, setAddonCounts] = useState({});

  // reset tab on vendor type change
  useEffect(() => {
    const first = (CATEGORY_SETS[vendorCategory] || CATEGORY_SETS.Shops)[0];
    setActiveTab(first);
  }, [vendorCategory]);

  // items for current vendor + tab
  const items = useMemo(() => {
    const src =
      vendorCategory === "Restaurant" ? RESTAURANT_ITEMS :
      vendorCategory === "Pharmacy"  ? PHARMACY_ITEMS  :
                                       SHOP_ITEMS;

    const scoped = src.filter((i) => !vendorId || String(i.vendorId) === String(vendorId));
    return activeTab === "All"
      ? scoped
      : scoped.filter((i) => (i.category || "").toLowerCase() === activeTab.toLowerCase());
  }, [vendorCategory, vendorId, activeTab]);

  // default qty = 1 per visible item
  useEffect(() => {
    const m = {};
    items.forEach((i) => (m[i.id] = 1));
    setQty(m);
  }, [items]);

  const dec = (id) => setQty((q) => ({ ...q, [id]: Math.max((q[id] || 1) - 1, 1) }));
  const inc = (id) => setQty((q) => ({ ...q, [id]: (q[id] || 1) + 1 }));

  // modal helpers
  const openCustomize = (item) => {
    if (vendorCategory !== "Restaurant" || (item.category || "").toLowerCase() === "drinks") return;
    setCustomizing(item);
    const init = {};
    DEFAULT_ADDONS.forEach((a) => (init[a.id] = 0));
    setAddonCounts(init);
  };
  const closeCustomize = () => setCustomizing(null);

  const addAddon = (id, max) =>
    setAddonCounts((m) => ({ ...m, [id]: Math.min((m[id] || 0) + 1, max ?? 99) }));
  const subAddon = (id) =>
    setAddonCounts((m) => ({ ...m, [id]: Math.max((m[id] || 0) - 1, 0) }));

  const formatNaira = (n) => `₦${Number(n || 0).toLocaleString()}`;

  const modalTotal = useMemo(() => {
    if (!customizing) return 0;
    const base = customizing.price || 0;
    const extras = DEFAULT_ADDONS.reduce(
      (sum, a) => sum + (addonCounts[a.id] || 0) * a.price,
      0
    );
    return base + extras;
  }, [customizing, addonCounts]);

  const addCustomizedToCart = () => {
    if (!customizing) return;
    const chosen = DEFAULT_ADDONS
      .filter((a) => (addonCounts[a.id] || 0) > 0)
      .map((a) => ({ id: a.id, label: a.label, qty: addonCounts[a.id], unitPrice: a.price }));

    addToCartLS(vendorId, vendorName, {
      id: customizing.id,
      title: customizing.title,
      img: customizing.img,
      basePrice: customizing.price,
      price: modalTotal,
      qty: 1,
      options: chosen.length ? { addons: chosen } : undefined,
    });
    closeCustomize();
  };

  const addSimpleToCart = (item) => {
    const count = qty[item.id] || 1;
    addToCartLS(vendorId, vendorName, {
      id: item.id,
      title: item.title,
      img: item.img,
      basePrice: item.price,
      price: item.price,
      qty: count,
      options: undefined,
    });
  };

  return (
    <main className="min-h-screen bg-[#F7F9F5] pb-20">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 animate-rise">
        <div className="max-w-screen-sm mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-[#0F3D2E] text-lg active:scale-[0.96] transition">←</button>
          <h1 className="text-2xl font-bold text-[#0F3D2E]">{vendorName}</h1>
        </div>

        {/* TABS */}
        <div className="max-w-screen-sm mx-auto px-2">
          <div className="flex gap-6 overflow-x-auto no-scrollbar px-2">
            {(CATEGORY_SETS[vendorCategory] || CATEGORY_SETS.Shops).map((tab) => {
              const active = tab === activeTab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 text-[16px] font-semibold whitespace-nowrap border-b-2 transition ${
                    active ? "text-[#0F3D2E] border-[#0F3D2E]" : "text-[#0F3D2E]/60 border-transparent hover:text-[#0F3D2E]"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* BODY */}
      {vendorCategory === "Pharmacy" ? (
        <section className="max-w-screen-sm mx-auto p-4 space-y-3">
          {items.length === 0 ? (
            <p className="text-center text-sm text-gray-500">No items yet.</p>
          ) : (
            items.map((item, idx) => (
              <article
                key={item.id}
                style={{ animationDelay: `${60 * idx}ms` }}
                className="bg-white rounded-xl border border-[#0F3D2E]/12 p-3 flex gap-3 items-center animate-rise-slow"
              >
                <img src={item.img} alt={item.title} className="h-16 w-16 object-cover rounded-md" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[#0F3D2E]">{item.title}</h3>
                    {item.rx && <span className="text-[10px] px-2 py-0.5 bg-red-500 text-white rounded-full">RX</span>}
                  </div>
                  <div className="text-sm text-[#0F3D2E]/70">{formatNaira(item.price)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button className="px-3 py-2 text-[18px] active:scale-[0.96]" onClick={() => dec(item.id)}>–</button>
                    <div className="w-10 text-center">{qty[item.id] || 1}</div>
                    <button className="px-3 py-2 text-[18px] active:scale-[0.96]" onClick={() => inc(item.id)}>+</button>
                  </div>
                  <button
                    onClick={() => addSimpleToCart(item)}
                    className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-[0.98] transition"
                  >
                    Add
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      ) : vendorCategory === "Restaurant" ? (
        <section className="max-w-screen-sm mx-auto p-4 grid grid-cols-2 gap-4">
          {items.length === 0 ? (
            <p className="col-span-2 text-center text-sm text-gray-500">No items yet.</p>
          ) : (
            items.map((item, idx) => {
              const isDrink = (item.category || "").toLowerCase() === "drinks";
              return (
                <article
                  key={item.id}
                  style={{ animationDelay: `${50 * idx}ms` }}
                  className="bg-white rounded-2xl border border-[#0F3D2E]/12 overflow-hidden animate-rise-slow"
                >
                  <div className={!isDrink ? "cursor-pointer" : ""} onClick={() => !isDrink && openCustomize(item)}>
                    <img src={item.img} alt={item.title} className="h-28 w-full object-cover" loading="lazy" />
                    <div className="p-3">
                      <h3 className="text-[16px] font-semibold text-[#0F3D2E] leading-snug">{item.title}</h3>
                      <div className="mt-1 text-[15px] font-semibold text-[#0F3D2E]">{formatNaira(item.price)}</div>
                    </div>
                  </div>

                  {isDrink ? (
                    <div className="px-3 pb-3 flex items-center gap-2">
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button className="px-3 py-2 text-[18px] active:scale-[0.96]" onClick={() => dec(item.id)}>–</button>
                        <div className="w-10 text-center">{qty[item.id] || 1}</div>
                        <button className="px-3 py-2 text-[18px] active:scale-[0.96]" onClick={() => inc(item.id)}>+</button>
                      </div>
                      <button
                        onClick={() => addSimpleToCart(item)}
                        className="ml-auto px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-[0.98] transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ) : (
                    <div className="px-3 pb-3">
                      <button
                        onClick={() => openCustomize(item)}
                        className="w-full px-3 py-2 rounded-lg bg-[#0F3D2E] text-white text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </section>
      ) : (
        <section className="max-w-screen-sm mx-auto p-4 grid grid-cols-2 gap-4">
          {items.length === 0 ? (
            <p className="col-span-2 text-center text-sm text-gray-500">No items yet.</p>
          ) : (
            items.map((item, idx) => (
              <article
                key={item.id}
                style={{ animationDelay: `${50 * idx}ms` }}
                className="bg-white rounded-2xl border border-[#0F3D2E]/12 overflow-hidden animate-rise-slow"
              >
                <div className="relative">
                  <img src={item.img} alt={item.title} className="h-28 w-full object-cover" loading="lazy" />
                  {item.badge && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-[11px] px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-[16px] font-semibold text-[#0F3D2E] leading-snug">{item.title}</h3>
                  <div className="mt-1">
                    {item.oldPrice && <div className="text-sm text-[#0F3D2E]/60 line-through">{formatNaira(item.oldPrice)}</div>}
                    <div className="text-[15px] font-semibold text-[#0F3D2E]">{formatNaira(item.price)}</div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button className="px-3 py-2 text-[18px] active:scale-[0.96]" onClick={() => dec(item.id)}>–</button>
                      <div className="w-10 text-center">{qty[item.id] || 1}</div>
                      <button className="px-3 py-2 text-[18px] active:scale-[0.96]" onClick={() => inc(item.id)}>+</button>
                    </div>
                    <button
                      onClick={() => addSimpleToCart(item)}
                      className="ml-auto px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-[0.98] transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      )}

      <BottomNav />

      {/* Utilities + animations */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes rise { 0% {opacity:0; transform: translateY(12px)} 100% {opacity:1; transform: translateY(0)} }
        @keyframes riseSlow { 0% {opacity:0; transform: translateY(16px)} 100% {opacity:1; transform: translateY(0)} }
        @keyframes pop { 0% {opacity:0; transform: scale(.96)} 100% {opacity:1; transform: scale(1)} }
        .animate-rise { animation: rise .5s ease-out both }
        .animate-rise-slow { animation: riseSlow .65s ease-out both }
        .animate-pop { animation: pop .2s ease-out both }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </main>
  );
}
