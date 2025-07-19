import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Loader } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";
import { CartContext } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import Toast from "../Toast/Toast";
import { motion } from "framer-motion";

function Slug() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchProductBySlug = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/${slug}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const productData = await response.json();
        setProduct(productData);
        setMainImage(productData.image1);
      } catch (error) {
        console.error("Error fetching product by slug:", error);
      }
    };

    fetchProductBySlug();
  }, [slug]);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
        Please Wait...
        <Loader className="animate-spin w-12 h-12" />
      </div>
    );
  }

  const discountedPrice = Math.round(
    product.price * (1 - product.discount / 100)
  ).toFixed(2);

  const images = [
    product.image1,
    product.image2,
    product.image3,
    product.image4,
  ].filter(Boolean);

  const handleAddToCart = () => {
    if (!user) {
      navigate("/signin");
    } else {
      addToCart(product, quantity);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

  const handleBlogNavigation = () => {
    if (product.blogSlug) {
      navigate(`/blog/${product.blogSlug}`);
    } else {
      console.error("No related blog post found for this product");
    }
  };

  return (
    <div className="flex flex-col md:flex-row p-6 mx-auto bg-gray-50 dark:bg-gray-900 shadow-lg">
      <div className="flex-1">
        <img
          src={mainImage}
          alt={product.title}
          className="w-full h-auto max-h-[34rem] object-cover rounded-lg"
        />
        <div className="flex justify-center mt-4 gap-3">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt="Thumbnail"
              className={`w-16 h-16 cursor-pointer border-2 rounded-lg ${
                mainImage === image
                  ? "border-rose-400"
                  : "border-gray-300 dark:border-gray-700"
              }`}
              onClick={() => setMainImage(image)}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 md:ml-10">
        <h1
          className="text-3xl font-bold mt-4 text-gray-900 dark:text-white"
          style={{ fontFamily: "Times, serif" }}
        >
          {product.title}
        </h1>
        <p
          className="text-gray-600 dark:text-gray-300 my-10 font-sans text-lg"
          style={{ fontFamily: "cambria, serif" }}
        >
          {product.description}
        </p>

        <div className="flex items-center mt-4">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ₹{discountedPrice}
          </span>
          <span className="ml-2 text-sm bg-teal-700 text-white px-2 py-1 rounded">
            {product.discount}% OFF
          </span>
          <span className="ml-3 text-gray-400 dark:text-gray-500 line-through">
            ₹{product.price}
          </span>
        </div>

        <div className="flex items-center my-5 text-teal-900 dark:text-teal-400 gap-3">
          <FaStar fill="orange" size={20} />
          {product.rating} / 5
        </div>

        <div className="flex items-center mt-4 border p-2 rounded-lg w-max bg-gray-200 dark:bg-gray-700">
          <button
            className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-l"
            onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
          >
            -
          </button>
          <span className="px-4 text-gray-900 dark:text-white">{quantity}</span>
          <button
            className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-r"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </button>
        </div>

        <div className="mt-14 w-full flex gap-4 font-sans">
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
      </div>
      {showToast && (
        <Toast
          product={product}
          quantity={quantity}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}

Slug.propTypes = {
  params: PropTypes.shape({
    slug: PropTypes.string.isRequired,
  }).isRequired,
};

export default Slug;
