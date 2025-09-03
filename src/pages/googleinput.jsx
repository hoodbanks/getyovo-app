import { useState, useRef } from "react";
import BottomNav from "../pages/BottomNav.jsx";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";



// Distance calculation
const getDistance = (vendor, userLoc) => {
  const toRad = x => (x * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(vendor.lat - userLoc.lat);
  const dLng = toRad(vendor.lng - userLoc.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(userLoc.lat)) *
      Math.cos(toRad(vendor.lat)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function VendorList() {
  const categories = [
    { name: "Restaurant", icon: "/restaurant-2-fill.png", bg: "bg-yellow-100", iconLeft: "left-5" },
    { name: "Shops", icon: "/shopping-basket-2-line.png", bg: "bg-pink-200", iconLeft: "left-3" },
    { name: "Pharmacy", icon: "/hospital-line.png", bg: "bg-blue-300", iconLeft: "left-8" },
  ];

  const [vendors, setVendors] = useState([
    { id: 1, name: "Roban Restaurant", category: "Shops", image: "./roban.jpeg", deliveryTime: "25-45 min", rating: 4.5, lat: 6.211, lng: 7.073 },
    { id: 2, name: "FreshMart", category: "Shops", image: "./freshmart.jpeg", deliveryTime: "20-35 min", rating: 4.2, lat: 6.208, lng: 7.076 },
    { id: 3, name: "PharmaPlus", category: "Pharmacy", image: "./pharmaplus.jpeg", deliveryTime: "15-30 min", rating: 4.8, lat: 6.210, lng: 7.070 },
  ]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [address, setAddress] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  const searchBoxRef = useRef(null);
  const libraries = ["places"];

  const handlePlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places.length > 0) {
      const place = places[0];
      setAddress(place.formatted_address);
      setUserLocation({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
      alert(`Address set to: ${place.formatted_address}`);
    }
  };

  // Filter vendors by search and category
  let filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(search.toLowerCase());
    if (search) return matchesSearch;
    const matchesCategory = selectedCategory ? vendor.category.includes(selectedCategory) : true;
    return matchesCategory;
  });

  // Sort by distance if userLocation exists
  if (userLocation) {
    filteredVendors.sort((a, b) => getDistance(a, userLocation) - getDistance(b, userLocation));
  }

  return (
    <main className="pt-28 pb-20">
      {/* Top Nav */}
      <nav className="border-b border-gray-400 top-0 z-50 h-26 sticky bg-white">
        <div className="flex relative bottom-4 right-2 items-center justify-between p-1">
          <img src="./yov.png" alt="" className="w-20" />

          {/* Google Places Input */}
          <LoadScript googleMapsApiKey="AIzaSyDpTvt828_Ph_6xtI6dNzL6uMagjhFdbUY" libraries={libraries}>
            <StandaloneSearchBox
              onLoad={ref => (searchBoxRef.current = ref)}
              onPlacesChanged={handlePlacesChanged}
            >
              <input
                type="text"
                placeholder="Enter new address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="flex w-50 bg-gray-200 rounded-[5px] px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </StandaloneSearchBox>
          </LoadScript>

          <img src="/shopping-cart.png" alt="" />
        </div>

        <div className="bottom-8 relative justify-center flex">
          <input
            className="w-90 p-2 rounded-[5px] bg-gray-100"
            type="search"
            placeholder="Search YOVO"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </nav>

      {/* Categories */}
      <section className="p-2 h-600">
        <h4 className="font-medium text-[20px] mb-1 text-gray-600">Explore Categories</h4>
        <div className="flex justify-between gap-2">
          {categories.map(cat => (
            <div
              key={cat.name}
              className={`justify-center rounded-[4px] p-3 ${cat.bg} w-30 grid active:border-2 hover:border cursor-pointer`}
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
            >
              <img className={`flex justify-center relative ${cat.iconLeft}`} src={cat.icon} alt={cat.name} />
              <p className="justify-center flex">{cat.name}</p>
            </div>
          ))}
        </div>

        {/* Nearby Stores */}
        <div className="mt-5">
          <h3 className="text-[20px] font-bold">Nearby Stores</h3>
        </div>

        <section>
          {filteredVendors.map(vendor => (
            <div key={vendor.id} className="w-full p-2 h-28 flex gap-3 justify-evenly bg-green-50 items-center mt-2 rounded">
              <img className="w-30 rounded-[5px]" src={vendor.image} alt={vendor.name} />
              <div>
                <p className="text-[20px] font-medium">{vendor.name}</p>
                <p>{vendor.deliveryTime}</p>
                <p>Rating: {vendor.rating}</p>
              </div>
              <input type="button" value="Check Out" className="active:bg-white p-2 bg-gray-200 rounded-[4px]" />
            </div>
          ))}

          {filteredVendors.length === 0 && (
            <p className="text-center mt-4 text-gray-500">No stores found in this location.</p>
          )}
        </section>
      </section>

      {/* Bottom Navigation */}
      <BottomNav />
    </main>
  );
}
