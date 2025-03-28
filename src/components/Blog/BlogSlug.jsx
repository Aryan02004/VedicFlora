import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../../firebase.js"; // Import Firebase config
import { collection, getDocs } from "firebase/firestore";
import { Loader } from "lucide-react";
import {  PiPottedPlantBold } from "react-icons/pi";

function BlogSlug() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate(); // Use the useNavigate hook

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "blogData"));
        const blogList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const foundBlog = blogList.find((b) => b.slug === slug);
        if (foundBlog) {
          setBlog(foundBlog);
        } else {
          console.error("No blog found with the given slug");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    fetchBlog();
  }, [slug]);

  const handlePlantNavigation = () => {
    if (blog.plantSlug) {
      navigate(`/plant/${blog.plantSlug}`); // Use navigate instead of Navigate
    } else {
      console.error("No related blog post found for this product");
    }
  };

  if (!blog) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
        Please Wait...
        <Loader className="animate-spin w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900" style={{ fontFamily: "cambria, serif" }}>
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-teal-700 dark:text-teal-400 mb-4">
          {blog.title}
        </h1>
        <button
          className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2 italic tracking-wide"
          onClick={handlePlantNavigation}
        >
          {blog.Sname}
        </button>
        <div className=" flex justify-center mb-6" >
          <img
            src={blog.image1}
            alt={blog.title}
            className="w-1/2 h-auto rounded-lg shadow-md hover:opacity-90 hover:scale-105 transition-all duration-300"
            onClick={handlePlantNavigation}
            
          />
        </div>
        <div className="mb-6">
          <h3
            className="text-xl font-semibold text-sky-700 dark:text-sky-300 mb-2 tracking-wide"
            style={{ fontFamily: "Times, serif" }}
          >
            Historical Use
          </h3>
          <p className="text-gray-700 dark:text-gray-300 font-sans text-lg">{blog.Huse}</p>
        </div>
        <div className="mb-6">
          <h3
            className="text-xl font-semibold text-sky-700 dark:text-sky-300 mb-2"
            style={{ fontFamily: "Times, serif" }}
          >
            Physical Health Benefits
          </h3>
          <p className="text-gray-700 dark:text-gray-300 font-sans text-lg">{blog.Ph}</p>
        </div>
        <div className="mb-6">
          <h3
            className="text-xl font-semibold text-sky-700 dark:text-sky-300 mb-2"
            style={{ fontFamily: "Times, serif" }}
          >
            Mental Health Benefits
          </h3>
          <p className="text-gray-700 dark:text-gray-300 font-sans text-lg">{blog.Mh}</p>
        </div>
        <div className="mb-6">
          <h3
            className="text-xl font-semibold text-sky-700 dark:text-sky-300 mb-2"
            style={{ fontFamily: "Times, serif" }}
          >
            Traditional and Modern Uses
          </h3>
          <p className="text-gray-700 dark:text-gray-300 font-sans text-lg">{blog.TMuse}</p>
        </div>
        <div className="mb-6">
          <h3
            className="text-xl font-semibold text-sky-700 dark:text-sky-300 mb-2"
            style={{ fontFamily: "Times, serif" }}
          >
            Care Instructions
          </h3>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 font-sans text-lg">
            <li>
              <strong>Soil:</strong> {blog.soil}
            </li>
            <li>
              <strong>Sunlight:</strong> {blog.sunlight}
            </li>
            <li>
              <strong>Water:</strong> {blog.water}
            </li>
            <li>
              <strong>Care:</strong> {blog.care}
            </li>
          </ul>
        </div>
        <div className="flex flex-col items-center justify-center mb-6 gap-4" >
          <img
            src={blog.image2}
            alt={blog.title}
            className="w-1/2 h-auto rounded-lg shadow-md hover:opacity-90 hover:scale-105 transition-all duration-300"
            onClick={handlePlantNavigation}
          />
        <button className=" max-w-md w-full bg-teal-700 text-white py-2 gap-3 rounded-lg hover:bg-teal-900 font-semibold text-lg flex items-center justify-center" onClick={handlePlantNavigation}>
        <PiPottedPlantBold  size={25} />Buy Now 
        </button>
        </div>
      </div>
    </div>
  );
}

export default BlogSlug;
