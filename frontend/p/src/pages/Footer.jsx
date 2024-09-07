import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { FaFacebookF, FaGoogle, FaTwitter, FaInstagram } from 'react-icons/fa';
import logo from '../assets/Logo.png';

const Footer = () => {
  return (
    <footer
      className="text-white py-8 mt-8"
      style={{
        backgroundImage: "url('https://ryecountrystore.com/custom/modules/home_treatments/images/bg.jpg')", // Replace with your image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About Us */}
          <div>
            <img src={logo} alt="logo" className="w-28 h-15" />
            {/* <h2 className="text-xl font-bold mb-2">Your Logo</h2> */}
            {/* <p className="text-sm text-gray-400">Your Tagline here</p> */}
            <h3 className="text-orange-500 font-semibold mt-4 mb-2">About Us</h3>
            <p className="text-sm">We bring the authentic taste of Italy to your table with quality ingredients and traditional recipes..</p>
            <h3 className="text-orange-500 font-semibold mt-4 mb-2">Contact Us</h3>
            <div className="flex items-center space-x-2 text-sm">
              <Phone size={16} />
              <span>+91 9999 999 999</span>
            </div>
            <div className="flex items-center space-x-2 text-sm mt-1">
              <Mail size={16} />
              <span>youremail@id.com</span>
            </div>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-orange-500 font-semibold mb-4">Information</h3>
            <ul className="space-y-2">
              {['About Us', 'More Search', 'Blog', 'Testimonials', 'Events'].map((item, index) => (
                <li key={index}><a href="#" className="text-sm hover:text-orange-500 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Helpful Links */}
          <div>
            <h3 className="text-orange-500 font-semibold mb-4">Helpful Links</h3>
            <ul className="space-y-2">
              {['Services', 'Supports', 'Terms & Condition', 'Privacy Policy'].map((item, index) => (
                <li key={index}><a href="#" className="text-sm hover:text-orange-500 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Subscribe */}
          <div>
            <h3 className="text-white font-semibold mb-4">Subscribe More Info</h3>
            <form className="space-y-2">
              <div className="flex items-center bg-white rounded-md">
                <Mail className="text-gray-400 ml-2" size={20} />
                <input
                  type="email"
                  placeholder="Enter your Email"
                  className="w-full py-2 px-3 text-black text-sm rounded-md focus:outline-none"
                />
              </div>
              <button type="submit" className="bg-orange-500 text-white py-2 px-4 rounded-md text-sm hover:bg-orange-600 transition-colors w-full">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Social Media and Copyright */}
        <div className="mt-8 flex flex-wrap justify-between items-center border-t border-gray-700 pt-4">
          <div className="flex space-x-4">
            <a href="#" className="bg-orange-500 p-2 rounded-full hover:bg-orange-600 transition-colors">
              <FaFacebookF className="text-white" />
            </a>
            <a href="#" className="bg-orange-500 p-2 rounded-full hover:bg-orange-600 transition-colors">
              <FaGoogle className="text-white" />
            </a>
            <a href="#" className="bg-orange-500 p-2 rounded-full hover:bg-orange-600 transition-colors">
              <FaTwitter className="text-white" />
            </a>
            <a href="#" className="bg-orange-500 p-2 rounded-full hover:bg-orange-600 transition-colors">
              <FaInstagram className="text-white" />
            </a>
          </div>
          <p className="text-sm text-gray-400 mt-4 md:mt-0">
            2024 Â© company.Ltd. All Right reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;