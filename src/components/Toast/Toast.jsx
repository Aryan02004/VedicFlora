import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const Toast = ({ product, quantity, onClose }) => {
  const navigate = useNavigate();
  const discountedPrice = Math.round(product.price * (1 - product.discount / 100) * quantity).toFixed(2);

  const handleCheckout = () => {
    navigate('/checkout');
    onClose();
  };

  return (
    <div className="z-30 fixed bottom-4 right-4 bg-white text-black p-4 rounded-lg shadow-lg w-64">
      <div className="flex items-center">
        <img src={product.image1} alt={product.title} className="w-16 h-16 object-cover rounded-lg" />
        <div className="ml-4">
          <h2 className="text-lg font-semibold">{product.title}</h2>
          <p className="text-sm text-gray-600">Quantity: {quantity}</p>
          <p className="text-sm text-gray-600">Total: ₹{discountedPrice}</p>
        </div>
      </div>
      <button
        onClick={handleCheckout}
        className="mt-4 w-full bg-teal-700 text-white py-2 rounded-lg hover:bg-teal-900 font-semibold"
      >
        Checkout
      </button>
      <button onClick={onClose} className="mt-2 w-full text-sm underline text-teal-700">
        Close
      </button>
    </div>
  );
};

Toast.propTypes = {
  product: PropTypes.object.isRequired,
  quantity: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Toast;
