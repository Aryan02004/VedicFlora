import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Image from "../../assets/vedic-circle.png";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

function Footer() {
  // Add animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-sky-50 via-sky-100 to-sky-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" style={{ fontFamily: "cambria, serif" }}>
      {/* Decorative Elements */}
      <motion.div 
        className="absolute top-0 left-0 w-full overflow-hidden h-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-teal-400 to-teal-500"></div>
        <svg
          className="absolute top-1 left-0 w-full h-10 text-teal-500/10"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </motion.div>

      <motion.div 
        className="relative mx-auto w-full max-w-screen-xl px-4 py-16 z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
      >
        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div 
            variants={itemVariants}
            className="space-y-6 bg-white dark:bg-gray-800/40 p-6 rounded-xl backdrop-blur-sm"
          >
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative overflow-hidden rounded-full p-1 bg-gradient-to-br from-teal-500 to-teal-600 transition-all duration-300 group-hover:from-teal-600 group-hover:to-teal-700">
                <img
                  src={Image}
                  className="h-16 w-auto transition-transform duration-300 group-hover:scale-110"
                  alt="VedicFlora Logo"
                />
              </div>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed"
              >
              Experience the power of traditional Ayurvedic products for your
              health and wellness journey.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            variants={itemVariants}
            className="p-6 bg-white dark:bg-gray-800/40 rounded-xl backdrop-blur-sm"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Quick Links
              <motion.div 
                className="h-1 w-12 bg-gradient-to-r from-teal-500 to-teal-600 mt-2 rounded-full"
                whileInView={{ scaleX: [0, 1] }}
                transition={{ duration: 0.5 }}
              />
            </h3>
            <ul className="space-y-3">
              {["About", "Plants", "Blog", "Nursery"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="group flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
                  >
                    <span className="h-px w-0 bg-teal-500 transition-all duration-300 group-hover:w-4"></span>
                    <span className="transition-all duration-300 group-hover:translate-x-2">
                      {item}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div 
            variants={itemVariants}
            className="p-6 bg-white dark:bg-gray-800/40 rounded-xl backdrop-blur-sm"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Customer Service
              <motion.div 
                className="h-1 w-12 bg-gradient-to-r from-teal-500 to-teal-600 mt-2 rounded-full"
                whileInView={{ scaleX: [0, 1] }}
                transition={{ duration: 0.5 }}
              />
            </h3>
            <ul className="space-y-3">
              {[
                "Shipping Policy",
                "Return Policy",
                "Terms & Conditions",
                "Privacy Policy",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="group flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
                  >
                    <span className="h-px w-0 bg-teal-500 transition-all duration-300 group-hover:w-4"></span>
                    <span className="transition-all duration-300 group-hover:translate-x-2">
                      {item}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            variants={itemVariants}
            className="p-6 bg-white dark:bg-gray-800/40 rounded-xl backdrop-blur-sm"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Contact Us
              <motion.div 
                className="h-1 w-12 bg-gradient-to-r from-teal-500 to-teal-600 mt-2 rounded-full"
                whileInView={{ scaleX: [0, 1] }}
                transition={{ duration: 0.5 }}
              />
            </h3>
            <div className="space-y-4">
              {[
                { Icon: MdEmail, text: "info@vedicflora.com" },
                { Icon: FaPhoneAlt, text: "+91 1234567890" },
                { Icon: FaMapMarkerAlt, text: "Ahmedabad, India" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group flex items-center space-x-3 text-gray-600 dark:text-gray-400"
                >
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-teal-500 dark:group-hover:bg-teal-600 transition-colors duration-300">
                    <item.Icon className="w-4 h-4 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
          <motion.div 
            className="pt-4 flex items-center justify-center space-x-4"
            variants={itemVariants}
          >
            {[FaFacebook, FaTwitter, FaInstagram, FaWhatsapp].map(
              (Icon, index) => (
                <Link
                  key={index}
                  to="#"
                  className="p-2 bg-slate-200 dark:bg-gray-700 rounded-lg hover:bg-teal-500 dark:hover:bg-teal-600 group transition-colors duration-300"
                >
                  <Icon className="w-5 h-5 text-gray-900 dark:text-gray-400 group-hover:text-white transition-colors duration-300" />
                </Link>
              )
            )}
          </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} VedicFlora. All rights reserved.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}

export default Footer;
