import BackgroundImage from "../components/BackgroundImage/BackgroundImage";
import Products from "../components/Product/Products";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Product() {
  const [isBackgroundImageLoaded, setIsBackgroundImageLoaded] = useState(false);
  const navigate = useNavigate();

  const handleBackgroundImageLoad = () => {
    setIsBackgroundImageLoaded(true);
  };

  const handleReviewClick = () => {
    navigate("/review");
  };

  return (
    <>
      <BackgroundImage title="Plants" size={5} lineWidth={6} image="/plants-5.png" onLoad={handleBackgroundImageLoad} />
      <div className="flex justify-center my-4">
        <button onClick={handleReviewClick} className="bg-teal-700 hover:bg-teal-800 text-white font-bold py-2 px-6 rounded-lg">
          See Customer Reviews
        </button>
      </div>
      {isBackgroundImageLoaded && <Products />}
    </>
  );
}

export default Product;