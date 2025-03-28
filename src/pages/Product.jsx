import BackgroundImage from "../components/BackgroundImage/BackgroundImage";
import Products from "../components/Carousel/Products";
import { useState } from "react";


function Product() {
    const [isBackgroundImageLoaded, setIsBackgroundImageLoaded] = useState(false);
  
    const handleBackgroundImageLoad = () => {
      setIsBackgroundImageLoaded(true);
    };

  return (
    
<>
      <BackgroundImage title="Plants" size={5} lineWidth={6} image="/plants-5.png" onLoad={handleBackgroundImageLoad} />
      {isBackgroundImageLoaded && <Products />}
    </>  );
}

export default Product;