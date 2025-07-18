import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useContext, useState } from "react";
import Toast from "../components/Toast/ToastMassege";

function OrderSummary() {
  const location = useLocation();
  const { user } = useAuth();
  const { checkout } = useContext(CartContext);
  const navigate = useNavigate();
  const state = location.state || {};
  const { cart, selectedAddress, selectedPaymentMethod } = state;
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmOrder = async () => {
    if (!user) {
      navigate("/signin");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cart,
          selectedAddress,
          selectedPaymentMethod,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      await response.json();

      // Clear the cart
      checkout();
      
      // Show toast
      setShowToast(true);
      
      // Add a slight delay before navigation to allow the toast to be seen
      setTimeout(() => {
        // Navigate to profile page with orders tab active
        navigate("/profile", { state: { activeTab: "orders" } });
      }, 1500);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cart || !selectedAddress || !selectedPaymentMethod) {
    return (
      <div className="p-6 mx-auto bg-gray-50 dark:bg-gray-900 shadow-lg rounded-lg text-gray-900 dark:text-gray-200">
        No order details available.
      </div>
    );
  }

  const totalAmount = cart.reduce((total, item) => {
    const itemPrice =
      item.product.price * (1 - (item.product.discount || 0) / 100);
    return total + itemPrice * item.quantity;
  }, 0);

  const taxAmount = totalAmount * 0.18; // 18% tax
  const finalAmount = totalAmount + taxAmount;

  return (
    <div className="p-6 mx-auto bg-gray-50 dark:bg-gray-900 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Order Summary
      </h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Shipping Address
        </h2>
        {selectedAddress && typeof selectedAddress === "object" ? (
          <p className="text-gray-700 dark:text-gray-300">
            {`${selectedAddress.street || ""}, ${selectedAddress.city || ""}, ${
              selectedAddress.state || ""
            }, ${selectedAddress.zip || ""}`}
          </p>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">
            Address not available
          </p>
        )}
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Payment Method
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          {selectedPaymentMethod === "Cash on Delivery"
            ? "Cash on Delivery"
            : selectedPaymentMethod && selectedPaymentMethod.cardHolderName
            ? `${selectedPaymentMethod.cardHolderName} - ${selectedPaymentMethod.cardNumber}`
            : "Payment method not available"}
        </p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Products
        </h2>
        {cart.map((item, index) =>
          item.product ? (
            <div
              key={index}
              className="flex items-center justify-between mb-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md"
            >
              <img
                src={item.product.image1}
                alt={item.product.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {item.product.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Quantity: {item.quantity}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Price: ₹{ Math.round( (item.product.price
                  || 0) * (1 - (item.product.discount || 0) / 100) *
                  item.quantity ).toFixed(2)}
                </p>
              </div>
            </div>
          ) : (
            <div
              key={index}
              className="flex items-center justify-between mb-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md"
            >
              <p className="text-red-500 text-sm">
                Product details not available
              </p>
            </div>
          )
        )}
      </div>
      <div className="mt-6 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md max-w-md ">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Order Total
        </h2>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">
            Total Amount :
          </span>
          <span className="text-gray-900 dark:text-white font-bold">
            ₹{Math.round(finalAmount).toFixed(2)}
          </span>
        </div>
      </div>
      <button
        onClick={handleConfirmOrder}
        disabled={isSubmitting}
        className="mt-6 w-full bg-teal-700 text-white py-3 rounded-lg hover:bg-teal-900 font-semibold flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <div className="mr-2 animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            Processing...
          </>
        ) : (
          "Confirm Order"
        )}
      </button>
      
      {showToast && (
        <Toast 
          message="Order placed successfully!" 
          onClose={() => setShowToast(false)} 
        />
      )}
    </div>
  );
}

export default OrderSummary;
