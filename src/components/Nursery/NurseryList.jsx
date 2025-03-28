import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../../firebase.js"; // Import Firebase config
import { collection, getDocs } from "firebase/firestore";
import { MdOutlineMailOutline, MdSearch } from "react-icons/md";
import { SlLocationPin } from "react-icons/sl";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";

function NurseryList() {
  const [nursery, setNursery] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        type: "spring",
        stiffness: 100 
      }
    }
  };

  useEffect(() => {
    const fetchnurserys = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Nursery"));
        const nurseryList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNursery(nurseryList);
      } catch (error) {
        console.error("Error fetching nurserys:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchnurserys();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleSearchVisibility = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const filteredNursery = nursery.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      className="mx-auto p-4 dark:bg-gray-900"
      // initial={{ opacity: 0 }}
      // animate={{ opacity: 1 }}
      // transition={{ duration: 0.5 }}
    >
      <motion.div 
        variants={titleVariants}
        className="text-center p-12 mb-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.h1
          variants={titleVariants}
          className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
          style={{ fontFamily: "Lobster, serif" }}
        >
          Our Partner Nurseries
        </motion.h1>
        <motion.p 
          variants={titleVariants}
          className="text-xl text-teal-600 dark:text-teal-400 italic"
          transition={{ delay: 0.2 }}
        >
          Where Ancient Wisdom Takes Root
        </motion.p>
        
        <div className="relative mt-8">
          <motion.button
            onClick={toggleSearchVisibility}
            className="absolute right-0 top-0 mt-6 mr-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MdSearch size={30} className="text-gray-900 dark:text-white" />
          </motion.button>
          {isSearchVisible && (
            <motion.input
              initial={{ opacity: 0, width: "0%" }}
              animate={{ opacity: 1, width: "100%" }}
              exit={{ opacity: 0, width: "0%" }}
              transition={{ duration: 0.3 }}
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by Nursery or City..."
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg my-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          )}
        </div>
      </motion.div>
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {loading ? (
          <motion.div 
            className="flex items-center justify-center col-span-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200 text-xl text-center" 
            style={{ fontFamily: "cambria, serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Please wait, loading Nurseries...
            <Loader className="animate-spin w-12 h-12" />
          </motion.div>
        ) : filteredNursery.length > 0 ? (
          filteredNursery.map((nursery, index) => (
            <motion.div
              key={nursery.id}
              variants={itemVariants}
              custom={index}
              initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
              <Link
                to="/plants"
                className="group block bg-white dark:bg-gray-800 rounded-lg overflow-hidden 
                  transform transition-all duration-300 
                  border-[3px] border-gray-950 dark:border-gray-200
                  hover:border-gray-300 dark:hover:border-gray-600
                  shadow-sm hover:shadow-md"
                style={{ fontFamily: "cambria, serif" }}
              >
                <div className="relative overflow-hidden">
                  <motion.img
                    alt={nursery.altText}
                    className="w-full h-52 object-cover"
                    src={nursery.image}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                </div>
                <div className="p-4">
                  <motion.h2
                    className="text-xl font-semibold mb-3 text-gray-800 dark:text-white tracking-wide line-clamp-1"
                    style={{ fontFamily: "Times, serif" }}
                    initial={{ x: -10, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    {nursery.title}
                  </motion.h2>
                  <motion.div 
                    className="flex items-center text-lg"
                    
                  >
                    <SlLocationPin size={20} className="mr-2 text-teal-600 dark:text-teal-400" />
                    <h6>{nursery.city}</h6>
                  </motion.div>
                  <motion.div 
                    className="flex items-center text-lg"
                   
                  >
                    <span className="mr-2 font-medium">Hours :</span>
                    {nursery.hours}
                  </motion.div>
                  <motion.p 
                    className="flex items-center mt-1 text-lg"
                    
                  >
                    <MdOutlineMailOutline size={20} className="mr-1 text-teal-600 dark:text-teal-400" />
                    <span className="pb-[2px]">{nursery.email}</span>
                  </motion.p>
                </div>
              </Link>
              </motion.div>
            </motion.div>
          ))
        ) : (
          <motion.div 
            className="col-span-full text-center text-lg text-gray-800 dark:text-gray-300" 
            style={{ fontFamily: "cambria, serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Searched Nursery Not Found...!
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default NurseryList;
