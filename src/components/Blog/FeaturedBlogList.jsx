import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { motion } from "framer-motion";

function BlogList() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const blogList = await response.json();
        setBlogs(blogList);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const filteredData = blogs.filter((item) => item.featuredProduct);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
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
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className=" mx-auto p-4 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-6"
      >
        <h1
          className="text-3xl font-semibold text-gray-900 dark:text-white"
          style={{ fontFamily: "Times, serif" }}
        >
          Recent Blog
        </h1>
        <Link
          className="text-gray-800 dark:text-gray-200 hover:text-gray-950 dark:hover:text-gray-400"
          to="/blog"
        >
          View All Posts
        </Link>
      </motion.div>
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredData.map((blog) => (
          <motion.div
            key={blog.id}
            variants={itemVariants}
            className=" bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm"
          >
            <Link to={`/blog/${blog.slug}`}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <motion.img
                  alt={blog.altText}
                  className="w-full h-52 object-cover group-hover:opacity-75"
                  src={blog.image1}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2
                    className="text-xl font-semibold mb-2 text-gray-800 dark:text-white tracking-wide "
                    style={{ fontFamily: "Times, serif" }}
                  >
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    by
                    <span className="text-gray-800 dark:text-gray-100 font-normal ml-1 font-sans">
                      Vedic Flora Team
                    </span>
                  </p>
                </motion.div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
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
