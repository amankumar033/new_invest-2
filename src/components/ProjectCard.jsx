import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';


const ProjectCard = ({ data }) => {
  const [isChargesModalOpen, setIsChargesModalOpen] = useState(false);
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [submittedData, setSubmittedData] = useState(null);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const chargesModalRef = useRef(null);
  const interestModalRef = useRef(null);

  useEffect(() => {
    const apiUrl = 'https://backend.myinvestoryy.com/';
    async function fetchWhatsappNumber() {
      try {
        const response = await fetch(`${apiUrl}api/homepage`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setWhatsappNumber(
          Array.isArray(data.whatsapp_icons) && data.whatsapp_icons.length > 0
            ? data.whatsapp_icons[0].number
            : ''
        );
      } catch (error) {
        setWhatsappNumber('');
      }
    }
    fetchWhatsappNumber();
  }, []);

  const handleChargesClick = (e) => {
    e.stopPropagation();
    setIsChargesModalOpen(true);
  };

  const handleInterestClick = (e) => {
    e.stopPropagation();
    setIsInterestModalOpen(true);
  };

  const closeChargesModal = () => {
    setIsChargesModalOpen(false);
  };

  const closeInterestModal = () => {
    setIsInterestModalOpen(false);
    setIsSubmitSuccess(false); // Reset success state when closing modal
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWhatsAppRedirect = () => {
    const userDetails = submittedData || formData;
    const message = encodeURIComponent(
      `Hi, I am interested in the property: ${data.name}\nName: ${userDetails.name}\nPhone: ${userDetails.phone}${userDetails.email ? '\nEmail: ' + userDetails.email : ''}`
    );
    if (whatsappNumber) {
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('WhatsApp number not available.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      email: formData.email || '',
      phone_number: formData.phone,
      property_name: data.name,
      project_id: data.id
    };

    try {
      const response = await fetch('https://backend.myinvestoryy.com/api/real-estate-queries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Store the form data before resetting
        setSubmittedData({
          name: formData.name,
          phone: formData.phone,
          email: formData.email
        });
        toast.success("🎉 Got it! We'll be in touch soon");
        setIsSubmitSuccess(true);
        setFormData({ name: '', email: '', phone: '' });
      } else {
        toast.error('Submission failed: ' + (responseData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting interest:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  // Close on outside click for charges modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chargesModalRef.current && !chargesModalRef.current.contains(event.target)) {
        closeChargesModal();
      }
    };

    if (isChargesModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isChargesModalOpen]);

  // Close on outside click for interest modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (interestModalRef.current && !interestModalRef.current.contains(event.target)) {
        closeInterestModal();
      }
    };

    if (isInterestModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isInterestModalOpen]);

  // Disable page scroll when any modal is open
  useEffect(() => {
    document.body.style.overflow = (isChargesModalOpen || isInterestModalOpen) ? 'hidden' : '';
  }, [isChargesModalOpen, isInterestModalOpen]);

  return (
    <div className="w-full max-w-[340px] mx-auto bg-white text-black rounded-[5px] overflow-hidden shadow-md border border-gray-300 font-[system-ui] px-3 py-2 my-4 relative">
      {/* Image/Preview Area */}
      <div
        className="bg-black h-[180px] sm:h-[200px] relative flex justify-end items-end p-2 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://backend.myinvestoryy.com/backend/storage/app/public/${data.image})`
        }}
      >
       {data.images.length > 1 && (
  <span className="absolute bottom-2 right-2 bg-white text-[10px] sm:text-xs px-2 py-0.5 rounded text-black font-semibold">
    +{data.images.length - 1}
  </span>
)}

      </div>



      {/* Content Area */}
      <div className="py-2 border-t border-gray-300 space-y-1 text-sm sm:text-[15px]">
        <h2 className="text-xl sm:text-2xl font-bold jaini-regular">{data.name}</h2>
        <hr className="border-black border-t-2 my-1" />

        <div className="flex justify-between text-xs sm:text-sm">
          <span className="underline">{data.type}</span>
          <span className="text-blue-800">{data.launchType}</span>
        </div>

        <div className="flex justify-between text-xs sm:text-sm">
          <span className="font-bold">{data.location}</span>
          <span className="text-[#7c7c7c]">Possession in {data.possession}</span>
        </div>

        <div className="flex justify-between text-xs sm:text-sm">
          <span>{data.bhk}</span>
          <span>{data.area}</span>
        </div>

        <div className="text-xs sm:text-sm text-[#1d1d1f] py-1">
          {data.price}{' '}
          <button
            onClick={handleChargesClick}
            className="text-blue-800 focus:outline-none"
          >
            + Charges
          </button>
        </div>

        <hr className="border-black border-t-2 my-1" />
        <div className="flex flex-row justify-between pt-2">
          <button
            onClick={handleInterestClick}
            className="bg-gradient-to-r from-[#529F77] to-[#3C8576] text-white text-[13px] sm:text-[15px] font-medium tracking-wide py-2 px-4 rounded-xl shadow border-b-2 border-r-2 border-black min-w-max hover:scale-[1.03] transition-transform duration-200 active:scale-95">
            Send Interest
          </button>

          <Link 
            to={`/property/${data.slug}`} 
            className="bg-[#AC1C30] text-white text-[13px] sm:text-[15px] font-medium tracking-wide py-2 px-4 rounded-xl shadow border-b-2 border-r-2 border-black min-w-max hover:scale-[1.03] transition-transform duration-200 active:scale-95 flex items-center justify-center">
            View Details
          </Link>
        </div>
      </div>

      {/* Charges Modal */}
      {isChargesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-[#0f1e17] text-white rounded-xl p-6 max-w-md w-full relative shadow-xl border border-green-700 animate-slideUp"
            ref={chargesModalRef}
          >
            <button
              className="absolute top-2 right-2 text-white hover:text-green-600 text-xl font-bold hover:rotate-90 transition-transform duration-200"
              onClick={closeChargesModal}
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-4 text-white">Additional Charges</h3>
            <div
              className="text-sm space-y-2"
              dangerouslySetInnerHTML={{ __html: data.extraCharges || "<p>No additional charges listed.</p>" }}
            />

            <button
              onClick={closeChargesModal}
              className="mt-6 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded shadow"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Interest Form Modal */}
      {isInterestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div
            ref={interestModalRef}
            className="bg-gradient-to-br from-[#1a2e24] to-[#111827] text-white rounded-xl p-6 w-full max-w-md relative shadow-2xl border border-green-600 transform transition-all"
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white rounded-full h-8 w-8 flex items-center justify-center bg-gray-800/50 hover:bg-gray-700 transition-colors"
              onClick={closeInterestModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {isSubmitSuccess ? (
              <div className="text-center py-6">
                <div className="animate-fade-in">
                  <svg className="mx-auto h-16 w-16 text-green-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="text-xl font-bold text-white mb-2">Details Submitted Successfully!</h4>
                  <p className="text-gray-300 mb-6">Click below to continue the conversation on WhatsApp</p>
                  <button
                    onClick={handleWhatsAppRedirect}
                    className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
                    </svg>
                    Continue to WhatsApp
                  </button>
                  <button
                    onClick={closeInterestModal}
                    className="w-full mt-3 bg-transparent border border-gray-600 text-gray-300 font-medium py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-1 text-white flex items-center">
                  <span className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                      <path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9" />
                      <path d="M9 22V12h6v10" />
                      <path d="M2 10.6L12 2l10 8.6" />
                    </svg>
                  </span>
                  Express Interest
                </h3>

                <p className="text-green-400 font-medium mb-2">{data.name}</p>
                <p className="text-gray-300 text-sm mb-6">Please fill in your details to express interest in this property. Our team will contact you soon.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 focus:border-green-500 focus:ring focus:ring-green-500/30 focus:outline-none text-white placeholder-gray-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 focus:border-green-500 focus:ring focus:ring-green-500/30 focus:outline-none text-white placeholder-gray-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 focus:border-green-500 focus:ring focus:ring-green-500/30 focus:outline-none text-white placeholder-gray-500 transition-colors"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Submit Interest
                    </button>
                  </div>
                </form>
              </>
            )}

            <p className="text-gray-400 text-xs mt-4 text-center">
              By submitting this form, you agree to our privacy policy and terms of service.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
