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
import Profile from "./pages/Profile.jsx"; // ← NEW
import "./index.css";
import CompletedOrders from "./pages/CompletedOrders.jsx";

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

        {/* Protected app */}
        <Route path="/vendorlist" element={<RequireAuth><VendorList /></RequireAuth>} />
        <Route path="/vendor/:id" element={<RequireAuth><ShopItems /></RequireAuth>} />
        <Route path="/cart" element={<RequireAuth><Cart /></RequireAuth>} />
        <Route path="/activeorders" element={<RequireAuth><ActiveOrders /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} /> {/* ← NEW */}
<Route path="/completed-orders" element={<RequireAuth><CompletedOrders /></RequireAuth>} />
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
