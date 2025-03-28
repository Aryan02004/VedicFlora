import PropTypes from 'prop-types';

const Toast = ({ message, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-teal-700 text-white p-4 rounded-lg shadow-lg">
      {message}
      <button onClick={onClose} className="ml-4 text-sm underline">
        Close
      </button>
    </div>
  );
};
Toast.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Toast;
