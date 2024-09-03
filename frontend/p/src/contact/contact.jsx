import React, { useState } from "react";
import "./Contact.css";
import axios from 'axios';

const ContactUs = () => {
    const [Values, setValues] = useState({
        name: "",
        email: "",
        message: ""
    });

    const change = (e) => {
        const { name, value } = e.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault(); 
      console.log("Form submitted with values: ", Values);
  
      try {
          const response = await axios.post('http://localhost:5001/api/contact', Values);
          console.log(response.data);
          // Optionally, clear the form after successful submission
          setValues({
              name: "",
              email: "",
              message: ""
          });
          alert("Message sent successfully!");
      } catch (error) {
          console.error("There was an error sending the data:", error);
          alert("Failed to send message, please try again later.");
      }
  };
  

    return (
      <div className="contact-form-container">
        <div className="contact-form-wrapper">
          <div className="contact-form-header">
            <h1>Contact us</h1>
            <p>Leave us a message and we will get back to you as soon as possible</p>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Name" 
              name="name"
              className="contact-form-input"
              aria-label="Name"
              value={Values.name}
              onChange={change}
            />
            <input
              type="email"
              placeholder="Email address"
              name="email"
              className="contact-form-input"
              aria-label="Email address"
              value={Values.email}
              onChange={change}
            />
            <textarea
              placeholder="Message"
              name="message"
              className="contact-form-textarea"
              aria-label="Message"
              value={Values.message}
              onChange={change}
            ></textarea>
            <button type="submit" className="contact-form-button">
              Send
            </button>
          </form>
        </div>
      </div>
    );
};

export default ContactUs;
