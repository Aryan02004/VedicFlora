import { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { PiShoppingCartLight } from "react-icons/pi";
import { GoSearch } from "react-icons/go";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons for hamburger menu
import Image from "../../assets/vedic-flora.png";
import Search from "../Search/Search";
import { useAuth } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext"; // Import CartContext
import ThemeToggle from "../ThemeToggle";
import { FaRegCircleUser } from "react-icons/fa6";
import { motion } from "framer-motion";

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user} = useAuth(); // Get user and logout function from useAuth
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleSearchOpen = () => {
    setShowSearch(true);
  };

  const handleSearchClose = () => {
    setShowSearch(false);
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate("/signin");
    } else {
      navigate("/checkout");
    }
  };



  // Calculate the number of products in the cart
  const uniqueProductsCount = cart.length;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className="shadow sticky z-50 top-0 bg-gray-50 dark:bg-gray-900"
      style={{ fontFamily: "Times, serif" }}
    >
      <nav className="border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link to="/" className="flex items-center">
            {/* Logo image with responsive sizing and animation */}
            <motion.div
              initial={{ opacity: 0, x: -20, rotate: -90 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{
                duration: 0.8,
                type: "spring",
                stiffness: 100,
                delay: 0.2,
              }}
              className="flex-shrink-0"
            >
              <motion.img
                src={Image}
                className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 mr-2 sm:mr-3"
                alt="Vedic Flora Logo"
              />
            </motion.div>

            {/* Text logo with responsive text size */}
            <motion.span
              style={{ fontFamily: "Dancing Script, serif" }}
              className="font-medium text-xl sm:text-2xl md:text-3xl text-gray-900 dark:text-white truncate"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Vedic Flora
            </motion.span>
          </Link>

          {/* Header icons and buttons */}
          <div className="flex items-center lg:order-2">
            <button
              onClick={handleSearchOpen}
              className="block py-2 pr-3 pl-3 duration-200 text-gray-800 dark:text-gray-200 hover:text-teal-900 dark:hover:text-teal-400 lg:pr-4 "
            >
              <GoSearch size={23} />
            </button>
            <button
              onClick={handleAddToCart}
              className="relative py-2 pr-3 pl-3 duration-200 text-gray-800 dark:text-gray-200 hover:text-teal-900 dark:hover:text-teal-400 lg:p-0 hidden sm:inline-block"
            >
              <PiShoppingCartLight size={26} />
              {uniqueProductsCount > 0 && (
                <span className="absolute top-3 left-[14px] inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-teal-600 rounded-full">
                  {uniqueProductsCount}
                </span>
              )}
            </button>
            {user ? (
              <div className="flex items-center">
                <NavLink
                  to="/profile"
                  className="text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 font-medium rounded-lg text-base sm:text-lg px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 mr-1 sm:mr-2 focus:outline-none tracking-wide flex items-center"
                >
                  <FaRegCircleUser className="mr-1 sm:mr-2" size={20} />
                  <span className="hidden sm:inline">Profile</span>
                </NavLink>

              </div>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 font-medium rounded-lg text-sm sm:text-base lg:text-lg px-2 sm:px-3 lg:px-5 py-1 sm:py-1.5 lg:py-2.5 mr-1 sm:mr-2 focus:outline-none hidden sm:inline-block"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="text-white bg-teal-700 dark:bg-teal-600 hover:bg-teal-600 dark:hover:bg-teal-500 focus:ring-4 focus:ring-orange-300 dark:focus:ring-orange-500 font-medium rounded-lg text-sm sm:text-base lg:text-lg px-2 sm:px-3 lg:px-5 py-1 sm:py-1.5 lg:py-2.5 mr-1 sm:mr-2 focus:outline-none"
                >
                  Get started
                </Link>
              </>
            )}
            {/* Only show theme toggle in desktop view */}
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
            <button
              onClick={toggleMobileMenu}
              className="text-gray-800 dark:text-gray-200 lg:hidden focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <FaTimes size={24} className="sm:ml-4" />
              ) : (
                <FaBars size={24} className="sm:ml-4" />
              )}
            </button>
          </div>
          <div
            className={`${
              isMobileMenuOpen ? "flex" : "hidden"
            } justify-between items-center w-full lg:flex lg:w-auto lg:order-1`}
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0 w-full">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `relative block py-2 pr-4 pl-3 duration-200 ${
                      isActive
                        ? "text-teal-900 dark:text-teal-400"
                        : "text-gray-800 dark:text-gray-200"
                    } border-b border-gray-100 dark:border-gray-700 lg:hover:bg-transparent lg:border-0 hover:text-teal-900 dark:hover:text-teal-400 lg:p-0 group text-lg`
                  }
                >
                  Home
                  <span className="absolute bottom-[-5px] left-0 w-full h-0.5 bg-teal-800 dark:bg-teal-400 scale-x-0 transition-transform duration-300 ease-in-out origin-center group-hover:scale-x-100"></span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/plants"
                  className={({ isActive }) =>
                    `relative block py-2 pr-4 pl-3 duration-200 ${
                      isActive
                        ? "text-teal-900 dark:text-teal-400"
                        : "text-gray-800 dark:text-gray-200"
                    } border-b border-gray-100 dark:border-gray-700 lg:hover:bg-transparent lg:border-0 hover:text-teal-900 dark:hover:text-teal-400 lg:p-0 group text-lg`
                  }
                >
                  Plants
                  <span className="absolute bottom-[-5px] left-0 w-full h-0.5 bg-teal-800 dark:bg-teal-400 scale-x-0 transition-transform duration-300 ease-in-out origin-center group-hover:scale-x-100"></span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/blog"
                  className={({ isActive }) =>
                    `relative block py-2 pr-4 pl-3 duration-200 ${
                      isActive
                        ? "text-teal-900 dark:text-teal-400"
                        : "text-gray-800 dark:text-gray-200"
                    } border-b border-gray-100 dark:border-gray-700 lg:hover:bg-transparent lg:border-0 hover:text-teal-900 dark:hover:text-teal-400 lg:p-0 group text-lg`
                  }
                >
                  Blog
                  <span className="absolute bottom-[-5px] left-0 w-full h-0.5 bg-teal-800 dark:bg-teal-400 scale-x-0 transition-transform duration-300 ease-in-out origin-center group-hover:scale-x-100"></span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/nursery"
                  className={({ isActive }) =>
                    `relative block py-2 pr-4 pl-3 duration-200 ${
                      isActive
                        ? "text-teal-900 dark:text-teal-400"
                        : "text-gray-800 dark:text-gray-200"
                    } border-b border-gray-100 dark:border-gray-700 lg:hover:bg-transparent lg:border-0 hover:text-teal-900 dark:hover:text-teal-400 lg:p-0 group text-lg`
                  }
                >
                  Nursery
                  <span className="absolute bottom-[-5px] left-0 w-full h-0.5 bg-teal-800 dark:bg-teal-400 scale-x-0 transition-transform duration-300 ease-in-out origin-center group-hover:scale-x-100"></span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `relative block py-2 pr-4 pl-3 duration-200 ${
                      isActive
                        ? "text-teal-900 dark:text-teal-400"
                        : "text-gray-800 dark:text-gray-200"
                    } border-b border-gray-100 dark:border-gray-700 lg:hover:bg-transparent lg:border-0 hover:text-teal-900 dark:hover:text-teal-400 lg:p-0 group text-lg`
                  }
                >
                  About Us
                  <span className="absolute bottom-[-5px] left-0 w-full h-0.5 bg-teal-800 dark:bg-teal-400 scale-x-0 transition-transform duration-300 ease-in-out origin-center group-hover:scale-x-100"></span>
                </NavLink>
              </li>
              
              {/* Add Theme Toggle in mobile menu */}
              <li className="lg:hidden py-2 pr-4 pl-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center">
                  <span className="text-gray-800 dark:text-gray-200 text-lg mr-3">Theme</span>
                  <ThemeToggle />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {showSearch && <Search onClose={handleSearchClose} />}
    </header>
  );
}
