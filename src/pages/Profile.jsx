import { useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import BottomNav from "../pages/BottomNav.jsx";

const COMPLETED_KEY = "completedOrders";

export default function Profile() {
  const navigate = useNavigate();
  const userName  = localStorage.getItem("userName")  || "GetYovo User";
  const userPhone = localStorage.getItem("userPhone") || "—";
  const completedCount = useMemo(() => {
    try { return (JSON.parse(localStorage.getItem(COMPLETED_KEY) || "[]") || []).length; }
    catch { return 0; }
  }, []);

  const logout = () => {
    localStorage.setItem("isLoggedIn", "false");
    navigate("/signin", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#F7F9F5] pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-screen-sm mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#0F3D2E]">Profile</h1>
          <button onClick={logout} className="text-sm font-semibold text-white bg-[#0F3D2E] px-3 py-2 rounded-lg">
            Log out
          </button>
        </div>
      </header>

      {/* User summary */}
      <section className="max-w-screen-sm mx-auto p-4">
        <div className="bg-white rounded-2xl border border-[#0F3D2E]/12 p-4 flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-[#0F3D2E] text-white flex items-center justify-center font-bold">
            {userName.slice(0,1).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-[#0F3D2E]">{userName}</div>
            <div className="text-sm text-[#0F3D2E]/70">{userPhone}</div>
          </div>
        </div>
      </section>

      {/* Quick links / cards */}
      <section className="max-w-screen-sm mx-auto px-4 space-y-3">
        <NavLink
          to="/completed-orders"
          className="block bg-white rounded-2xl border border-[#0F3D2E]/12 p-4 hover:bg-[#F8FAF9] transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-[#0F3D2E]">Completed Orders</div>
              <div className="text-sm text-[#0F3D2E]/70">{completedCount} total</div>
            </div>
            <span className="text-[#0F3D2E]/60 text-xl">›</span>
          </div>
        </NavLink>
      </section>

      <BottomNav />
    </main>
  );
}
