import React, { useState, useEffect } from "react";
import BottomNav from "../pages/BottomNav.jsx"; // ensure this path is correct
import { TrashIcon } from "@heroicons/react/24/outline";
import { NavLink, Outlet } from "react-router-dom";
export default function Cart() {
  const [stores, setStores] = useState([]);

  // Fake cart data
  useEffect(() => {
    const cartData = [
      {
        name: "Roban Store",
        delivery: "25-45 min",
        products: [
          { name: "Apple", price: 500, quantity: 2 },
          { name: "Banana", price: 300, quantity: 3 },
        ],
      },
      {
        name: "FreshMart",
        delivery: "15-30 min",
        products: [
          { name: "Milk", price: 400, quantity: 1 },
          { name: "Bread", price: 200, quantity: 2 },
        ],
      },
    ];
    setStores(cartData);
  }, []);

  // Update product quantity
  const handleQuantityChange = (storeIdx, productIdx, delta) => {
    setStores(prevStores => {
      const newStores = [...prevStores];
      const product = newStores[storeIdx].products[productIdx];
      product.quantity = Math.max(1, product.quantity + delta);
      return newStores;
    });
  };

  // Remove a product
  const handleRemoveProduct = (storeIdx, productIdx) => {
    setStores(prevStores => {
      const newStores = [...prevStores];
      newStores[storeIdx].products.splice(productIdx, 1);
      // Remove store if no products left
      if (newStores[storeIdx].products.length === 0) {
        newStores.splice(storeIdx, 1);
      }
      return newStores;
    });
  };

  // Paystack integration
  const handlePay = (storeIdx) => {
    const store = stores[storeIdx];
    const storeTotal = store.products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );

    const handler = window.PaystackPop.setup({
      key: "pk_live_c459831b2a87e2e5588c5afaeade06f7f8e21e6a",
      email: "customer@example.com",
      amount: storeTotal * 100, // amount in kobo
      currency: "NGN",
      ref: `yovo-${new Date().getTime()}`,
      onClose: function () {
        alert("Payment window closed.");
      },
      callback: function (response) {
        console.log("Payment successful!", response);
        // Remove store after successful payment
        setStores(prevStores => prevStores.filter((_, idx) => idx !== storeIdx));
      },
    });

    handler.openIframe();
  };

  return (
    <div className="relative min-h-screen pb-20 p-4">
      <div className="flex justify-between items-center mb-4">
  <h2 className="text-2xl font-bold">Your Cart</h2>
  <NavLink to="/activeorders" className="text-2xl font-bold">
    Active Orders
  </NavLink>
</div>

      {stores.map((store, storeIdx) => {
        const storeTotal = store.products.reduce(
          (sum, p) => sum + p.price * p.quantity,
          0
        );

        return (
          <div key={storeIdx} className="store-container p-4 bg-gray-100 rounded-lg mb-6">
            <h3 className="font-bold text-lg">{store.name}</h3>
            <p className="text-gray-600 mb-2">Delivery: {store.delivery}</p>

            <div className="products space-y-2">
              {store.products.map((product, productIdx) => (
                <div
                  key={productIdx}
                  className="product flex justify-between items-center p-2 bg-white rounded"
                >
                  <span>{product.name}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(storeIdx, productIdx, -1)}
                      className="px-2 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span>{product.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(storeIdx, productIdx, 1)}
                      className="px-2 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>

                  <span>₦{product.price * product.quantity}</span>

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemoveProduct(storeIdx, productIdx)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between items-center font-bold text-xl">
              <span>Store Total:</span>
              <span>₦{storeTotal}</span>
            </div>

            <button
              onClick={() => handlePay(storeIdx)}
              className="mt-4 w-full bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 transition-all duration-200"
            >
              Pay
            </button>
          </div>
        );
      })}

      <BottomNav />
    </div>
  );
}
