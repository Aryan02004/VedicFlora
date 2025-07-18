import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { BsCart3 } from "react-icons/bs";
import { Badge } from "../ui/badge.js";
import { FaArrowRightLong } from "react-icons/fa6";
import { CartContext } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import Toast from "../Toast/Toast.jsx";
import { motion } from "framer-motion";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState(null);

  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/signin");
    } else {
      addToCart(product, 1);
      setToastProduct(product);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

  const handleBlogNavigation = (product) => {
    if (product.blogSlug) {
      navigate(`/blog/${product.blogSlug}`);
    } else {
      console.error("No related blog post found for this product");
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const productList = await response.json();
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const filteredData = products.filter((item) => item.featuredProduct);

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center"
        >
          <h2
            className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
            style={{ fontFamily: "Times, serif" }}
          >
            Trending Products
          </h2>
          <Link to="/plants">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm text-gray-800 dark:text-gray-200 hover:text-gray-950 dark:hover:text-gray-400 font-semibold flex items-center gap-3 font-sans"
            >
              View All
              <FaArrowRightLong size={20} />
            </motion.button>
          </Link>
        </motion.div>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {filteredData.map((product, index) => {
            const discountedPrice = Math.round(
              product.price * (1 - product.discount / 100)
            ).toFixed(2);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1, // Stagger effect
                }}
                className={`w-full ${index > 1 ? "hidden md:block" : ""}`}
              >
                <Link to={`/plant/${product.slug}`} className="group relative">
                  <motion.div
                    className="group relative"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    {product.onSale && (
                      <Badge className="absolute z-10 right-4 top-4">
                        Sale
                      </Badge>
                    )}
                    <motion.img
                      alt={product.imageAlt}
                      src={product.image1}
                      className="aspect-square w-full rounded-md bg-gray-200 dark:bg-gray-700 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    />
                    <div className="mt-4 flex justify-between">
                      <div>
                        <h3
                          className="text-lg text-gray-800 dark:text-white line-clamp-1 font-medium"
                          style={{ fontFamily: "cambria, serif" }}
                        >
                          <span to={product.href}>
                            <span className="absolute inset-0" />
                            {product.title}
                          </span>
                        </h3>
                      </div>
                      <div className="flex items-center">
                        <span className="text-base font-semibold text-gray-900 dark:text-white">
                          ₹{discountedPrice}
                        </span>
                        <span className="ml-1 text-gray-400 dark:text-gray-500 line-through">
                          ₹{product.price}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
                <div className="mt-6 mb-auto w-full flex gap-4 font-sans">
                  {product.stock > 0 ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-teal-700 text-white py-2 gap-3 rounded-lg hover:bg-teal-900 flex items-center justify-center font-semibold"
                      onClick={() => handleAddToCart(product)}
                    >
                      <BsCart3 /> Add to Cart
                    </motion.button>
                  ) : (
                    <div className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg flex items-center justify-center font-semibold cursor-not-allowed">
                      Out of Stock
                    </div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white dark:bg-gray-900 border-2 border-teal-900 text-teal-900 dark:text-white py-2 gap-3 rounded-lg hover:bg-teal-50 dark:hover:bg-gray-700 flex items-center justify-center font-semibold"
                    onClick={() => handleBlogNavigation(product)}
                  >
                    Blog
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      {showToast && toastProduct && (
        <Toast
          product={toastProduct}
          quantity={1}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}

FeaturedProducts.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      imageSrc: PropTypes.string.isRequired,
      imageAlt: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default FeaturedProducts;
