// src/pages/Profile.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../pages/BottomNav.jsx";

export default function Profile() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      navigate("/signin", { replace: true });
    }
  }, [navigate]);

  const phone = localStorage.getItem("phone") || "Not set";

  const handleSignOut = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("phone");
    window.location.replace("/"); // back to landing, prevents back-swipe
  };

  return (
    <main className="min-h-screen bg-[#F7F9F5] pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-screen-sm mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-[#0F3D2E]">Profile</h1>
        </div>
      </header>

      <section className="max-w-screen-sm mx-auto p-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 border border-[#0F3D2E]/10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-[#0F3D2E] text-white grid place-items-center text-lg font-bold">
              {phone.replace(/\D/g, "").slice(-2) || "U"}
            </div>
            <div>
              <div className="font-semibold text-[#0F3D2E]">Phone</div>
              <div className="text-sm text-[#0F3D2E]/70 break-all">{phone}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#0F3D2E]/10">
          <button
            onClick={handleSignOut}
            className="w-full h-12 rounded-xl bg-red-600 text-white font-semibold hover:opacity-95"
          >
            Log out
          </button>
          <p className="text-xs mt-2 text-[#0F3D2E]/60">
            Logging out won’t clear your cart or active orders.
          </p>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
