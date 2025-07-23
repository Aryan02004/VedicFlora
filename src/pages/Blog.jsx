import { useState } from "react";
import BackgroundImage from "../components/BackgroundImage/BackgroundImage";
import BlogList from "../components/Blog/BlogList";

function Blog() {
  const [isBackgroundImageLoaded, setIsBackgroundImageLoaded] = useState(false);

  const handleBackgroundImageLoad = () => {
    setIsBackgroundImageLoaded(true);
  };

  return (
    <>
      <BackgroundImage title="Our Blogs" size={6} lineWidth={12} image="/blog.png" onLoad={handleBackgroundImageLoad} />
      {isBackgroundImageLoaded && <BlogList />}
    </>
  );
}

export default Blog;
