import { useAuth } from "../context/hooks/useAuth";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Toast from "../components/Toast/ToastMassege";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { FaTrashAlt } from "react-icons/fa";

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState(null);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [address, setAddress] = useState({
    id: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [paymentMethod, setPaymentMethod] = useState({
    id: "",
    cardNumber: "",
    expiryDate: "",
    cardHolderName: "",
    cvv: "",
  });
  const [paymentErrors, setPaymentErrors] = useState({
    cardNumber: "",
    expiryDate: "",
    cardHolderName: "",
    cvv: "",
  });
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // 'address' or 'payment'
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isOrderCancelDialogOpen, setIsOrderCancelDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    phoneNumber: "",
  });
  const [isCancelling, setIsCancelling] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/auth/profile`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const userData = await response.json();
          setUserData(userData); // Ensure this sets the state correctly
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const orders = await response.json();
        setUserData((prev) => ({ ...prev, orders }));
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [user]);

  // Add this to Profile.jsx
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const openAddressDialog = (
    address = { id: "", street: "", city: "", state: "", zip: "" }
  ) => {
    setAddress(address);
    setIsAddressDialogOpen(true);
  };

  const openPaymentDialog = (
    paymentMethod = {
      id: "",
      cardNumber: "",
      expiryDate: "",
      cardHolderName: "",
      cvv: "",
    }
  ) => {
    setPaymentMethod(paymentMethod);
    setIsPaymentDialogOpen(true);
  };

  const closeAddressDialog = () => {
    setIsAddressDialogOpen(false);
  };

  const closePaymentDialog = () => {
    setIsPaymentDialogOpen(false);
  };

  const handleSaveAddress = async () => {
    if (user) {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/update-address`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ address }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update address");
        }

        const updatedAddresses = await response.json();
        setUserData((prev) => ({ ...prev, addresses: updatedAddresses }));
        closeAddressDialog();
      } catch (error) {
        console.error("Error updating address:", error);
      }
    }
  };

  const validatePaymentMethod = () => {
    let errors = {
      cardNumber: "",
      expiryDate: "",
      cardHolderName: "",
      cvv: "",
    };
    let isValid = true;

    if (!paymentMethod.cardNumber) {
      errors.cardNumber = "Card number is required";
      isValid = false;
    } else if (!/^\d{16}$/.test(paymentMethod.cardNumber)) {
      errors.cardNumber = "Card number must be 16 digits";
      isValid = false;
    }

    if (!paymentMethod.expiryDate) {
      errors.expiryDate = "Expiry date is required";
      isValid = false;
    } else if (!/^\d{2}\/\d{2}$/.test(paymentMethod.expiryDate)) {
      errors.expiryDate = "Expiry date must be in MM/YY format";
      isValid = false;
    }

    if (!paymentMethod.cardHolderName) {
      errors.cardHolderName = "Card holder name is required";
      isValid = false;
    }

    if (!paymentMethod.cvv) {
      errors.cvv = "CVV is required";
      isValid = false;
    } else if (!/^\d{3,4}$/.test(paymentMethod.cvv)) {
      errors.cvv = "CVV must be 3 or 4 digits";
      isValid = false;
    }

    setPaymentErrors(errors);
    return isValid;
  };

  const handleSavePaymentMethod = async () => {
    if (validatePaymentMethod() && user) {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/update-payment-method`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ paymentMethod }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update payment method");
        }

        const updatedPaymentMethods = await response.json();
        setUserData((prev) => ({
          ...prev,
          paymentMethods: updatedPaymentMethods,
        }));
        closePaymentDialog();
      } catch (error) {
        console.error("Error updating payment method:", error);
      }
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (user) {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/delete-address/${addressId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete address");
        }

        const updatedAddresses = await response.json();
        setUserData((prev) => ({ ...prev, addresses: updatedAddresses }));
      } catch (error) {
        console.error("Error deleting address:", error);
      }
    }
  };

  const handleDeletePaymentMethod = async (paymentMethodId) => {
    if (user) {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/delete-payment-method/${paymentMethodId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete payment method");
        }

        const updatedPaymentMethods = await response.json();
        setUserData((prev) => ({
          ...prev,
          paymentMethods: updatedPaymentMethods,
        }));
      } catch (error) {
        console.error("Error deleting payment method:", error);
      }
    }
  };

  const confirmOrderCancellation = (orderId) => {
    setOrderToCancel(orderId);
    setIsOrderCancelDialogOpen(true);
  };

  const handleCancelOrder = async () => {
    if (user && orderToCancel) {
      try {
        setIsCancelling(true); // Set loading state to true
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/cancel-order`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ orderId: orderToCancel }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to cancel order");
        }

        const updatedOrders = await response.json();
        setUserData((prev) => ({ ...prev, orders: updatedOrders }));

        // Close dialog and reset state
        setIsOrderCancelDialogOpen(false);
        setOrderToCancel(null);

        // Show success toast
        setToastMessage("Order cancelled successfully");
        setShowToast(true);

        // Auto hide toast after 3 seconds
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      } catch (error) {
        console.error("Error cancelling order:", error);

        // Show error toast
        setToastMessage("Failed to cancel order. Please try again.");
        setShowToast(true);
      } finally {
        setIsCancelling(false); // Reset loading state
      }
    }
  };

  const openProfileDialog = () => {
    setProfileData({
      fullName: userData?.fullName || "",
      phoneNumber: userData?.phoneNumber || "",
    });
    setIsProfileDialogOpen(true);
  };

  // Add this function to handle saving profile changes
  const handleSaveProfile = async () => {
    if (user) {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/update-profile`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              fullName: profileData.fullName,
              phoneNumber: profileData.phoneNumber,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update profile");
        }

        const updatedUserData = await response.json();
        setUserData(updatedUserData); // Update state with updated data
        setIsProfileDialogOpen(false); // Close dialog
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
      }
    }
  };

  return (
    <div className="mx-auto p-6 bg-gray-100 dark:bg-gray-900">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        User Profile
      </h2>
      <div className="flex flex-wrap gap-4 mb-8">
        {["profile", "orders", "addresses", "Card Details"].map((tab) => (
          <button
            key={tab}
            className={`px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 ${
              activeTab === tab
                ? "bg-teal-700 text-white shadow-lg"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-gray-600"
            }`}
            onClick={() => handleTabClick(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg ">
        {activeTab === "profile" && (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow-lg w-full max-w-2xl transform transition-all duration-300 hover:shadow-xl min-h-[55vh]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Profile Details
                </h3>
              </div>
              {userData && (
                <div className="space-y-6 h-full">
                  <div className="flex items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    {userData ? (
                      <div className="w-16 h-16 bg-teal-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        <div className="hidden sm:block">
                          {userData?.fullName?.charAt(0) || ""}
                        </div>
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        Loading...
                      </div>
                    )}
                    <div className="md:ml-6 flex-1">
                      <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-2">
                        <span className="font-bold text-gray-800 dark:text-white">
                          Name:{" "}
                        </span>
                        {userData.fullName}
                      </p>
                      <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-2">
                        <span className="font-bold text-gray-800 dark:text-white">
                          Email:{" "}
                        </span>
                        {userData.email}
                      </p>
                      {userData.phoneNumber && (
                        <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400">
                          <span className="font-bold text-gray-800 dark:text-white">
                            Phone:{" "}
                          </span>
                          {userData.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={logout}
                      className=" flex-1 w-full px-6 py-3  bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 text-lg font-semibold "
                    >
                      Logout
                    </button>
                    {/* <Link to="/admin">
                      <button className=" flex-1 w-full px-6 py-3  bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 text-lg font-semibold ">
                        Admin
                      </button>
                    </Link> */}
                    <button
                      onClick={openProfileDialog}
                      className="bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center justify-center gap-2 flex-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === "orders" && (
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Order History
            </h3>
            {userData?.orders?.length > 0 ? (
              [...userData.orders]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((order) => (
                  <div
                    key={order.id}
                    className="mb-6 p-6 bg-slate-50 dark:bg-gray-700 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          Order #{order.id.slice(-8)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(order.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-teal-700 dark:text-teal-400">
                          ₹{order.totalAmount.toFixed(2)}
                        </p>
                        <span
                          className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                            order.status === "Order Cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Items section remains the same */}
                    <div className="mt-4 space-y-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Items
                      </h4>
                      <div className="grid gap-4">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center p-4 bg-stone-100 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow duration-200"
                          >
                            <img
                              src={item.product.image1}
                              alt={item.product.title}
                              className="w-20 h-20 object-cover rounded-lg shadow-sm"
                            />
                            <div className="ml-6 flex-1">
                              <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                                {item.product.title}
                              </h5>
                              <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Quantity: {item.quantity}
                                </p>
                                <p className="font-medium text-teal-700 dark:text-teal-400">
                                  ₹
                                  {Math.round(
                                    item.product.price *
                                      (1 - (item.product.discount || 0) / 100) *
                                      item.quantity
                                  ).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping and payment info with cancel button */}
                    <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Shipping Address
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {`${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.zip}`}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Payment Method
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {order.paymentMethod === "Cash on Delivery"
                            ? "Cash on Delivery"
                            : `${order.paymentMethod.cardHolderName} - ${order.paymentMethod.cardNumber}`}
                        </p>
                      </div>
                    </div>

                    {/* Add cancel order button if order is not already cancelled */}
                    {order.status !== "Order Cancelled" && (
                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={() => confirmOrderCancellation(order.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <p className="text-gray-700 dark:text-gray-300">
                No orders found.
              </p>
            )}
          </div>
        )}
        {activeTab === "addresses" && (
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Saved Addresses
            </h3>
            <button
              onClick={() => openAddressDialog()}
              className="mb-4 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700"
            >
              Add New Address
            </button>
            {userData?.addresses
              ?.filter(
                (addr) => addr.street && addr.city && addr.state && addr.zip
              )
              .map((addr) => (
                <div
                  key={addr.id}
                  className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg max-w-lg"
                >
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Street:</strong> {addr.street}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>City:</strong> {addr.city}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>State:</strong> {addr.state}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>ZIP:</strong> {addr.zip}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => openAddressDialog(addr)}
                      className="bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setItemToDelete(addr.id);
                        setDeleteType("address");
                        setIsDeleteDialogOpen(true);
                      }}
                      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
        {activeTab === "Card Details" && (
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Saved Cards
            </h3>
            <button
              onClick={() => openPaymentDialog()}
              className="mb-4 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700"
            >
              Add New Card Details
            </button>
            {userData?.paymentMethods
              ?.filter(
                (method) =>
                  method.cardNumber &&
                  method.expiryDate &&
                  method.cardHolderName &&
                  method.cvv
              )
              .map((method) => (
                <div
                  key={method.id}
                  className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg max-w-sm"
                >
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Card Number:</strong> {method.cardNumber}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Expiry Date:</strong> {method.expiryDate}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Card Holder Name:</strong> {method.cardHolderName}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => openPaymentDialog(method)}
                      className="bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setItemToDelete(method.id);
                        setDeleteType("payment");
                        setIsDeleteDialogOpen(true);
                      }}
                      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      <Dialog
        open={isOrderCancelDialogOpen}
        onOpenChange={setIsOrderCancelDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={handleCancelOrder}
              className="bg-red-500 hover:bg-red-600"
            >
              Cancel Order
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Keep Order</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {address.id ? "Edit Address" : "Add New Address"}
            </DialogTitle>
            <DialogDescription>
              Make changes to your address here. Click save when you&#39;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="street" className="text-right">
                Street
              </Label>
              <Input
                id="street"
                value={address.street}
                onChange={(e) =>
                  setAddress({ ...address, street: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">
                City
              </Label>
              <Input
                id="city"
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="state" className="text-right">
                State
              </Label>
              <Input
                id="state"
                value={address.state}
                onChange={(e) =>
                  setAddress({ ...address, state: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="zip" className="text-right">
                ZIP
              </Label>
              <Input
                id="zip"
                value={address.zip}
                onChange={(e) =>
                  setAddress({ ...address, zip: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveAddress}>Save</Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {paymentMethod.id ? "Edit Card Details" : "Add New Card"}
            </DialogTitle>
            <DialogDescription>
              Make changes to your Card Details here. Click save when you&#39;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cardNumber" className="text-right">
                Card Number
              </Label>
              <Input
                id="cardNumber"
                value={paymentMethod.cardNumber}
                onChange={(e) =>
                  setPaymentMethod({
                    ...paymentMethod,
                    cardNumber: e.target.value,
                  })
                }
                className="col-span-3"
              />
              {paymentErrors.cardNumber && (
                <p className="col-span-4 text-red-500 text-sm">
                  {paymentErrors.cardNumber}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiryDate" className="text-right">
                Expiry Date
              </Label>
              <Input
                id="expiryDate"
                value={paymentMethod.expiryDate}
                onChange={(e) =>
                  setPaymentMethod({
                    ...paymentMethod,
                    expiryDate: e.target.value,
                  })
                }
                className="col-span-3"
              />
              {paymentErrors.expiryDate && (
                <p className="col-span-4 text-red-500 text-sm">
                  {paymentErrors.expiryDate}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cardHolderName" className="text-right">
                Card Holder Name
              </Label>
              <Input
                id="cardHolderName"
                value={paymentMethod.cardHolderName}
                onChange={(e) =>
                  setPaymentMethod({
                    ...paymentMethod,
                    cardHolderName: e.target.value,
                  })
                }
                className="col-span-3"
              />
              {paymentErrors.cardHolderName && (
                <p className="col-span-4 text-red-500 text-sm">
                  {paymentErrors.cardHolderName}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cvv" className="text-right">
                CVV
              </Label>
              <Input
                id="cvv"
                value={paymentMethod.cvv}
                onChange={(e) =>
                  setPaymentMethod({ ...paymentMethod, cvv: e.target.value })
                }
                className="col-span-3"
              />
              {paymentErrors.cvv && (
                <p className="col-span-4 text-red-500 text-sm">
                  {paymentErrors.cvv}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSavePaymentMethod}>Save</Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {deleteType}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                if (deleteType === "address") {
                  handleDeleteAddress(itemToDelete);
                } else if (deleteType === "payment") {
                  handleDeletePaymentMethod(itemToDelete);
                }
                setIsDeleteDialogOpen(false);
                setItemToDelete(null);
                setDeleteType(null);
              }}
              className="bg-red-500 hover:bg-red-700"
            >
              Delete
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isOrderCancelDialogOpen}
        onOpenChange={setIsOrderCancelDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Order Cancellation</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This will permanently
              remove it from your order history.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={handleCancelOrder}
              className="bg-red-500 hover:bg-red-700"
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <div className="mr-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Cancelling...
                </>
              ) : (
                "Cancel Order"
              )}
            </Button>
            <DialogClose asChild>
              <Button variant="outline" disabled={isCancelling}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription style={{ fontFamily: "cambria, serif" }}>
              Make changes to your profile information here. Click save when
              you&#39;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">
                Full Name
              </Label>
              <Input
                id="fullName"
                value={profileData.fullName}
                onChange={(e) =>
                  setProfileData({ ...profileData, fullName: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                value={profileData.phoneNumber}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    phoneNumber: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={userData?.email || ""}
                disabled
                className="col-span-3 bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-70"
              />
              <p className="col-span-4 text-right text-xs text-gray-500">
                Email cannot be changed
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveProfile}>Save Changes</Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
};

export default Profile;
