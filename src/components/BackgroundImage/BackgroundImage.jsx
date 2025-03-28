import { motion } from "framer-motion";
import PropTypes from 'prop-types';

function BackgroundImage({ title, image, onLoad,size, lineWidth, }) {
  return (
    <motion.div
      className="dark:bg-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      onAnimationComplete={onLoad}
    >
      <motion.div
        className="relative flex h-96 w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background bg-cover bg-center mb-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          backgroundImage: `url(${image})`,
          fontFamily: "cambria, serif",
        }}
      >
        <motion.p
          className={`z-10 whitespace-pre-wrap text-center items-center text-${size}xl font-semibold tracking-tighter text-gray-900`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {title}
        </motion.p>

        <motion.div
          className="h-2 rounded-md bg-red-500 mt-4 shadow-md shadow-red-500/30"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: `${lineWidth}rem`, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.6,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
BackgroundImage.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onLoad: PropTypes.func.isRequired,
  size: PropTypes.number.isRequired,
  lineWidth: PropTypes.number.isRequired,
};

export default BackgroundImage;