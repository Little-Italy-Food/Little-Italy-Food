import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ParallaxProvider, Parallax } from "react-scroll-parallax";

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ParallaxProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden">
        {/* Hero Section */}
        <Parallax translateY={[-20, 20]}>
          <div className="relative h-screen flex items-center justify-center">
            <img
              src="https://primehg.com/wp-content/uploads/2023/12/home-hero.webp"
              alt="Hero"
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
            <div className="z-10 text-center">
              <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                className="text-5xl md:text-7xl font-bold mb-4"
              >
                Little Italy
              </motion.h1>
              <motion.p
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-xl md:text-2xl"
              >
                Bringing flavors to life
              </motion.p>
            </div>
          </div>
        </Parallax>

        {/* About Us Section */}
        <section className="py-20 px-4 md:px-0">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 1 }}
              className="text-4xl md:text-5xl font-bold mb-8"
            >
              About Us
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-lg md:text-xl leading-relaxed mb-8"
            >
              Welcome to our culinary universe! We are a passionate collective
              of food enthusiasts, united by our unwavering belief in the
              transformative power of exceptional cuisine. Our mission is to
              ignite the spark of culinary creativity in both seasoned chefs and
              aspiring home cooks, offering a treasure trove of meticulously
              crafted recipes that celebrate the vibrant tapestry of global
              flavors and fresh, wholesome ingredients.
            </motion.p>
          </div>
        </section>

        {/* Our Story Section */}
        <Parallax translateY={[-20, 20]}>
          <section className="py-20 px-4 md:px-0 bg-gray-800">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : {}}
                transition={{ duration: 1 }}
                className="text-4xl md:text-5xl font-bold mb-8"
              >
                Our Story
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-lg md:text-xl leading-relaxed"
              >
                Our journey began in a humble kitchen, fueled by an ambitious
                dream: to share our culinary passion with the world. As our team
                has grown, so too has our commitment to this vision. We firmly
                believe that the art of great cooking is accessible to all,
                given the right inspiration and guidance. Whether you're a
                Michelin-starred chef or taking your first steps in the kitchen,
                our carefully curated recipes are designed to elevate your
                culinary prowess and ignite your gastronomic imagination.
              </motion.p>
            </div>
          </section>
        </Parallax>

        {/* Join Us CTA */}
        <section className="py-20 px-4 md:px-0">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 1 }}
              className="text-3xl md:text-4xl font-bold mb-8"
            >
              Join Our Culinary Adventure
            </motion.h2>
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300"
            >
              Explore Recipes
            </motion.button>
          </div>
        </section>
      </div>
    </ParallaxProvider>
  );
};

export default AboutUs;
