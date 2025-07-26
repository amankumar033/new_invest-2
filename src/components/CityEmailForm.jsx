import React, { useState } from 'react';
import FinalThankYouScreen from './FinalThankYouScreen';
import axios from 'axios';
import { toast } from 'react-toastify'; // 👈 Add this at the top of your file

const CityEmailForm = ({ userName, phone, onComplete }) => {
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState(''); // Start blank
  const [phoneInput, setPhoneInput] = useState(''); // Start blank
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Indian phone number validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!name.trim() || !phoneInput.trim()) {
      toast.error("Please enter your name and phone number.");
      return;
    }
    if (!phoneRegex.test(phoneInput)) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    if (!city.trim() && !email.trim() && !name.trim()) {
      setSubmitted(true);
      onComplete(); // Inform parent
      return;
    }
  
    setLoading(true);
  
    try {
      const session_uuid = phone; // session id from prop
      const response = await axios.post('https://backend.myinvestoryy.com/api/update-city-email', {
        phone: phoneInput, // user entered phone number
        name,
        city,
        email,
        session_uuid,
      });
  

  
      if (response.data?.message === "Phone number not found") {
        toast.error("Phone number not found. Please check and try again.");
        console.warn('Phone number not found');
      } else if (response.data?.message === "City and Email updated successfully") {
        toast.success("City and Email updated successfully!");

      }
  
      setSubmitted(true);
      onComplete({ name }); // Inform parent with user-filled name
    } catch (err) {
      console.error('API call failed:', err);
      toast.error("Something went wrong. Please try again later.");
      // Do not setSubmitted or call onComplete on error
    } finally {
      setLoading(false);
    }
  };
  

  const handleSkip = () => {
    setSubmitted(true);
    onComplete(); // Tell parent we are done
  };



  if (submitted) {
    return <div>Loading...</div>; // Temporary loader, because parent will replace the screen
  }

  return (
    <div className="flex flex-col items-center text-center space-y-4 px-4 mt-10 mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-4">
        One Last Step!
      </h2>
      <p className="text-white text-lg mb-6">
        Share your name, city and email to personalize your experience even more.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 items-center w-80 max-w-sm">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="py-2 px-4 rounded-full bg-white text-black placeholder-gray-500 text-lg outline-none w-full"
        />
        <input
          type="text"
          placeholder="Phone"
          value={phoneInput}
          onChange={(e) => setPhoneInput(e.target.value)}
          required
          className="py-2 px-4 rounded-full bg-white text-black placeholder-gray-500 text-lg outline-none w-full"
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="py-2 px-4 rounded-full bg-white text-black placeholder-gray-500 text-lg outline-none w-full"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="py-2 px-4 rounded-full bg-white text-black placeholder-gray-500 text-lg outline-none w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-gradient-to-r from-[#529F77] to-[#3C8576] text-white text-xl px-8 py-2 rounded-xl shadow-md flex items-center border-b-[4px] border-r-[4px] border-white justify-center w-50"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>

        {/* <button
          type="button"
          onClick={handleSkip}
          disabled={loading}
          className="mt-2 text-gray-300 underline text-sm"
        >
          Skip for now
        </button> */}
      </form>
    </div>
  );
};

export default CityEmailForm;
