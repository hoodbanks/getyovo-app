// main.jsx or index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUP.jsx";
import VendorList from "./pages/vendorlist.jsx"; // <-- your updated list
import Cart from "./pages/Cart.jsx";
import ActiveOrders from "./pages/ActiveOrders.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Make VendorList the single source of truth for “Home” */}
        <Route path="/" element={<VendorList />} />

        {/* Other screens */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/activeorders" element={<ActiveOrders />} />

        {/* Redirect legacy paths to the new home */}
        <Route path="/vendorlist" element={<Navigate to="/" replace />} />
        <Route path="/home" element={<Navigate to="/" replace />} />

        {/* Catch-all → home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
