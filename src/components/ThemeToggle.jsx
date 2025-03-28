import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import PropTypes from 'prop-types';

export default function ThemeToggle({className}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className= {`p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors ${className}`}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <FaMoon className="w-5 h-5 text-gray-800" />
      ) : (
        <FaSun className="w-5 h-5 text-yellow-300" />
      )}
    </button>
  );
}

ThemeToggle.propTypes = {
  className: PropTypes.string,
};
