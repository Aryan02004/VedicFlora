import { useState, useEffect } from "react";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GiHerbsBundle } from "react-icons/gi";
import { motion } from "framer-motion";

function BenifitBlock() {
  const testimonials = [
    {
      text: "The Ayurvedic products from VedicFlora have transformed my daily wellness routine. Their authentic herbs and traditional formulations have made a significant difference in my overall health.",
      name: "Priya Sharma",
      title: "Yoga Instructor",
      image: "/femaleY.png",
    },
    {
      text: "I'm impressed by the quality and purity of their products. The customer service team is highly knowledgeable about Ayurvedic principles and helped me choose the perfect products.",
      name: "Rajesh Kumar",
      title: "Wellness Coach",
      image: "/male.png",
    },
    {
      text: "VedicFlora's commitment to sustainable sourcing and traditional Ayurvedic practices is commendable. Their products have helped me maintain balance in my busy lifestyle.",
      name: "Anita Desai",
      title: "Ayurveda Enthusiast",
      image: "/femaleA.png",
    },
  ];

  function TestimonialsCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Add auto-sliding functionality
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000); // Change slide every 4 seconds

      return () => clearInterval(timer);
    }, []);

    const handlePrev = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
      );
    };

    const handleNext = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    };

    // Animation variants
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.2,
        },
      },
    };

    const itemVariants = {
      hidden: {
        opacity: 0,
        y: 50,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.8,
          ease: "easeOut",
        },
      },
    };

    return (
      <div className="bg-gradient-to-b from-gray-50 dark:from-gray-900 to-teal-50/30 dark:to-gray-800 py-16">
        <motion.div
          className="max-w-6xl mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          // viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <GiHerbsBundle className="text-teal-600 dark:text-teal-400 text-4xl mx-auto mb-4" />
            <h2
              className="text-3xl font-medium text-gray-800 dark:text-white mb-2 tracking-wider"
              style={{ fontFamily: "Lobster, serif" }}
            >
              What Our Customers Say
            </h2>
            <p
              className="text-pink-500 dark:text-red-300 text-xl"
              style={{ fontFamily: "cambria, serif" }}
            >
              Discover the healing power of Ayurveda through their experiences
            </p>
          </motion.div>

          <motion.div
            className="relative bg-gray-100 dark:bg-gray-900 rounded-2xl shadow-xl p-8 md:p-12 border-2 border-gray-950 dark:border-gray-200 hover:border-gray-300 dark:hover:border-gray-600"
            variants={itemVariants}
          >
            <FaQuoteLeft className="text-teal-500/20 dark:text-teal-400/20 text-6xl absolute top-8 left-8" />

            {/* Navigation Buttons */}
            <motion.button
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-teal-50 dark:bg-teal-700 text-teal-600 dark:text-teal-200 hover:bg-teal-100 dark:hover:bg-teal-600 transition-colors"
              aria-label="Previous testimonial"
            >
              <FaChevronLeft className="text-xl" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-teal-50 dark:bg-teal-700 text-teal-600 dark:text-teal-200 hover:bg-teal-100 dark:hover:bg-teal-600 transition-colors"
              aria-label="Next testimonial"
            >
              <FaChevronRight className="text-xl" />
            </motion.button>

            <motion.div
              className="relative z-10 max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.p
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-gray-900 dark:text-gray-300 text-lg md:text-xl leading-relaxed mb-8"
                style={{ fontFamily: "Geneva, serif" }}
              >
                {testimonials[currentIndex].text}
              </motion.p>

              <motion.div
                className="flex flex-col items-center"
                variants={itemVariants}
              >
                <motion.img
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  className="w-20 h-20 rounded-full border-4 border-teal-50 dark:border-teal-700 shadow-lg mb-4"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                />
                <h3
                  className="font-medium text-gray-800 dark:text-white text-lg tracking-wider"
                  style={{ fontFamily: "Lobster, serif" }}
                >
                  {testimonials[currentIndex].name}
                </h3>
                <p className="text-teal-600 dark:text-teal-400">
                  {testimonials[currentIndex].title}
                </p>
              </motion.div>
            </motion.div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === currentIndex
                      ? "bg-teal-600 dark:bg-teal-400"
                      : "bg-teal-200 dark:bg-teal-700 hover:bg-teal-300 dark:hover:bg-teal-600"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return <TestimonialsCarousel />;
}

export default BenifitBlock;
