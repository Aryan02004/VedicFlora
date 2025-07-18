import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { FaTrashAlt } from "react-icons/fa";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import Shipping from "../../pages/Shipping";
import { Button } from "../ui/button";

function Checkout() {
  const { cart, updateQuantity, removeFromCart } = useContext(CartContext);

  const totalAmount = cart.reduce((total, item) => {
    const itemPrice =
      item.product.price * (1 - (item.product.discount || 0) / 100);
    return total + itemPrice * item.quantity;
  }, 0);

  const totalDiscount = cart.reduce((total, item) => {
    const discount = (item.product.price * (item.product.discount || 0)) / 100;
    return total + discount * item.quantity;
  }, 0);

  const taxAmount = totalAmount * 0.18; // 18% tax
  const finalAmount = totalAmount + taxAmount;

  const handleQuantityChange = (productId, quantity) => {
    if (quantity > 0) {
      updateQuantity(productId, quantity);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="h-screen p-6 mx-auto bg-gray-50 dark:bg-gray-900 shadow-lg rounded-lg text-gray-900 dark:text-gray-200 text-xl">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto bg-gray-50 dark:bg-gray-900 shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Checkout
      </h1>
      {cart.map((item, index) => {
        if (!item.product || !item.product.id) {
          return null; // Skip rendering if the product is invalid
        }

        return (
          <div
            key={index}
            className="flex items-center justify-between mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md"
          >
            <img
              src={item.product.image1}
              alt={item.product.title}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="ml-4 flex-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {item.product.title}
              </h2>
              <div className="flex items-center mt-2 justify-between">
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.product.id, item.quantity - 1)
                    }
                    className="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded-l-lg"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 bg-gray-100 dark:bg-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.product.id, item.quantity + 1)
                    }
                    className="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded-r-lg"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="ml-4 text-red-600 hover:text-red-800"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₹{item.product.price}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      <div className="mt-6 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Order Summary
        </h2>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">Discount</span>
          <span className="text-gray-900 dark:text-white">
            -₹{Math.round(totalDiscount).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
          <span className="text-gray-900 dark:text-white">
            ₹{Math.round(totalAmount).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">Tax</span>
          <span className="text-gray-900 dark:text-white">
            ₹{Math.round(taxAmount).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">Delivery Charges</span>
          <span className="text-teal-600 dark:text-teal-300 font-semibold">
            Free
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">Total</span>
          <span className="text-gray-900 dark:text-white">
            ₹{Math.round(finalAmount).toFixed(2)}
          </span>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className=" text-xl mt-6 w-full bg-teal-700 text-white py-5 rounded-lg hover:bg-teal-900 font-semibold">
              Proceed to Shipping
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] overflow-y-auto p-0 bg-gray-200 dark:bg-gray-800">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-2xl font-bold">
                Shipping and Payment
              </DialogTitle>
              <DialogDescription>
                Complete your shipping and payment details
              </DialogDescription>
            </DialogHeader>
            <div className="p-6">
              <Shipping />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Checkout;
