import  { useState } from 'react';
import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';

const DummyPayment = () => {
  const { checkout } = useContext(CartContext);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setPaymentSuccess(true);
      checkout();
    }, 2000); // Simulate a delay for payment processing
  };

  return (
    <div className="p-6 mx-auto bg-gray-50 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold">Payment</h1>
      {paymentSuccess ? (
        <div className="mt-4 text-green-600">Payment successful! Thank you for your purchase.</div>
      ) : (
        <div>
          <button
            onClick={handlePayment}
            className="mt-6 w-full bg-teal-700 text-white py-3 rounded-lg hover:bg-teal-900 font-semibold"
          >
            Confirm Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default DummyPayment;