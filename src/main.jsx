// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/home.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUP.jsx";
import VendorList from "./pages/vendorlist.jsx";
import ShopItems from "./pages/ShopItems.jsx";
import Cart from "./pages/Cart.jsx";
import ActiveOrders from "./pages/ActiveOrders.jsx";
import Profile from "./pages/Profile.jsx";
import CompletedOrders from "./pages/CompletedOrders.jsx";
import Search from "./pages/Search.jsx";

// ⬇️ NEW PAGES
import ResetPassword from "./pages/ResetPassword.jsx";
import VerifyOtp from "./pages/VerifyOTP.jsx";

import "./index.css";

function RequireAuth({ children }) {
  const authed = localStorage.getItem("isLoggedIn") === "true";
  return authed ? children : <Navigate to="/signin" replace />;
}

function RequireGuest({ children }) {
  const authed = localStorage.getItem("isLoggedIn") === "true";
  return authed ? <Navigate to="/vendorlist" replace /> : children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Landing + auth: only for guests */}
        <Route path="/" element={<RequireGuest><Home /></RequireGuest>} />
        <Route path="/signin" element={<RequireGuest><SignIn /></RequireGuest>} />
        <Route path="/signup" element={<RequireGuest><SignUp /></RequireGuest>} />

        {/* Password reset flow (guests only) */}
        <Route path="/reset-password" element={<RequireGuest><ResetPassword /></RequireGuest>} />
        <Route path="/verify-otp" element={<RequireGuest><VerifyOtp /></RequireGuest>} />
        {/* Optional aliases so old links keep working */}
        <Route path="/forgot" element={<Navigate to="/reset-password" replace />} />
        <Route path="/forgot-password" element={<Navigate to="/reset-password" replace />} />

        {/* Protected app */}
        <Route path="/vendorlist" element={<RequireAuth><VendorList /></RequireAuth>} />
        <Route path="/vendor/:id" element={<RequireAuth><ShopItems /></RequireAuth>} />
        <Route path="/cart" element={<RequireAuth><Cart /></RequireAuth>} />
        <Route path="/activeorders" element={<RequireAuth><ActiveOrders /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/completed-orders" element={<RequireAuth><CompletedOrders /></RequireAuth>} />
        <Route path="/search" element={<RequireAuth><Search /></RequireAuth>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
