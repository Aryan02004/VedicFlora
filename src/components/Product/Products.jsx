import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { BsCart3 } from "react-icons/bs";
import { Badge } from "../ui/badge.js";
import Toast from "../Toast/Toast.jsx";
import { CartContext } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
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
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Update the container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  // Update the item variants
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200 text-xl"
            style={{ fontFamily: "cambria, serif" }}
          >
            Please wait, loading Plants...
            <Loader className="animate-spin w-12 h-12" />
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible" // Changed from whileInView to animate
            className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
          >
            {products.map((product) => {
              const discountedPrice = Math.round(
                product.price * (1 - product.discount / 100)
              ).toFixed(2);
              return (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  className="w-full"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to={`/plant/${product.slug}`}
                      className="group relative"
                    >
                      <div className="group relative overflow-hidden">
                        <motion.img
                          alt={product.imageAlt}
                          src={product.image1}
                          className="aspect-square w-full rounded-md bg-gray-200 dark:bg-gray-700 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                        {product.onSale && (
                          <Badge className="absolute z-10 right-4 top-4">
                            Sale
                          </Badge>
                        )}

                        <div className="mt-4 flex justify-between">
                          <div>
                            <h3
                              className="text-lg text-gray-700 dark:text-white line-clamp-1 font-medium"
                              style={{ fontFamily: "cambria, serif" }}
                            >
                              <span to={product.href}>
                                <span
                                  aria-hidden="true"
                                  className="absolute inset-0 font-bold"
                                />
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
                      </div>
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
                </motion.div>
              );
            })}
          </motion.div>
        )}
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

Products.propTypes = {
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

export default Products;
