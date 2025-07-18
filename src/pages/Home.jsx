import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import BenifitBlock from "../components/Carousel/BenifitBlock";
import ImageCarousel from "../components/Carousel/ImageCarousel";
import FeaturedProducts from "../components/Product/FeaturedProducts";
import FeaturedBlog from "../components/Blog/FeaturedBlogList";
import { GiPlantRoots, GiHerbsBundle } from "react-icons/gi";
import { FaLeaf } from "react-icons/fa";

function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <div className="dark:bg-gray-900 overflow-hidden">
      <ImageCarousel />

      {/* Welcome Banner */}
      <motion.section
        className="relative py-16 bg-gradient-to-r from-teal-50 via-white to-emerald-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 overflow-hidden m-6 p-6 rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-teal-100 dark:bg-teal-900/30 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-100 dark:bg-emerald-900/30 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-yellow-200 dark:bg-yellow-700 rounded-full blur-xl opacity-40 animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div
              className="md:w-1/2 mb-8 md:mb-0"
              variants={fadeInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.h1
                className="text-xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-800 dark:text-white"
                style={{ fontFamily: "Lobster, serif" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Welcome to{" "}
                <span className="text-teal-600 dark:text-teal-400">
                  Vedic Flora
                </span>
              </motion.h1>
              <h2
                className="text-3xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 ml-16"
                style={{ fontFamily: "cambria, serif" }}
              >
                Ancient Wisdom for Modern Wellness
              </h2>
              <p
                className="text-gray-600 dark:text-gray-300 text-lg mb-6"
                style={{ fontFamily: "cambria, serif" }}
              >
                Discover the healing power of authentic Ayurvedic plants,
                carefully cultivated using traditional methods to preserve their
                medicinal properties.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/plants">
                  <motion.button
                    className="px-8 py-3 bg-teal-700 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-teal-800 transition-colors shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <GiHerbsBundle /> Explore Plants
                  </motion.button>
                </Link>
                <Link to="/about">
                  <motion.button
                    className="px-8 py-3 border-2 border-teal-700 text-teal-700 dark:border-teal-500 dark:text-teal-500 rounded-lg font-semibold hover:bg-teal-50 dark:hover:bg-teal-950/50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Learn More
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              className=""
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative w-[38rem]">
                {/* Decorative elements */}
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-teal-100 dark:bg-teal-900/30 rounded-full z-0"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-100 dark:bg-emerald-900/30 rounded-full z-0"></div>

                {/* Decorative dots */}
                <div className="absolute top-1/4 -left-4 w-6 h-6 bg-yellow-400 dark:bg-yellow-600 rounded-full z-20 animate-pulse"></div>
                <div
                  className="absolute bottom-1/3 -right-3 w-4 h-4 bg-teal-400 dark:bg-teal-600 rounded-full z-20 animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>

                {/* Main image with enhanced shadow */}
                <img
                  src="https://c4.wallpaperflare.com/wallpaper/858/649/116/bowl-kettle-pitcher-glass-medicine-hd-wallpaper-preview.jpg"
                  alt="Ayurvedic plants"
                  className="rounded-lg shadow-[0_20px_50px_rgba(8,_112,_84,_0.2)] dark:shadow-[0_20px_50px_rgba(8,_112,_84,_0.3)] relative z-10 object-cover h-full ml-[70px]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Benefits Banner */}
      <motion.section
        className="bg-gray-50 dark:bg-gray-800/50 py-16"
        variants={fadeInVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <GiPlantRoots className="text-teal-600 dark:text-teal-400 text-4xl mx-auto mb-3" />
            <h2
              className="text-3xl font-bold text-gray-900 dark:text-white"
              style={{ fontFamily: "Lobster, serif" }}
            >
              Why Choose Vedic Flora
            </h2>
            <div className="h-1 w-24 bg-teal-500 mx-auto mt-4 mb-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaLeaf className="text-4xl text-teal-500" />,
                title: "Authentic Ayurveda",
                description:
                  "Plants sourced from trusted Ayurvedic nurseries with verified medicinal properties",
              },
              {
                icon: <GiHerbsBundle className="text-4xl text-teal-500" />,
                title: "Expert Guidance",
                description:
                  "Detailed growing instructions and usage guidelines from Ayurvedic practitioners",
              },
              {
                icon: <GiPlantRoots className="text-4xl text-teal-500" />,
                title: "Sustainable Practices",
                description:
                  "Eco-friendly cultivation methods that preserve nature's balance",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="p-4 bg-teal-50 dark:bg-teal-900/30 rounded-full inline-block mb-4">
                  {benefit.icon}
                </div>
                <h3
                  className="text-xl font-semibold text-gray-800 dark:text-white mb-3"
                  style={{ fontFamily: "cambria, serif" }}
                >
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Block */}
      <BenifitBlock />

      {/* Featured Blog Section */}
      <FeaturedBlog />

      {/* Call to Action */}
      <motion.section
        className="bg-teal-700 dark:bg-teal-800 text-white py-16"
        variants={fadeInVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-6"
            style={{ fontFamily: "Lobster, serif" }}
          >
            Begin Your Ayurvedic Journey Today
          </h2>
          <p
            className="text-xl max-w-3xl mx-auto mb-8 opacity-90"
            style={{ fontFamily: "cambria, serif" }}
          >
            Embrace the wisdom of ancient healing with our carefully curated
            Ayurvedic plants. Start your wellness journey with VedicFlora.
          </p>
          <Link to="/plants">
            <motion.button
              className="px-8 py-4 bg-white text-teal-700 rounded-lg font-bold text-lg shadow-lg hover:bg-gray-100 transition-colors"
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Shop Now
            </motion.button>
          </Link>
        </div>
      </motion.section>
    </div>
  );
}

export default Home;
