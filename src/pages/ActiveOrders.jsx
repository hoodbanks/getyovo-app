import { NavLink } from "react-router-dom";
import BottomNav from "../pages/BottomNav.jsx";

export default function ActiveOrders() {
  return (
    <div className="relative min-h-screen pb-20 p-4">
      <h2 className="text-2xl font-bold mb-4">Active Orders</h2>

      {/* Example active orders */}
      <div className="store-container p-4 bg-gray-100 rounded-lg mb-6">
        <h3 className="font-bold text-lg">Roban Store</h3>
        <p className="text-gray-600 mb-2">Delivery in progress</p>

        <div className="products space-y-2">
          <div className="product flex justify-between items-center p-2 bg-white rounded">
            <span>Apple</span>
            <span>Qty: 2</span>
          </div>
          <div className="product flex justify-between items-center p-2 bg-white rounded">
            <span>Banana</span>
            <span>Qty: 3</span>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
