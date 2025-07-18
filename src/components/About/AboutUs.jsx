import { GiPlantRoots } from "react-icons/gi";
import {
  FaLeaf,
  FaQuoteLeft,
  FaHandHoldingHeart,
  FaAward,
} from "react-icons/fa";
import { MdOutlineHealthAndSafety, MdNaturePeople } from "react-icons/md";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function AboutUs() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const scrollToFooter = () => {
    const footer = document.querySelector("footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Array of team members
  const teamMembers = [
    {
      name: "Ananya Sharma",
      role: " Ayurvedic Expert",
      image:
        "https://media.istockphoto.com/id/1483473258/photo/smiling-young-woman-professional-in-formal-wear-with-arms-crossed-and-looking-at-camera.jpg?s=612x612&w=0&k=20&c=GONEgP4Dcxbj66r3KcA6LpoZGWcOEaiUGEcXjOuBybE=",
      bio: "With over 15 years of experience in Ayurveda, Ananya brings her passion for traditional healing to Vedic Flora.",
    },
    {
      name: "Dr. Rajesh Patel",
      role: "Plant Scientist",
      image:
        "https://media.istockphoto.com/id/1369199360/photo/portrait-of-a-handsome-young-businessman-working-in-office.jpg?s=612x612&w=0&k=20&c=ujyGdu8jKI2UB5515XZA33Tt4DBhDU19dKSTUTMZvrg=",
      bio: "A doctorate in Botany with specialization in medicinal plants, Dr. Patel ensures our plants meet the highest quality standards.",
    },
    {
      name: "Priya Verma",
      role: "Sustainability Director",
      image:
        "https://images.unsplash.com/photo-1720874129553-1d2e66076b16?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJpeWElMjBwcm9mZXNzaW9uYWx8ZW58MHx8MHx8fDA%3D",
      bio: "Leading our eco-friendly initiatives, Priya ensures Vedic Flora maintains its commitment to environmental responsibility.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Parallax Effect */}
      <motion.section
        className="relative min-h-[80vh] overflow-hidden flex items-center"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1658695122383-4717e439e01b?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.4)",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              style={{ fontFamily: "Lobster, serif" }}
            >
              Our Journey in Ayurvedic Wellness
            </h1>
            <div className="h-1 w-32 bg-teal-500 mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto" style={{ fontFamily: "cambria, serif" }}>
              Discover the ancient wisdom of Ayurveda through our carefully
              curated collection of plants. We&#39;re dedicated to bringing
              natural healing to your doorstep.
            </p>
            <Link to="/plants">
              <motion.button
                className="mt-8 bg-teal-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-teal-700 transition-all duration-300 transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ fontFamily: "cambria, serif" }}   >
                Explore Our Plants
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Story Section with Image */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2
                className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6"
                style={{ fontFamily: "Lobster, serif" }}
              >
                Our Story
              </h2>
              <div className="h-1 w-20 bg-teal-500 mb-8"></div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg"style={{ fontFamily: "cambria, serif" }}>
                Vedic Flora began with a simple vision: to connect people with
                the healing power of Ayurvedic plants. Founded in 2025, we
                started as a small nursery in Ahmedabad with just 15 plant
                varieties.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg"style={{ fontFamily: "cambria, serif" }}>
                Today, we&#39;ve grown to offer over 100 meticulously cultivated
                Ayurvedic plant species, all grown using traditional methods
                that honor their medicinal properties.
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-lg"style={{ fontFamily: "cambria, serif" }}>
                Our team of Ayurvedic experts, botanists, and sustainable
                farming specialists work together to ensure that each plant that
                reaches your home carries the full healing potential of this
                5000-year-old science.
              </p>
            </motion.div>
            <motion.div
              className="rounded-xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="https://images.unsplash.com/photo-1592150621744-aca64f48394a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1491&q=80"
                alt="Ayurvedic garden"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Quote Section */}
      <motion.section
        className="py-20 bg-teal-600 text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 opacity-10">
          <svg
            className="h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 L100,0 L100,100 L0,100 Z"
              fill="url(#leaf-pattern)"
            ></path>
            <defs>
              <pattern
                id="leaf-pattern"
                patternUnits="userSpaceOnUse"
                width="10"
                height="10"
              >
                <path
                  d="M0,5 Q2.5,0 5,5 T10,5"
                  stroke="white"
                  strokeWidth="1"
                  fill="none"
                />
              </pattern>
            </defs>
          </svg>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10" style={{ fontFamily: "cambria, serif" }}>
          <FaQuoteLeft className="text-4xl md:text-6xl mx-auto mb-6 opacity-50" />
          <p className="text-2xl md:text-3xl font-light italic mb-8">
            &#34;Ayurveda is not just a system of medicine but a way of life, an
            ancient science that teaches us to live in harmony with nature.&#34;
          </p>
          <div className="h-1 w-20 bg-white opacity-50 mx-auto mb-4"></div>
          <p className="text-xl font-medium">Aaryan Raval</p>
          <p className="text-lg opacity-75">Founder, Vedic Flora</p>
        </div>
      </motion.section>

      {/* Mission & Vision Section with Icons */}
      <motion.section
        className="py-20 bg-gray-50 dark:bg-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              className="text-center md:text-left bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block p-4 bg-teal-100 dark:bg-teal-800 rounded-full mb-6">
                <FaHandHoldingHeart className="text-4xl text-teal-600 dark:text-teal-400" />
              </div>
              <h2
                className="text-3xl font-bold text-gray-800 dark:text-white mb-6"
                style={{ fontFamily: "Lobster, serif" }}
              >
                Our Mission
              </h2>
              <div className="h-1 w-20 bg-teal-500 mb-6 md:mx-0 mx-auto"></div>
              <p
                className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed"
                style={{ fontFamily: "cambria, serif" }}
              >
                To make authentic Ayurvedic plants accessible to everyone while
                promoting sustainable farming practices and supporting local
                communities. We aim to preserve and share the wisdom of Ayurveda
                for generations to come.
              </p>
            </motion.div>

            <motion.div
              className="text-center md:text-left bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-block p-4 bg-teal-100 dark:bg-teal-800 rounded-full mb-6">
                <MdOutlineHealthAndSafety className="text-4xl text-teal-600 dark:text-teal-400" />
              </div>
              <h2
                className="text-3xl font-bold text-gray-800 dark:text-white mb-6"
                style={{ fontFamily: "Lobster, serif" }}
              >
                Our Vision
              </h2>
              <div className="h-1 w-20 bg-teal-500 mb-6 md:mx-0 mx-auto"></div>
              <p
                className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed"
                style={{ fontFamily: "cambria, serif" }}
              >
                To become the most trusted source of Ayurvedic plants and
                knowledge, helping people embrace natural healing and wellness
                in their daily lives. We envision a world where ancient wisdom
                meets modern living for holistic well-being.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Values Section with Enhanced Cards */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold text-gray-800 dark:text-white mb-4"
              style={{ fontFamily: "Lobster, serif" }}
            >
              Our Core Values
            </h2>
            <div className="h-1 w-24 bg-teal-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              These principles guide everything we do at Vedic Flora
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: <FaLeaf />,
                title: "Authenticity",
                description:
                  "We ensure all our products are genuine and sourced directly from trusted Ayurvedic nurseries, preserving their medicinal properties.",
              },
              {
                icon: <MdNaturePeople />,
                title: "Sustainability",
                description:
                  "We promote eco-friendly planting practices and packaging to protect our environment for future generations.",
              },
              {
                icon: <FaAward />,
                title: "Quality",
                description:
                  "Every plant undergoes strict quality checks before reaching you, guaranteeing the highest standards of purity and potency.",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-teal-500"
                variants={itemVariants}
              >
                <div className="inline-block p-4 bg-teal-50 dark:bg-teal-900/30 rounded-full mb-6">
                  <span className="text-3xl text-teal-600 dark:text-teal-400">
                    {value.icon}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {value.title}
                </h3>
                <p
                  className="text-gray-600 dark:text-gray-300 text-lg"
                  style={{ fontFamily: "cambria, serif" }}
                >
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        className="py-20 bg-gray-50 dark:bg-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold text-gray-800 dark:text-white mb-4"
              style={{ fontFamily: "Lobster, serif" }}
            >
              Meet Our Team
            </h2>
            <div className="h-1 w-24 bg-teal-500 mx-auto mb-6"></div>
            <p
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              style={{ fontFamily: "cambria, serif" }}
            >
              The passionate experts behind our botanical treasures
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-3 gap-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden"
                variants={itemVariants}
              >
                <div className="h-80 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-teal-600 dark:text-teal-400 mb-4">
                    {member.role}
                  </p>
                  <p
                    className="text-gray-600 dark:text-gray-300"
                    style={{ fontFamily: "cambria, serif" }}
                  >
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Gallery */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold text-gray-800 dark:text-white mb-4"
              style={{ fontFamily: "Lobster, serif" }}
            >
              Our Nursery
            </h2>
            <div className="h-1 w-24 bg-teal-500 mx-auto mb-6"></div>
            <p
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              style={{ fontFamily: "cambria, serif" }}
            >
              Where we nurture nature&#39;s healing treasures
            </p>
          </div>

          <Link to="/nursery">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "https://images.unsplash.com/photo-1555955208-94f6fafea771",
                "https://plus.unsplash.com/premium_photo-1679765933646-80796b81c20d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bnVyc2VyeSUyMHBsYW50c3xlbnwwfHwwfHx8MA%3D%3D",
                "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5",
                "https://images.unsplash.com/photo-1668962225017-12ef9d7981c2?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bnVyc2VyeSUyMHBsYW50c3xlbnwwfHwwfHx8MA%3D%3D",
                "https://images.unsplash.com/photo-1599334064100-4d3a0cc7332c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bnVyc2VyeSUyMHBsYW50c3xlbnwwfHwwfHx8MA%3D%3D",
                "https://fra.cloud.appwrite.io/v1/storage/buckets/67c18af2003a4c58909d/files/67dd2d78002a6c3a3686/view?project=67c18ab4001f33e542b6&mode=admin",
                "https://images.unsplash.com/photo-1729606097727-4bca75bc1565?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fG51cnNlcnklMjBwbGFudHN8ZW58MHx8MHx8fDA%3D",
                "https://plus.unsplash.com/premium_photo-1679765929074-a05be727f0fb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fG51cnNlcnklMjBwbGFudHN8ZW58MHx8MHx8fDA%3D",
                // "https://plus.unsplash.com/premium_photo-1679428401799-56bac671abd9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTN8fG51cnNlcnklMjBwbGFudHN8ZW58MHx8MHx8fDA%3D",
              ].map((image, index) => (
                <motion.div
                  key={index}
                  className={`rounded-lg overflow-hidden shadow-lg ${
                    index === 8 ? "col-span-2 row-span-2" : ""
                  }`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <img
                    src={`${image}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80`}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </motion.div>
              ))}
            </div>
          </Link>
        </div>
      </motion.section>

      {/* Contact Section with Enhanced Design */}
      <motion.section
        className="py-20 bg-teal-700 text-white relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1520302518132-d3efb04246d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1474&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <motion.div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GiPlantRoots className="text-6xl mx-auto mb-6" />
          <h2
            className="text-4xl font-bold mb-6"
            style={{ fontFamily: "Lobster, serif" }}
          >
            Join Our Ayurvedic Journey
          </h2>
          <div className="h-1 w-24 bg-white mx-auto mb-6"></div>
          <p
            className="text-xl mb-8 max-w-2xl mx-auto"
            style={{ fontFamily: "cambria, serif" }}
          >
            Have questions about our plants or want to learn more about
            incorporating Ayurveda in your life? Our team of experts is here to
            help!
          </p>
          <motion.button
            onClick={scrollToFooter}
            className="bg-white text-teal-700 px-10 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us
          </motion.button>
        </motion.div>
      </motion.section>
    </div>
  );
}

export default AboutUs;
