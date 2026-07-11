import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { MdStar, MdStarHalf, MdStarOutline } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";
import PropTypes from "prop-types";
import { GiPlantRoots } from "react-icons/gi";
import { useAuth } from "../context/hooks/useAuth"; // Import auth context
import Toast from "../components/Toast/ToastMassege"; // Import the Toast component

function Review() {
  const [rating, setRating] = useState(0);
  const [reviewData, setReviewData] = useState({
    name: "",
    email: "",
    title: "",
    review: "",
    recommend: false,
    plantType: "", // Default plant type
  });
  const [errors, setErrors] = useState({});
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Get current user if available
  const [isSubmitting, setIsSubmitting] = useState(false); // Add state for submitting
  const [showToast, setShowToast] = useState(false); // Add state for toast visibility
  const [toastMessage, setToastMessage] = useState(""); // Add state for toast message

  // Initialize with existing reviews from Firestore
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const reviewsList = await response.json();
        setAllReviews(reviewsList);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Sample reviews for initial data

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReviewData({
      ...reviewData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!rating) newErrors.rating = "Please select a rating";
    if (!reviewData.name) newErrors.name = "Name is required";
    if (!reviewData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(reviewData.email))
      newErrors.email = "Email is invalid";
    if (!reviewData.title) newErrors.title = "Review title is required";
    if (!reviewData.review || reviewData.review.length < 10)
      newErrors.review = "Review must be at least 10 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const newReview = {
          name: reviewData.name,
          email: reviewData.email,
          title: reviewData.title,
          review: reviewData.review,
          rating,
          recommend: reviewData.recommend, // Make sure this field name matches
          plantType: reviewData.plantType || "Not specified",
          userId: user ? user.uid : null,
        };

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newReview),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const savedReview = await response.json();
        setAllReviews([savedReview, ...allReviews]);

        // Show success toast message
        setToastMessage("Review submitted successfully!");
        setShowToast(true);

        // Reset form after submission
        setRating(0);
        setReviewData({
          name: "",
          email: "",
          title: "",
          review: "",
          recommend: false,
          plantType: "Not specified",
        });

        // Hide toast message after 3 seconds
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      } catch (error) {
        console.error("Error adding review:", error);
        setToastMessage("Failed to submit review. Please try again.");
        setShowToast(true);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const RenderStars = ({ rating, size = 20 }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <MdStar key={`star-${i}`} size={size} className="text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <MdStarHalf key="half-star" size={size} className="text-yellow-400" />
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <MdStarOutline
          key={`empty-star-${i}`}
          size={size}
          className="text-yellow-400"
        />
      );
    }

    return <div className="flex">{stars}</div>;
  };

  // Add PropTypes validation
  RenderStars.propTypes = {
    rating: PropTypes.number.isRequired,
    size: PropTypes.number,
  };

  // Calculate average rating from all reviews
  const calculateAverageRating = () => {
    if (allReviews.length === 0) return 0;

    const sum = allReviews.reduce((total, review) => total + review.rating, 0);
    return (sum / allReviews.length).toFixed(1);
  };

  // Count reviews by star rating
  const countReviewsByRating = (starRating) => {
    return allReviews.filter(
      (review) => Math.floor(review.rating) === starRating
    ).length;
  };

  // Calculate percentage of reviews by star rating
  const calculatePercentage = (starRating) => {
    if (allReviews.length === 0) return "0%";

    const count = countReviewsByRating(starRating);
    const percentage = Math.round((count / allReviews.length) * 100);
    return `${percentage}%`;
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Adding loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <>
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1
                className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
                style={{ fontFamily: "cambria, serif" }}
              >
                Plant Reviews
              </h1>
              <p
                className="text-gray-600 dark:text-gray-400 text-lg"
                style={{ fontFamily: "cambria, serif" }}
              >
                See what our customers are saying about their Ayurvedic plant
                purchases
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Rating Summary Section */}
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Plant Ratings
                  </h2>

                  <div className="flex items-center mb-6">
                    <div className="mr-4">
                      <span className="text-5xl font-bold text-gray-900 dark:text-white">
                        {calculateAverageRating()}
                      </span>
                    </div>
                    <div>
                      <div className="flex text-yellow-400 mb-1">
                        <RenderStars
                          rating={parseFloat(calculateAverageRating())}
                          size={24}
                        />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Based on {allReviews.length} reviews
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center">
                        <div className="w-12 text-sm text-gray-700 dark:text-gray-300">
                          {star} stars
                        </div>
                        <div className="w-full ml-4">
                          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div
                              className="bg-teal-600 dark:bg-teal-500 rounded-full h-2.5"
                              style={{
                                width: calculatePercentage(star),
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-10 text-right text-sm text-gray-700 dark:text-gray-300">
                          {calculatePercentage(star)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Review Highlights
                  </h2>
                  <div className="space-y-3">
                    <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300">
                      &ldquo;Healthy plants&rdquo;
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300">
                      &ldquo;Great packaging&rdquo;
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300">
                      &ldquo;Growing well&rdquo;
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300">
                      &ldquo;Excellent care instructions&rdquo;
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Reviews List */}
              <motion.div
                className="lg:col-span-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Write a Review
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        Your Rating
                      </label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleRatingClick(value)}
                            className="text-2xl focus:outline-none"
                          >
                            {value <= rating ? (
                              <FaStar className="text-yellow-400" />
                            ) : (
                              <FaStar className="text-gray-300 dark:text-gray-600" />
                            )}
                          </button>
                        ))}
                      </div>
                      {errors.rating && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.rating}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={reviewData.name}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={reviewData.email}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="title"
                        className="block text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Review Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={reviewData.title}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Summarize your experience with the plant"
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.title}
                        </p>
                      )}
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="plantType"
                        className="block text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Plant Type
                      </label>
                      <input
                        type="text"
                        id="plantType"
                        name="plantType"
                        value={reviewData.plantType}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="What plant are you reviewing? (e.g., Tulsi, Aloe Vera)"
                      />
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="review"
                        className="block text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Your Review
                      </label>
                      <textarea
                        id="review"
                        name="review"
                        rows="4"
                        value={reviewData.review}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="How is your plant growing? Share your experience with care, growth, and benefits."
                      ></textarea>
                      {errors.review && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.review}
                        </p>
                      )}
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="recommend"
                          name="recommend"
                          checked={reviewData.recommend}
                          onChange={handleInputChange}
                          className="h-5 w-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <label
                          htmlFor="recommend"
                          className="ml-2 block text-gray-700 dark:text-gray-300"
                        >
                          I recommend this plant
                        </label>
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="mr-2 animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                          Submitting...
                        </>
                      ) : (
                        "Submit Review"
                      )}
                    </motion.button>
                  </form>
                </div>

                <div className="space-y-6">
                  {allReviews.map((review) => (
                    <motion.div
                      key={review.id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                      variants={itemVariants}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <RenderStars rating={review.rating} />
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {review.date}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                        {review.title}
                      </h3>
                      <div className="flex items-center text-sm text-teal-600 dark:text-teal-400 mb-2">
                        <GiPlantRoots className="mr-1" />
                        <span>{review.plantType}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {review.review}
                      </p>
                      <div className="flex flex-wrap items-center justify-between">
                        <div className="text-gray-600 dark:text-gray-400 text-sm mb-2 md:mb-0">
                          <span className="font-semibold">{review.name}</span>
                          {review.verified && (
                            <span className="ml-2 inline-flex items-center text-green-600 dark:text-green-400">
                              <FaRegCheckCircle className="mr-1" /> Verified
                              Purchase
                            </span>
                          )}
                        </div>
                        {review.recommend && (
                          <span className="inline-flex items-center text-teal-600 dark:text-teal-400 text-sm">
                            <FaRegCheckCircle className="mr-1" /> Would
                            recommend
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}

export default Review;
