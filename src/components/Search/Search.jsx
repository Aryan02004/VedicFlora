import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { db } from "../../../firebase.js";
import { collection, getDocs } from "firebase/firestore";
import { Link } from 'react-router-dom';

const Search = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResults(productList);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  const filteredResults = results.filter(product =>
    product.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 dark:bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Search Products</h2>
          <button onClick={onClose} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-xl">&times;</button>
        </div>
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg mb-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="Search for products..."
        />
        <ul className="max-h-60 overflow-y-auto">
          {query && filteredResults.length > 0 ? (
            filteredResults.map(product => (
              <li key={product.id} className="mb-2 flex items-center">
                <img src={product.image1} alt={product.title} className="w-12 h-12 object-cover rounded-lg mr-4" />
                <Link to={`/plant/${product.slug}`} onClick={onClose} className="text-teal-700 dark:text-teal-400 hover:underline">
                  {product.title}
                </Link>
              </li>
            ))
          ) : (
            query && <li className="text-gray-600 dark:text-gray-300">No products found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

Search.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Search;
