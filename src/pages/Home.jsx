import BenifitBlock from "../components/Carousel/BenifitBlock";
import ImageCarousel from "../components/Carousel/ImageCarousel";
import FeaturedProducts from "../components/Carousel/FeaturedProducts";
import FeaturedBlog from "../components/Blog/FeaturedBlogList";

function Home() {
  return (
    <div className="dark:bg-gray-900">
      <ImageCarousel />
      <FeaturedProducts />

    
      <BenifitBlock />
      <FeaturedBlog />
    </div>
  );
}

export default Home;