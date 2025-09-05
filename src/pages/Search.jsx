// src/pages/Search.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../pages/BottomNav.jsx";

/* ---- Same vendor list used on VendorList ---- */
const VENDORS = [
  { id: 1, name: "Roban Mart",  category: "Shops",      image: "/roban.jpeg",     rating: 4.5, lat: 6.2239, lng: 7.1185 },
  { id: 2, name: "FreshMart",   category: "Shops",      image: "/freshmart.jpeg",  rating: 4.2, lat: 6.2242, lng: 7.1190 },
  { id: 3, name: "PharmaPlus",  category: "Pharmacy",   image: "/pharmaplus.jpeg", rating: 4.8, lat: 6.2234, lng: 7.1175 },
  { id: 4, name: "Candles",     category: "Restaurant", image: "/candles.jpeg",    rating: 4.8, lat: 6.2234, lng: 7.1175 },
];

/* ---- Item catalog (same structure you use in ShopItems) ---- */
const SHOP_ITEMS = [
  { id: "s1", vendorId: "1", title: "Dog Food", price: 1500, category: "Pets",        img: "/dog.jpeg" },
  { id: "s2", vendorId: "1", title: "French Fries", price: 900, category: "Frozen",   img: "/items/fries.jpg" },
  { id: "s3", vendorId: "2", title: "Wireless Earbuds", price: 7000, category: "Electronics", img: "/items/earbuds.jpg" },
  { id: "s4", vendorId: "2", title: "Chocolate Cookies", price: 1350, category: "Snacks", img: "/items/cookies.jpg" },
];
const RESTAURANT_ITEMS = [
  { id: "r41", vendorId: "4", title: "Ogbono Soup", price: 1300, category: "Soups", img: "/ogono.jpeg" },
  { id: "r42", vendorId: "4", title: "Jollof Rice & Chicken", price: 1800, category: "Rice", img: "/jollofrice.jpeg" },
  { id: "r43", vendorId: "4", title: "Goat Meat Pepper Soup", price: 1900, category: "Soups", img: "/peppersoup.jpeg" },
  { id: "r45", vendorId: "4", title: "Coca-Cola 50cl", price: 500, category: "Drinks", img: "/coke.jpeg" },
  { id: "r46", vendorId: "4", title: "Fanta 50cl", price: 500, category: "Drinks", img: "/fanta.jpeg" },
];
const PHARMACY_ITEMS = [
  { id: "p1", vendorId: "3", title: "Paracetamol 500mg", price: 350, category: "OTC", img: "/paracetamol.jpeg" },
  { id: "p3", vendorId: "3", title: "Vitamin C 1000mg", price: 800, category: "Vitamins", img: "/vitc.jpeg" },
];

/* ---- Helpers: distance + ETA ---- */
function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function getDeliveryTime(lat1, lng1, lat2, lng2) {
  const distanceKm = getDistanceKm(lat1, lng1, lat2, lng2);
  const timeMinutes = Math.ceil((distanceKm / 30) * 60);
  const minTime = Math.max(timeMinutes - 5, 1);
  const maxTime = timeMinutes + 5;
  return `${minTime}-${maxTime} min`;
}
const formatNaira = (n) => `₦${Number(n || 0).toLocaleString()}`;

