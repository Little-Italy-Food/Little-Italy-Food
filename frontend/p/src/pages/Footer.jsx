import React from "react";
import { Mail, Phone } from "lucide-react";
import { FaFacebookF, FaGoogle, FaTwitter, FaInstagram } from "react-icons/fa";
import logo from "../assets/logo(2).png";

const Footer = () => {
  return (
    <footer
      className="text-black "
      // style={{
      //   backgroundImage:
      //     "url('https://img.freepik.com/free-photo/wooden-table-background_1258-503.jpg')", // Adjust to a relevant image
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      // }}
    >
      <div className="bg-gradient-to-t from-orange-200 via-transparent to-transparent  rounded-lg p-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About Us */}
          <div className="space-y-4">
            <img src={logo} alt="logo" className="w-28" />
            <p className="text-sm text-black">
              Bringing the authentic taste of Italy to your table with quality
              ingredients and traditional recipes.
            </p>
          </div>

          {/* Information Links */}
          <div className="space-y-4">
            <h3 className="text-orange-500 font-semibold">Information</h3>
            <ul className="space-y-2">
              {["About Us", "Blog", "Testimonials", "Events"].map(
                (item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-sm hover:text-orange-500 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Helpful Links */}
          <div className="space-y-4">
            <h3 className="text-orange-500 font-semibold">Helpful Links</h3>
            <ul className="space-y-2">
              {["Services", "Support", "Privacy Policy"].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-sm hover:text-orange-500 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Subscribe */}
          <div className="space-y-4">
            <h3 className="text-black font-semibold">Stay Updated</h3>
            <form className="space-y-2">
              <div className="flex items-center bg-white rounded-md">
                <Mail className="text-black ml-2" size={20} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full py-2 px-3 text-black text-sm rounded-md focus:outline-none placeholder-gray-500"
                  // style={{ "::placeholder": { color: "red" } }}
                />
              </div>
              <button
                type="submit"
                className="bg-orange-500 text-black py-2 px-4 rounded-md text-sm hover:bg-orange-600 transition-colors w-full"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="mt-8 flex justify-between items-center border-t border-gray-600 pt-4">
          <div className="flex space-x-4">
            {[
              { icon: <FaFacebookF />, url: "#" },
              { icon: <FaGoogle />, url: "#" },
              { icon: <FaTwitter />, url: "#" },
              { icon: <FaInstagram />, url: "#" },
            ].map((social, index) => (
              <a
                key={index}
                href={social.url}
                className="bg-orange-500 p-2 rounded-full hover:bg-orange-600 transition-colors"
              >
                {social.icon}
              </a>
            ))}
          </div>
          <p className="text-sm text-black">
            2024 © company.Ltd. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
