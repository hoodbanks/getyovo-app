import { useState, useRef, useEffect } from "react";
import BottomNav from "../pages/BottomNav.jsx";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";

// ✅ Fixed distance calculation
function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ✅ Fixed delivery time with console logs
function getDeliveryTime(lat1, lng1, lat2, lng2) {
  const distanceKm = getDistanceKm(lat1, lng1, lat2, lng2);
  const avgSpeedKmH = 30; // average delivery speed in km/h
  const timeHours = distanceKm / avgSpeedKmH;
  const timeMinutes = Math.ceil(timeHours * 60);

  console.log("🚚 Distance:", distanceKm.toFixed(3), "km | Time:", timeMinutes, "min");

  const minTime = Math.max(timeMinutes - 5, 1); // allow 1 min minimum
  const maxTime = timeMinutes + 5;
  return `${minTime}-${maxTime} min`;
}

export default function VendorList() {
  const categories = [
    { name: "Restaurant", icon: "/restaurant-2-fill.png", bg: "bg-yellow-100", iconLeft: "left-5" },
    { name: "Shops", icon: "/shopping-basket-2-line.png", bg: "bg-pink-200", iconLeft: "left-3" },
    { name: "Pharmacy", icon: "/hospital-line.png", bg: "bg-blue-300", iconLeft: "left-8" },
  ];

  // ✅ Vendors set to Awka
  const [vendors] = useState([
    { id: 1, name: "Roban Mart", category: "Shops", image: "./roban.jpeg", deliveryTime: "25-45 min", rating: 4.5, lat: 6.2239, lng: 7.1185 },
    { id: 2, name: "FreshMart", category: "Shops", image: "./freshmart.jpeg", deliveryTime: "20-35 min", rating: 4.2, lat: 6.2242, lng: 7.1190 },
    { id: 3, name: "PharmaPlus", category: "Pharmacy", image: "./pharmaplus.jpeg", deliveryTime: "15-30 min", rating: 4.8, lat: 6.2234, lng: 7.1175 },
  ]);

  const [search, setSearch] = useState(() => localStorage.getItem("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(() => localStorage.getItem("category") || null);
  const [address, setAddress] = useState(() => localStorage.getItem("address") || "");
  const [userLocation, setUserLocation] = useState(() => {
    const loc = localStorage.getItem("userLocation");
    return loc ? JSON.parse(loc) : null;
  });

  useEffect(() => localStorage.setItem("search", search), [search]);
  useEffect(() => localStorage.setItem("category", selectedCategory), [selectedCategory]);
  useEffect(() => localStorage.setItem("address", address), [address]);
  useEffect(() => localStorage.setItem("userLocation", JSON.stringify(userLocation)), [userLocation]);

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
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ lat: latitude, lng: longitude });

          console.log("📍 Current Location:", latitude, longitude);

          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
            if (status === "OK" && results[0]) {
              setAddress(results[0].formatted_address);
            }
          });
        },
        (err) => {
          console.error("Error fetching location", err);
        }
      );
    } else {
      alert("Geolocation not supported by your browser.");
    }
  };

  let filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = vendor.name.toLowerCase().includes(search.toLowerCase());
    if (search) return matchesSearch;
    const matchesCategory = selectedCategory ? vendor.category.includes(selectedCategory) : true;
    return matchesCategory;
  });

  const MAX_DISTANCE_KM = 50; // keep vendors within 50 km
  if (userLocation) {
    filteredVendors = filteredVendors
      .filter((vendor) => getDistanceKm(vendor.lat, vendor.lng, userLocation.lat, userLocation.lng) <= MAX_DISTANCE_KM)
      .sort(
        (a, b) =>
          getDistanceKm(a.lat, a.lng, userLocation.lat, userLocation.lng) -
          getDistanceKm(b.lat, b.lng, userLocation.lat, userLocation.lng)
      );
  }

  return (
    <main className="pb-20">
      <nav className="border-b border-gray-400 top-0 z-50 h-26 sticky bg-white">
        <div className="flex relative bottom-4 right-2 items-center justify-evenly p-1">
          <img src="./yov.png" alt="" className="w-20" />

          <LoadScript googleMapsApiKey="AIzaSyDpTvt828_Ph_6xtI6dNzL6uMagjhFdbUY" libraries={libraries}>
            <div className="relative flex items-center w-60">
              <StandaloneSearchBox
                onLoad={(ref) => (searchBoxRef.current = ref)}
                onPlacesChanged={handlePlacesChanged}
              >
                <input
                  type="text"
                  placeholder="Enter new address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="flex w-full bg-gray-200 rounded-[5px] px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </StandaloneSearchBox>

              {/* 📍 Current location button */}
              <button
                onClick={handleUseCurrentLocation}
                className="absolute right-2 text-gray-600 hover:text-blue-600"
                type="button"
              >
                📍
              </button>
            </div>
          </LoadScript>

          <img src="/shopping-cart.png" alt="" />
        </div>

        <div className="bottom-8 relative justify-center flex">
          <input
            className="w-90 p-2 rounded-[5px] bg-gray-100"
            type="search"
            placeholder="Search YOVO"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </nav>

      <section className="p-2 h-600">
        <h4 className="font-medium text-[20px] mb-1 text-gray-600">Explore Categories</h4>
        <div className="flex justify-between gap-2">
          {categories.map((cat) => (
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

        <div className="mt-5">
          <h3 className="text-[20px] font-bold">Nearby Stores</h3>
        </div>

        <section>
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="w-full p-2 h-28 flex gap-3 justify-evenly bg-green-50 items-center mt-2 rounded"
            >
              <img className="w-30 rounded-[5px]" src={vendor.image} alt={vendor.name} />
              <div>
                <p className="text-[20px] font-medium">{vendor.name}</p>
                <p>
                  {userLocation
                    ? getDeliveryTime(vendor.lat, vendor.lng, userLocation.lat, userLocation.lng)
                    : vendor.deliveryTime}
                </p>
                <p>Rating: {vendor.rating}</p>
              </div>
              <input
                type="button"
                value="Check Out"
                className="active:bg-white p-2 bg-gray-200 rounded-[4px]"
              />
            </div>
          ))}

          {filteredVendors.length === 0 && (
            <p className="text-center mt-4 text-gray-500">None nearby.</p>
          )}
        </section>
      </section>

      <BottomNav />
    </main>
  );
}