export default function Search() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("vendors"); // "vendors" | "items"
  const [q, setQ] = useState(() => localStorage.getItem("search_query") || "");
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem("recent_searches") || "[]"); }
    catch { return []; }
  });

  const userLocation = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("userLocation") || "null"); }
    catch { return null; }
  }, []);

  // Save query
  useEffect(() => localStorage.setItem("search_query", q), [q]);

  const allItems = useMemo(
    () => [...SHOP_ITEMS, ...RESTAURANT_ITEMS, ...PHARMACY_ITEMS],
    []
  );

  const vendorResults = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return VENDORS;
    return VENDORS.filter(v => v.name.toLowerCase().includes(s));
  }, [q]);

  const itemResults = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return allItems
      .filter(i => i.title.toLowerCase().includes(s))
      .map(i => ({
        ...i,
        vendor: VENDORS.find(v => String(v.id) === String(i.vendorId)),
      }));
  }, [q, allItems]);

  const addRecent = (text) => {
    const t = text.trim();
    if (!t) return;
    const next = [t, ...recent.filter(r => r !== t)].slice(0, 8);
    setRecent(next);
    localStorage.setItem("recent_searches", JSON.stringify(next));
  };
  const useRecent = (text) => setQ(text);

  return (
    <main className="min-h-screen bg-[#F7F9F5] pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-screen-sm mx-auto px-4 py-3">
          <h1 className="text-2xl font-bold text-[#0F3D2E]">Search</h1>
          <div className="mt-3 flex gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addRecent(q)}
              placeholder="Search vendors or items"
              className="flex-1 bg-gray-100 rounded-xl px-4 h-11 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              onClick={() => addRecent(q)}
              className="px-4 rounded-xl bg-[#0F3D2E] text-white font-medium"
            >
              Search
            </button>
          </div>

          {/* Mode toggle */}
          <div className="mt-3 inline-flex p-1 bg-[#EEF2EF] rounded-full">
            {["vendors","items"].map(m => {
              const active = mode === m;
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                    active ? "bg-white shadow text-[#0F3D2E]" : "text-[#0F3D2E]/70"
                  }`}
                >
                  {m === "vendors" ? "Vendors" : "Items"}
                </button>
              );
            })}
          </div>

          {/* Recent */}
          {!!recent.length && (
            <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
              {recent.map((r) => (
                <button
                  key={r}
                  onClick={() => useRecent(r)}
                  className="px-3 py-1.5 bg-[#EEF2EF] rounded-full text-sm text-[#0F3D2E]"
                >
                  {r}
                </button>
              ))}
              <button
                onClick={() => { setRecent([]); localStorage.removeItem("recent_searches"); }}
                className="ml-auto text-sm text-[#0F3D2E]/60 underline"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Results */}
      <section className="max-w-screen-sm mx-auto p-4">
        {mode === "vendors" ? (
          <div className="space-y-3">
            {vendorResults.map((v) => {
              const eta = userLocation
                ? getDeliveryTime(v.lat, v.lng, userLocation.lat, userLocation.lng)
                : "—";
              return (
                <article
                  key={v.id}
                  className="p-3 bg-white rounded-2xl border border-[#0F3D2E]/12 flex items-center gap-3"
                >
                  <img src={v.image} alt={v.name} className="h-16 w-20 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#0F3D2E]">{v.name}</div>
                    <div className="text-sm text-[#0F3D2E]/70">{eta}</div>
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/vendor/${v.id}`, {
                        state: { vendorName: v.name, vendorCategory: v.category },
                      })
                    }
                    className="px-3 py-2 rounded-lg bg-[#0F3D2E] text-white text-sm font-semibold"
                  >
                    Open store
                  </button>
                </article>
              );
            })}
            {!vendorResults.length && (
              <p className="text-center text-sm text-gray-500">No vendors match.</p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {itemResults.map((it) => (
              <button
                key={it.id}
                onClick={() =>
                  navigate(`/vendor/${it.vendorId}`, {
                    state: {
                      vendorName: it.vendor?.name || "Store",
                      vendorCategory: it.vendor?.category || "Shops",
                      prefTab: it.category,   // open correct tab
                      productId: it.id,       // 🔥 focus exact product
                    },
                  })
                }
                className="w-full text-left p-2 bg-white rounded-xl border border-[#0F3D2E]/12 flex items-center gap-3"
              >
                <img src={it.img} alt={it.title} className="h-12 w-12 rounded-lg object-cover" />
                <div className="min-w-0">
                  <div className="font-medium text-[#0F3D2E] truncate">{it.title}</div>
                  <div className="text-xs text-[#0F3D2E]/60">
                    {it.vendor?.name || "Store"} • {formatNaira(it.price)}
                  </div>
                </div>
              </button>
            ))}
            {!itemResults.length && q.trim() && (
              <p className="text-center text-sm text-gray-500">No items match.</p>
            )}
            {!q.trim() && (
              <p className="text-center text-sm text-gray-500">Start typing to find items.</p>
            )}
          </div>
        )}
      </section>

      <BottomNav />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
}
