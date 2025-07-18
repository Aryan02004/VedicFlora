import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Shipping() {
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: "",
    expiryDate: "",
    cardHolderName: "",
    cvv: "",
  });
  const [addressErrors, setAddressErrors] = useState({});
  const [paymentErrors, setPaymentErrors] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/auth/shipping-data", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch shipping data");
        }

        const data = await response.json();
        setAddresses(data.addresses);
        setPaymentMethods(data.paymentMethods);
      } catch (error) {
        console.error("Error fetching shipping data:", error);
      }
    };

    fetchUserData();
  }, []);

  const validatePaymentMethod = () => {
    const errors = {};
    if (!newPaymentMethod.cardNumber)
      errors.cardNumber = "Card number is required";
    if (!/^\d{16}$/.test(newPaymentMethod.cardNumber))
      errors.cardNumber = "Card number must be 16 digits";
    if (!newPaymentMethod.expiryDate)
      errors.expiryDate = "Expiry date is required";
    if (!/^\d{2}\/\d{2}$/.test(newPaymentMethod.expiryDate))
      errors.expiryDate = "Expiry date must be in MM/YY format";
    if (!newPaymentMethod.cardHolderName)
      errors.cardHolderName = "Card holder name is required";
    if (!newPaymentMethod.cvv) errors.cvv = "CVV is required";
    if (!/^\d{3,4}$/.test(newPaymentMethod.cvv))
      errors.cvv = "CVV must be 3 or 4 digits";
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateAddress = () => {
    const errors = {};
    if (!newAddress.street) errors.street = "Street is required";
    if (!newAddress.city) errors.city = "City is required";
    if (!newAddress.state) errors.state = "State is required";
    if (!newAddress.zip) errors.zip = "ZIP code is required";
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAddress = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/update-address", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address: newAddress }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update address");
      }
  
      const updatedAddresses = await response.json();
      setAddresses(updatedAddresses);
      setSelectedAddress(newAddress);
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  const handleSavePaymentMethod = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/update-payment-method", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentMethod: newPaymentMethod }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update payment method");
      }
  
      const updatedPaymentMethods = await response.json();
      setPaymentMethods(updatedPaymentMethods);
      setSelectedPaymentMethod(newPaymentMethod);
    } catch (error) {
      console.error("Error updating payment method:", error);
    }
  };

  const handleContinue = async () => {
    console.log("handleContinue called");
    const isPaymentMethodValid =
      selectedPaymentMethod === "Cash on Delivery"
        ? true // Skip validation for Cash on Delivery
        : selectedPaymentMethod === "Credit/Debit Card"
        ? validatePaymentMethod() // Validate new card details
        : true;

    const isAddressValid = selectedAddress !== "new" || validateAddress();

    if (!selectedAddress) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        selectedAddress: "Please select a shipping address",
      }));
    } else {
      setFormErrors((prevErrors) => ({ ...prevErrors, selectedAddress: "" }));
    }

    if (!selectedPaymentMethod) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        selectedPaymentMethod: "Please select a payment method",
      }));
    } else {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        selectedPaymentMethod: "",
      }));
    }

    console.log("isPaymentMethodValid:", isPaymentMethodValid);
    console.log("isAddressValid:", isAddressValid);
    console.log("selectedAddress:", selectedAddress);
    console.log("selectedPaymentMethod:", selectedPaymentMethod);

    if (
      isPaymentMethodValid &&
      isAddressValid &&
      selectedAddress &&
      selectedPaymentMethod
    ) {
      console.log("All validations passed");
      if (
        selectedAddress === "new" &&
        newAddress.street &&
        newAddress.city &&
        newAddress.state &&
        newAddress.zip
      ) {
        // Use the handleSaveAddress function instead of direct Firestore update
        await handleSaveAddress();
      }
      if (
        selectedPaymentMethod === "Credit/Debit Card" &&
        newPaymentMethod.cardNumber &&
        newPaymentMethod.expiryDate &&
        newPaymentMethod.cardHolderName &&
        newPaymentMethod.cvv
      ) {
        // Use the handleSavePaymentMethod function instead of direct Firestore update
        await handleSavePaymentMethod();
      }

      if (
        isPaymentMethodValid &&
        isAddressValid &&
        selectedAddress &&
        selectedPaymentMethod
      ) {
        // Parse the selectedAddress if it's a JSON string
        const addressToUse =
          typeof selectedAddress === "string" && selectedAddress !== "new"
            ? JSON.parse(selectedAddress)
            : selectedAddress === "new"
            ? newAddress
            : selectedAddress;

        const paymentMethodToUse =
          selectedPaymentMethod === "Cash on Delivery"
            ? "Cash on Delivery"
            : selectedPaymentMethod === "Credit/Debit Card"
            ? newPaymentMethod
            : JSON.parse(selectedPaymentMethod);

        navigate("/ordersummary", {
          state: {
            cart: JSON.parse(localStorage.getItem("cart")),
            selectedAddress: addressToUse,
            selectedPaymentMethod: paymentMethodToUse,
          },
        });
      }
    } else {
      console.log("Validation failed");
    }
  };

  return (
    <div className="p-6 mx-auto bg-gray-100 dark:bg-gray-900 shadow-lg rounded-lg">
      
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Select Shipping Address
        </label>
        <select
          value={selectedAddress}
          onChange={(e) => setSelectedAddress(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white mb-4"
        >
          <option value="">Select an address</option>
          <option value="new">Add New Address</option>
          {addresses.map((address, index) => (
            <option key={index} value={JSON.stringify(address)}>
              {`${address.street}, ${address.city}, ${address.state}, ${address.zip}`}
            </option>
          ))}
        </select>
        {formErrors.selectedAddress && (
          <p className="text-red-500 text-sm">{formErrors.selectedAddress}</p>
        )}
      </div>
      {selectedAddress === "new" && (
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Add New Address
          </label>
          <input
            type="text"
            placeholder="Street"
            value={newAddress.street}
            onChange={(e) =>
              setNewAddress({ ...newAddress, street: e.target.value })
            }
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white mb-2"
          />
          {addressErrors.street && (
            <p className="text-red-500 text-sm">{addressErrors.street}</p>
          )}
          <input
            type="text"
            placeholder="City"
            value={newAddress.city}
            onChange={(e) =>
              setNewAddress({ ...newAddress, city: e.target.value })
            }
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white mb-2"
          />
          {addressErrors.city && (
            <p className="text-red-500 text-sm">{addressErrors.city}</p>
          )}
          <input
            type="text"
            placeholder="State"
            value={newAddress.state}
            onChange={(e) =>
              setNewAddress({ ...newAddress, state: e.target.value })
            }
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white mb-2"
          />
          {addressErrors.state && (
            <p className="text-red-500 text-sm">{addressErrors.state}</p>
          )}
          <input
            type="text"
            placeholder="ZIP"
            value={newAddress.zip}
            onChange={(e) =>
              setNewAddress({ ...newAddress, zip: e.target.value })
            }
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          {addressErrors.zip && (
            <p className="text-red-500 text-sm">{addressErrors.zip}</p>
          )}
        </div>
      )}
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Select Payment Method
        </label>
        <select
          value={selectedPaymentMethod}
          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white mb-4"
        >
          <option value="">Select a payment method</option>
          <option value="Cash on Delivery">Cash on Delivery</option>
          <option value="Credit/Debit Card"> Add new Credit/Debit Card</option>
          {paymentMethods.map((method, index) => (
            <option key={index} value={JSON.stringify(method)}>
              {`${method.cardHolderName} - ${method.cardNumber}`}
            </option>
          ))}
        </select>
        {formErrors.selectedPaymentMethod && (
          <p className="text-red-500 text-sm">
            {formErrors.selectedPaymentMethod}
          </p>
        )}
      </div>
      {selectedPaymentMethod === "Credit/Debit Card" && (
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Add New Payment Method
          </label>
          <input
            type="text"
            placeholder="Card Number"
            value={newPaymentMethod.cardNumber}
            onChange={(e) =>
              setNewPaymentMethod({
                ...newPaymentMethod,
                cardNumber: e.target.value,
              })
            }
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white mb-2"
          />
          {paymentErrors.cardNumber && (
            <p className="text-red-500 text-sm">{paymentErrors.cardNumber}</p>
          )}
          <input
            type="text"
            placeholder="Expiry Date (MM/YY)"
            value={newPaymentMethod.expiryDate}
            onChange={(e) =>
              setNewPaymentMethod({
                ...newPaymentMethod,
                expiryDate: e.target.value,
              })
            }
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white mb-2"
          />
          {paymentErrors.expiryDate && (
            <p className="text-red-500 text-sm">{paymentErrors.expiryDate}</p>
          )}
          <input
            type="text"
            placeholder="Card Holder Name"
            value={newPaymentMethod.cardHolderName}
            onChange={(e) =>
              setNewPaymentMethod({
                ...newPaymentMethod,
                cardHolderName: e.target.value,
              })
            }
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white mb-2"
          />
          {paymentErrors.cardHolderName && (
            <p className="text-red-500 text-sm">
              {paymentErrors.cardHolderName}
            </p>
          )}
          <input
            type="text"
            placeholder="CVV"
            value={newPaymentMethod.cvv}
            onChange={(e) =>
              setNewPaymentMethod({ ...newPaymentMethod, cvv: e.target.value })
            }
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          {paymentErrors.cvv && (
            <p className="text-red-500 text-sm">{paymentErrors.cvv}</p>
          )}
        </div>
      )}
      <button
        onClick={handleContinue}
        className="mt-6 w-full bg-teal-700 text-white py-3 rounded-lg hover:bg-teal-900 font-semibold"
      >
        Continue
      </button>
    </div>
  );
}

export default Shipping;
