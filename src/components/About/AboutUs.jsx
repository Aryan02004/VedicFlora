import { GiHerbsBundle } from "react-icons/gi";
import { FaLeaf } from "react-icons/fa";
import { motion } from "framer-motion";

function AboutUs() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const scrollToFooter = () => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 overflow-hidden"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <GiHerbsBundle className="text-teal-600 dark:text-teal-400 text-5xl mx-auto mb-6" />
            <h1 
              className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6"
              style={{ fontFamily: "Lobster, serif" }}
            >
              Our Journey in Ayurvedic Wellness
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover the ancient wisdom of Ayurveda through our carefully curated collection of plants. 
              We&#39;re dedicated to bringing natural healing to your doorstep.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Mission & Vision Section */}
      <motion.section 
        className="py-16 bg-gray-50 dark:bg-gray-800"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 
                className="text-3xl font-bold text-gray-800 dark:text-white mb-6"
                style={{ fontFamily: "Lobster, serif" }}
              >
                Our Mission
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                To make authentic Ayurvedic plants accessible to everyone while promoting sustainable farming practices 
                and supporting local communities.
              </p>
            </div>
            <div>
              <h2 
                className="text-3xl font-bold text-gray-800 dark:text-white mb-6"
                style={{ fontFamily: "Lobster, serif" }}
              >
                Our Vision
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                To become the most trusted source of Ayurvedic plants and knowledge, helping people embrace natural healing 
                and wellness in their daily lives.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section 
        className="py-16"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 
            className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12"
            style={{ fontFamily: "Lobster, serif" }}
          >
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Authenticity",
                description: "We ensure all our products are genuine and sourced directly from trusted Nurseries."
              },
              {
                title: "Sustainability",
                description: "We promote eco-friendly planting practices and packaging to protect our environment."
              },
              {
                title: "Quality",
                description: "Every plant undergoes strict quality checks before reaching you."
              }
            ].map((value, index) => (
              <div 
                key={index}
                className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center"
              >
                <FaLeaf className="text-teal-600 dark:text-teal-400 text-3xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        className="py-16  dark:bg-gray-800"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            className="text-3xl font-bold text-gray-800 dark:text-white mb-6"
            style={{ fontFamily: "Lobster, serif" }}
          >
            Get in Touch
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Have questions? We&#39;d love to hear from you.
          </p>
          <button 
            onClick={scrollToFooter}
            className="bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-300 transform hover:scale-105"
          >
            Contact Us
          </button>
        </div>
      </motion.section>
    </div>
  );
}

export default AboutUs;