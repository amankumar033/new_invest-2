import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/MutualFund.css';
import FeatureHighlight from '../components/FeatureHighlight';
import FAQ from '../components/FAQ';
import ImageModal from '../components/ImageModel';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import InvestmentForm from '../components/InvestmentForm';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';
import JoinCommunity from '../components/JoinCommunity';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet';


// Demo images from the internet for section visuals
const rupeeCostAveraging = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80";
const compoundingMutualFund = "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80";

const MutualFund = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('lumpsum');
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [mutualFundData, setMutualFundData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    investmentType: '',
  });
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    fetch(`${apiUrl}api/mutual-funds-data`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        setMutualFundData(Array.isArray(data) ? data[0] : data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  // Fetch WhatsApp number
  useEffect(() => {
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
  }, [apiUrl]);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const openFormModal = () => {
    setShowFormModal(true);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
  };

  const handleInterestClick = (e) => {
    e.stopPropagation();
    setIsInterestModalOpen(true);
  };

  const closeInterestModal = () => {
    setIsInterestModalOpen(false);
    setIsSubmitSuccess(false); // Reset success state when closing modal
  };

  const handleWhatsAppRedirect = () => {
    const userDetails = submittedData || formData;
    const message = encodeURIComponent(
      `Hi, I am interested in Mutual Fund Investment\nName: ${userDetails.name}\nPhone: ${userDetails.phone}${userDetails.email ? '\nEmail: ' + userDetails.email : ''}\nInvestment Type: ${userDetails.investmentType || 'Not specified'}`
    );
    if (whatsappNumber) {
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('WhatsApp number not available.');
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Use this API endpoint for form submission
  const EXPRESS_INTEREST_API = 'https://backend.myinvestoryy.com/api/mutual-fund-queries';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(EXPRESS_INTEREST_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone_number: formData.phone,
          type: formData.investmentType, // send as 'type' parameter
        }),
      });
      const result = await response.json();
      if (response.ok && result.message === 'Query submitted successfully') {
        // Store the form data before resetting
        setSubmittedData({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          investmentType: formData.investmentType
        });
        toast.success("🎉 Got it! We'll be in touch soon");
        setIsSubmitSuccess(true);
        setFormData({ name: '', email: '', phone: '', investmentType: '' });
      } else if (result.message && result.message.includes('already')) {
        toast.error(result.message);
      } else if (result.message) {
        toast.error(result.message);
      } else {
        toast.error('Failed to submit. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };


  const navLinks = [
    { title: 'Home', href: '/' },
    { title: 'Real Estate', href: '/real-estate' },
    { title: 'Insurance', href: '/insurance' },
    { title: 'Mutual Fund', href: '/mutual-fund' },
  ];
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <Helmet>
        <title>Mutual Fund | MyInvestoryy</title>
        <meta name="description" content="Explore and compare top mutual fund schemes. Start your SIP journey with MyInvestoryy. Expert advice, performance analysis, and easy investment options." />
        <meta property="og:title" content="Mutual Fund | MyInvestoryy" />
        <meta property="og:description" content="Explore and compare top mutual fund schemes. Start your SIP journey with MyInvestoryy. Expert advice, performance analysis, and easy investment options." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mutual Fund | MyInvestoryy" />
        <meta name="twitter:description" content="Explore and compare top mutual fund schemes. Start your SIP journey with MyInvestoryy. Expert advice, performance analysis, and easy investment options." />
        <meta name="twitter:image" content="/og-image.png" />
      </Helmet>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar links={navLinks} />
      
      <div className="bg-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4">
          <h1 className="text-3xl text-center jaini-regular font-bold text-white">Mutual Funds</h1>

          {/* Header */}
          <div className="text-center py-4 max-w-4xl mx-auto px-4">
            <div className="flex justify-center">
              <button
                onClick={handleInterestClick}
                className="bg-gradient-to-r from-[#529F77] to-[#3C8576] text-white text-base md:text-lg rounded-xl shadow-md flex items-center gap-2 border-b-[4px] border-r-[4px] border-white hover:scale-[1.03] transition-transform duration-200 relative active:translate-y-1 active:translate-x-1 active:shadow-sm active:border-b-[1px] active:border-r-[1px] py-2 px-6"
              >
                <span className="font-sans text-[18px] md:text-[22px] leading-tight">
                  Invest Now
                </span>

                <div
                  className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none opacity-30"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)',
                  }}
                />
              </button>
            </div>
          </div>

      {/* Interest Modal */}
      {isInterestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div
            // ref={interestModalRef}
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
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    Continue on WhatsApp
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-1 text-white flex items-center">
                  <span className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  </span>
                  Mutual Fund Interest Form
                </h3>

                <p className="text-gray-300 text-sm mb-6">Please fill in your details to express interest in this investing. Our team will contact you soon.</p>

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

                  {/* Investment Type Options */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Investment Type</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="investmentType"
                          value="sip"
                          checked={formData.investmentType === 'sip'}
                          onChange={handleInputChange}
                          className="accent-green-500"
                        />
                        SIP
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="investmentType"
                          value="lumpsum"
                          checked={formData.investmentType === 'lumpsum'}
                          onChange={handleInputChange}
                          className="accent-green-500"
                        />
                        Lumpsum
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="investmentType"
                          value="both"
                          checked={formData.investmentType === 'both'}
                          onChange={handleInputChange}
                          className="accent-green-500"
                        />
                        Both
                      </label>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button onClick={handleSubmit}
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Submit Interest
                    </button>
                  </div>
                </form>

                <p className="text-gray-400 text-xs mt-4 text-center">
                  By submitting this form, you agree to our privacy policy and terms of service.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Investment Form Modal */}
      {showFormModal && (
        <Modal isOpen={showFormModal} onClose={closeFormModal}>
          <div className="p-6 w-full max-w-2xl mx-auto">
            <InvestmentForm />
          </div>
        </Modal>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto mt-8 sm:mt-12 px-4 sm:px-6 lg:px-8">        {loading ? (
        <div className="text-center text-white py-10">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : mutualFundData ? (
        <>
          {/* Tabs */}
          <div className="flex justify-center gap-4 sm:gap-8 mt-6 sm:mt-8 lg:mt-10">
            <button
              className={`relative text-base sm:text-lg px-2 py-1 hover:text-[#55B991] transition-all duration-200 ${activeTab === 'lumpsum'
                ? 'text-[#55B991] after:content-["" ] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-0.5 after:bg-[#55B991] transform scale-105'
                : 'text-white'
                }`}
              onClick={() => setActiveTab('lumpsum')}
            >
              Lumpsum
            </button>
            <button
              className={`relative text-base sm:text-lg px-2 py-1 hover:text-[#55B991] transition-all duration-200 ${activeTab === 'sip'
                ? 'text-[#55B991] after:content-["" ] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-0.5 after:bg-[#55B991] transform scale-105'
                : 'text-white'
                }`}
              onClick={() => setActiveTab('sip')}
            >
              SIP
            </button>
          </div>

          {/* Lumpsum or SIP Section */}
          {activeTab === 'lumpsum' ? (
            <div className="mt-6 sm:mt-8 lg:mt-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl text-[#55B991] text-center jaini-regular transform hover:scale-105 transition-transform duration-300">
                Lumpsum Investment
              </h2>
              {/* Features Grid from API */}
              <div className="max-w-6xl mx-auto">
                <FeatureHighlight items={mutualFundData.lumpsum_tax_points?.map((item, idx) => ({ id: item.id || idx, description: item.why_lumpsum })) || []} />
              </div>
              {/* Strategic Options from API */}
              <div className="mt-8 sm:mt-12 lg:mt-16">
                <h2 className="text-xl sm:text-2xl lg:text-3xl text-[#55B991] text-center mb-8 sm:mb-12 jaini-regular transform hover:scale-105 transition-transform duration-300">
                  Strategic Options of Lumpsum Investment
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 max-w-5xl mx-auto px-4 sm:px-6">
                  {mutualFundData.lumpsum_strategies?.map((strategy, idx) => (
                    <div key={strategy.id || idx} className="border-2 border-[#55B991] bg-black text-white min-h-[320px] sm:min-h-[370px] flex flex-col justify-start transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg">
                      <div className="border-b-2 border-[#55B991]">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-light bg-black px-3 py-3 sm:py-4 text-center underline tracking-wide" style={{ fontFamily: 'inherit' }}>
                          {strategy.heading}
                        </h3>
                      </div>
                      <div className="flex-1 flex flex-col justify-center p-4 sm:p-6 lg:p-8 text-sm sm:text-base space-y-3 sm:space-y-4 text-center text-gray-300">
                        <div className="transition-all duration-200 hover:text-[#55B991]" dangerouslySetInnerHTML={{ __html: strategy.content }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Calculator Button */}
              <div className="text-center mt-8 sm:mt-12 lg:mt-16">
                <button onClick={() => navigate('/mutual-fund-calculator?type=lumpsum')} className="bg-gradient-to-r from-[#AC1C30] to-[#AC1C30] text-white text-base px-6 sm:px-8 py-2 sm:py-3 rounded-xl shadow-md flex items-center gap-1 border-b-[4px] border-r-[4px] border-white hover:scale-[1.03] transition-all duration-200 relative active:translate-y-1 active:translate-x-1 active:shadow-sm active:border-b-[1px] active:border-r-[1px] mx-auto">
                  <span className="font-sans text-[16px] sm:text-[18px] leading-tight">
                    Calculate Returns on Lumpsum
                  </span>
                  <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none opacity-30"
                    style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)' }}
                  />
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 sm:mt-8 lg:mt-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl text-[#55B991] text-center jaini-regular transform hover:scale-105 transition-transform duration-300">
                Systematic Investment Plan
              </h2>
              {/* SIP Features from API */}
              <div className="max-w-6xl mx-auto">
                <FeatureHighlight items={mutualFundData.sip_points?.map((item, idx) => ({ id: item.id || idx, description: item.why_sip })) || []} />
              </div>
              {/* Rupee Cost Averaging & Compounding Cards (API or fallback) */}
              <div className="space-y-8 md:space-y-0 md:flex md:flex-row gap-6 lg:gap-8 justify-center items-start mt-16 sm:mt-20">
                <div className="flex-1">
                  <div className="bg-black rounded-lg shadow-lg p-3 sm:p-4 md:p-6 lg:p-8 transform hover:scale-[1.02] transition-transform duration-300">
                    <h2 className="text-xl sm:text-2xl text-[#55B991] font-semibold mb-4 sm:mb-6 jaini-regular text-center">
                      Rupee Cost Averaging Comparison
                    </h2>
                    <img
                      src={mutualFundData.sip_images && mutualFundData.sip_images[0] ? `https://backend.myinvestoryy.com/backend/storage/app/public/${mutualFundData.sip_images[0].image_path}` : rupeeCostAveraging}
                      alt="Rupee Cost Averaging Comparison"
                      className="w-full h-auto rounded-md border border-[#333] cursor-pointer hover:opacity-90 transition-opacity duration-300"
                      loading="lazy"
                      onClick={() => handleImageClick(mutualFundData.sip_images && mutualFundData.sip_images[0] ? `https://backend.myinvestoryy.com/backend/storage/app/public/${mutualFundData.sip_images[0].image_path}` : rupeeCostAveraging)}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-black rounded-lg shadow-lg p-3 sm:p-4 md:p-6 lg:p-8 transform hover:scale-[1.02] transition-transform duration-300">
                    <h2 className="text-xl sm:text-2xl text-[#55B991] font-semibold mb-4 sm:mb-6 jaini-regular text-center">
                      Compounding in Mutual Fund
                    </h2>
                    <img
                      src={mutualFundData.sip_images && mutualFundData.sip_images[1] ? `https://backend.myinvestoryy.com/backend/storage/app/public/${mutualFundData.sip_images[1].image_path}` : compoundingMutualFund}
                      alt="Compounding in Mutual Fund"
                      className="w-full h-auto rounded-md border border-[#333] cursor-pointer hover:opacity-90 transition-opacity duration-300"
                      loading="lazy"
                      onClick={() => handleImageClick(mutualFundData.sip_images && mutualFundData.sip_images[1] ? `https://backend.myinvestoryy.com/backend/storage/app/public/${mutualFundData.sip_images[1].image_path}` : compoundingMutualFund)}
                    />
                  </div>
                </div>
              </div>

              {/* SIP Calculator Button */}
              <div className="text-center mt-8 sm:mt-12">
                <button onClick={() => navigate('/mutual-fund-calculator?type=sip')} className="bg-gradient-to-r from-[#AC1C30] to-[#AC1C30] text-white text-base px-6 sm:px-8 py-2 sm:py-3 rounded-xl shadow-md flex items-center gap-1 border-b-[4px] border-r-[4px] border-white hover:scale-[1.03] transition-all duration-200 relative active:translate-y-1 active:translate-x-1 active:shadow-sm active:border-b-[1px] active:border-r-[1px] mx-auto">
                  <span className="font-sans text-[16px] sm:text-[18px] leading-tight">
                    Calculate Returns on SIP
                  </span>
                  <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none opacity-30"
                    style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)' }}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Mutual Funds Table Section */}
          <div className="mt-16 sm:mt-20 lg:mt-24">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-[#55B991] text-center mb-8 sm:mb-12 jaini-regular transform hover:scale-105 transition-transform duration-300">
              Top Mutual Funds for Longterm Investments
            </h2>
            <div className="bg-black mb-16 sm:mb-20 lg:mb-25 p-2 sm:p-4 overflow-x-auto rounded-lg shadow-lg">
              <div className="min-w-[1000px] transform hover:scale-[1.01] transition-transform duration-300">
                {/* Header Row */}
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-0 mb-2">
                  <div className="bg-[#55B991] h-12 text-white text-sm sm:text-base lg:text-xl p-1 sm:p-2 lg:p-3 border-2 border-white text-center font-medium flex items-center justify-center">
                    <span>Scheme</span>
                  </div>
                  <div className="bg-[#55B991] h-12 text-white text-sm sm:text-base lg:text-xl p-1 sm:p-2 lg:p-3 border-2 border-white text-center font-medium flex items-center justify-center">
                    <span>5 Year Return</span>
                  </div>
                  <div className="bg-[#55B991] h-12 text-white text-sm sm:text-base lg:text-xl p-1 sm:p-2 lg:p-3 border-2 border-white text-center font-medium flex items-center justify-center">
                    <span>AUM</span>
                  </div>
                  <div className="bg-[#55B991] h-12 text-white text-sm sm:text-base lg:text-xl p-1 sm:p-2 lg:p-3 border-2 border-white text-center font-medium flex items-center justify-center">
                    <span>Expense Ratio (%)</span>
                  </div>
                  <div className="bg-[#55B991] h-12 text-white text-sm sm:text-base lg:text-xl p-1 sm:p-2 lg:p-3 border-2 border-white text-center font-medium flex items-center justify-center">
                    <span>Type</span>
                  </div>
                </div>
                {/* Data Rows from API */}
                {mutualFundData.top_mutual_funds && mutualFundData.top_mutual_funds.length > 0 ? (
                  mutualFundData.top_mutual_funds.map((fund, index) => (
                    <div key={fund.id || index} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-0 mb-2 hover:bg-[#111] transition-colors duration-200 items-stretch">
                      <div className="bg-black border text-center p-[15px] border-gray-400 flex items-center justify-center hover:border-[#55B991] transition-colors duration-200 text-white text-xs sm:text-sm lg:text-base leading-tight break-words hyphens-auto overflow-wrap-anywhere">
                        <span className="px-1">{fund.scheme_name}</span>
                      </div>
                      <div className="bg-black border text-center p-[10px] border-gray-400 flex items-center justify-center hover:border-[#55B991] transition-colors duration-200 text-white text-sm sm:text-base">
                        {fund.five_year_return}
                      </div>
                      <div className="bg-black border text-center p-[10px] border-gray-400 flex items-center justify-center hover:border-[#55B991] transition-colors duration-200 text-white text-sm sm:text-base">
                        {fund.aum}
                      </div>
                      <div className="bg-black border text-center p-[10px] border-gray-400 flex items-center justify-center hover:border-[#55B991] transition-colors duration-200 text-white text-sm sm:text-base">
                        {fund.amc_name} 
                      </div>
                      <div className="bg-black border text-center p-[10px] border-gray-400 flex items-center justify-center hover:border-[#55B991] transition-colors duration-200 text-white text-sm sm:text-base">
                        {fund.fund_type}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-white py-6">No data available.</div>
                )}
              </div>
            </div>
          </div>

          {/* FAQ Section from API if available, else fallback */}
          <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
            
            <div className="">
              <FAQ faqs={mutualFundData.mutual_fund_faq || [
                {
                  question: "What is a Mutual Fund?",
                  answer: "A mutual fund is an investment vehicle that pools money from multiple investors to purchase a diversified portfolio of stocks, bonds, or other securities."
                },
                {
                  question: "How do I invest in a Mutual Fund?",
                  answer: "You can invest in mutual funds through a financial advisor, directly with the fund company, or through online brokerage platforms."
                },
                {
                  question: "What are the different types of Mutual Funds?",
                  answer: "There are various types of mutual funds including equity funds, debt funds, hybrid funds, and index funds, each with different risk and return profiles."
                },
                {
                  question: "What is the minimum investment amount for Mutual Funds?",
                  answer: "The minimum investment amount varies by fund but typically starts at Rs. 5000 for lumpsum investments and Rs. 500 for SIPs."
                },
                {
                  question: "What are the risks associated with Mutual Funds?",
                  answer: "Mutual funds carry market risks, and the value of your investment can fluctuate based on market conditions. It's important to understand your risk tolerance before investing."
                }
              ]} />
            </div>
          </div>
        </>
      ) : null}
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageUrl={selectedImage}
      />
    </div>

    {/* FAQ Section with consistent spacing */}
    <div className="bg-black relative">
      <div className="max-w-7xl mx-auto">
        <div className='py-16'>
          <CallToAction />
        </div>
      </div>
    </div>

    <JoinCommunity />
    <Footer />
      </div>
    </>
  );
};


export default MutualFund;
