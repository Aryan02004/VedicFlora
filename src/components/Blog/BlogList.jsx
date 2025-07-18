import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/blogs");
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const blogList = await response.json();
        setBlogs(blogList);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);


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

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="mx-auto p-4 dark:bg-gray-900">
      {loading ? (
        <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200 text-xl" style={{ fontFamily: "cambria, serif" }}>
          Please wait, loading Blogs..
          <Loader className="animate-spin w-12 h-12 " />
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {blogs.map((blog) => (
            <motion.div
              key={blog.id}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to={`/blog/${blog.slug}`}
                  className="group block bg-white dark:bg-gray-800 rounded-lg overflow-hidden 
                    transform transition-all duration-300 
                    border-4 border-gray-950 dark:border-gray-200
                    hover:border-gray-300 dark:hover:border-gray-600
                    shadow-sm hover:shadow-md"
                >
                  <div className="relative overflow-hidden">
                    <motion.img
                      alt={blog.altText}
                      className="w-full h-52 object-cover"
                      src={blog.image1}
                      whileHover={{ scale: 1.05, opacity: 0.9 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="p-6">
                    <motion.h2
                      className="text-xl font-semibold mb-3 text-gray-800 dark:text-white 
                        tracking-wide line-clamp-2 group-hover:text-teal-600 
                        dark:group-hover:text-teal-400 transition-colors duration-300"
                      style={{ fontFamily: "Times, serif" }}
                      initial={{ y: 3, opacity: 0.8 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    >
                      {blog.title}
                    </motion.h2>
                    <motion.p 
                      className="text-gray-600 dark:text-gray-300 flex items-center"
                    >
                      by
                      <span className="text-gray-800 dark:text-gray-100 font-normal ml-1 font-sans">
                        Vedic Flora Team
                      </span>
                    </motion.p>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

BlogList.propTypes = {
  image: PropTypes.string.isRequired,
  altText: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

export default BlogList;
