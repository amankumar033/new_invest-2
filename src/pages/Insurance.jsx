import React, { useState, useEffect } from 'react';
import '../styles/Insurance.css';
import { Link } from 'react-router-dom'; // Added for internal links if needed
import { FaPlus } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';
import JoinCommunity from '../components/JoinCommunity';
import FAQ from '../components/FAQ';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet';

const Insurance = () => {
    const [activeTab, setActiveTab] = useState('all'); // Set 'all' as default
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [insurancePlans, setInsurancePlans] = useState({ life: [], medical: [], general: [] });
    const [faqs, setFaqs] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        selectedOptions: []
    }); 
    const [loading, setLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [submittedName, setSubmittedName] = useState('');
    const [submittedInsuranceTypes, setSubmittedInsuranceTypes] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const apiUrl = import.meta.env.VITE_API_URL; // e.g., http://127.0.0.1:8000

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetch(`${apiUrl}api/insurance-plans`),
            fetch(`${apiUrl}api/insurance-faqs`),
            fetch(`${apiUrl}api/homepage`)
        ])
            .then(([plansRes, faqsRes, homepageRes]) => Promise.all([plansRes.json(), faqsRes.json(), homepageRes.json()]))
            .then(([plansData, faqsData, homepageData]) => {
                // Process the plans data
                const grouped = { life: [], medical: [], general: [] };
                plansData.forEach(plan => {
                    // Convert category to lowercase for consistent mapping
                    const category = plan.category?.toLowerCase();
                    if (grouped[category]) {
                        grouped[category].push(plan);
                    }
                });
                setInsurancePlans(grouped);
                setFaqs(faqsData);
                
                // Set WhatsApp number
                const whatsappNumber = Array.isArray(homepageData.whatsapp_icons) && homepageData.whatsapp_icons.length > 0
                    ? homepageData.whatsapp_icons[0].number
                    : '919811151619'; // Fallback number
                setWhatsappNumber(whatsappNumber);
                
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                toast.error('Failed to fetch data.');
                console.error('Failed to fetch data:', err);
                // Set fallback WhatsApp number
                setWhatsappNumber('919811151619');
            });
    }, [apiUrl]);

    const navLinks = [
        { title: 'Home', href: '/' },
        { title: 'Real Estate', href: '/real-estate' },
        { title: 'Insurance', href: '/insurance' },
        { title: 'Mutual Fund', href: '/mutual-fund' },
    ];
    // Insurance plan data


    // Get all plans for the "All" tab
    // Data is already structured by category in insurancePlans object
    // No need for a separate allPlans array if displaying category-wise

    // Insurance options for the form
    const insuranceOptions = [
        { id: 'life', label: 'Life' },
        { id: 'medical', label: 'Medical' },
        { id: 'general', label: 'General' },
    ];

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // Open plan details modal
    const openPlanModal = (plan) => {
        // Check if plan has details (e.g., key_features and heading)
        if (!plan || !plan.key_features || !plan.heading) {
            // toast.error('Details not available for this plan.');
            return;
        }
        setSelectedPlan(plan);
        setShowPlanModal(true);
    };

    // Open insurance form modal
    const openFormModal = () => {
        setShowFormModal(true);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle checkbox changes for insurance options
    const handleOptionChange = (optionId) => {
        const updatedOptions = [...formData.selectedOptions];
        if (updatedOptions.includes(optionId)) {
            // Remove if already selected
            const index = updatedOptions.indexOf(optionId);
            updatedOptions.splice(index, 1);
        } else {
            // Add if not selected
            updatedOptions.push(optionId);
        }
        setFormData({
            ...formData,
            selectedOptions: updatedOptions
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.name.trim()) {
            toast.error('Please enter your name');
            return;
        }

        if (!formData.phone.trim()) {
            toast.error('Please enter your phone number');
            return;
        }

        // Indian phone number validation
        const indianPhoneRegex = /^[6-9]\d{9}$/;
        if (!indianPhoneRegex.test(formData.phone.trim())) {
            toast.error('Please enter a valid 10-digit phone number');
            return;
        }

        if (formData.selectedOptions.length === 0) {
            toast.error('Please select at least one insurance type');
            return;
        }

        const payload = {
            name: formData.name,
            phone_number: formData.phone,
            email: formData.email,
            insurance_type: formData.selectedOptions.join(', '),
        };

        try {
            const res = await fetch(`${apiUrl}api/insurance-leads`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const error = await res.json();
                toast.error('Failed to submit lead.');
                return;
            }
            toast.success("🎉 You're all set! We'll contact you soon");
            setShowFormModal(false);
            setSubmittedName(formData.name);
            setSubmittedInsuranceTypes(formData.selectedOptions.join(', '));
            setShowSuccess(true);
            setFormData({
                name: '',
                phone: '',
                email: '',
                selectedOptions: []
            });
        } catch (error) {
            console.error('Error submitting lead:', error);
            toast.error('An error occurred. Please try again.');
        }
    };

    const handleWhatsAppRedirect = () => {
        const message = encodeURIComponent(
            `Hi, I am interested in Insurance\nName: ${submittedName}\nInsurance Type: ${submittedInsuranceTypes}`
        );
        if (whatsappNumber) {
            window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
        } else {
            toast.error('WhatsApp number not available.');
        }
    };


    return (
        <>
            <Helmet>
                <title>Insurance | MyInvestoryy</title>
                <meta name="description" content="Explore and compare Life, Medical, and General insurance plans. Get insured instantly with MyInvestoryy. Expert advice, FAQs, and easy quotes." />
                <meta property="og:title" content="Insurance | MyInvestoryy" />
                <meta property="og:description" content="Explore and compare Life, Medical, and General insurance plans. Get insured instantly with MyInvestoryy. Expert advice, FAQs, and easy quotes." />
                <meta property="og:image" content="/og-image.png" />
                <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Insurance | MyInvestoryy" />
                <meta name="twitter:description" content="Explore and compare Life, Medical, and General insurance plans. Get insured instantly with MyInvestoryy. Expert advice, FAQs, and easy quotes." />
                <meta name="twitter:image" content="/og-image.png" />
            </Helmet>
            <ToastContainer position="top-right" autoClose={3000} />
            <Navbar links={navLinks} />
            <div className="bg-black">
                <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4">
                    <h1 className="text-3xl text-center jaini-regular font-bold text-white">Insurance</h1>

                    {/* Loader */}
                    {loading && (
                        <div className="flex justify-center  items-center min-h-[300px]">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
                        </div>
                    )}                    {/* Main Content */}
                    {!loading && (<div className="flex flex-col m-0 space-y-8">                        {/* Top Get Insured Button */}                        <div className="flex m-0 justify-center">
                        <button
                            onClick={openFormModal}
                            className="get-insured-btn bg-gradient-to-r from-[#529F77] to-[#3C8576] text-white text-base md:text-lg rounded-xl shadow-md flex items-center gap-2 border-b-[4px] border-r-[4px] border-white hover:scale-[1.03] transition-transform duration-200 relative active:translate-y-1 active:translate-x-1 active:shadow-sm active:border-b-[1px] active:border-r-[1px] py-1"
                        >
                            <span className="font-sans text-[18px] md:text-[22px] leading-tight">
                                Get Insured Now
                            </span>
                            <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none opacity-30"
                                style={{
                                    background: 'linear-gradient(145deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)',
                                }}
                            />
                        </button>
                    </div>

                        {/* Insurance Tabs */}
                        <div className="insurance-tabs">
                            <button
                                className={`tab-btn font-sans ${activeTab === 'all' ? 'active' : ''}`}
                                onClick={() => handleTabChange('all')}
                            >
                                All
                            </button>
                            <button
                                className={`tab-btn font-sans ${activeTab === 'life' ? 'active' : ''}`}
                                onClick={() => handleTabChange('life')}
                            >
                                Life
                            </button>
                            <button
                                className={`tab-btn font-sans ${activeTab === 'medical' ? 'active' : ''}`}
                                onClick={() => handleTabChange('medical')}
                            >
                                Medical
                            </button>
                            <button
                                className={`tab-btn font-sans ${activeTab === 'general' ? 'active' : ''}`}
                                onClick={() => handleTabChange('general')}
                            >
                                General
                            </button>
                        </div>

                        {/* Tab Title */}
                        {activeTab !== 'all' && (
                            <h2 className="section-title jaini-regular text-white">
                                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Insurance
                            </h2>
                        )}                            {/* Insurance Plans */}
                        <div className='mt-[-10px]' >
                            {activeTab === 'all' ? (
                                <div className="space-y-12">
                                    {Object.keys(insurancePlans).map((category) => (
                                        <div key={category} className="category-section">
                                            <h2 className="section-title jaini-regular text-white mt-0 mb-6">{category.charAt(0).toUpperCase() + category.slice(1)} Insurance</h2>                            <div className="w-full mb-2 px-4 sm:px-8 lg:px-16">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
                                                    {insurancePlans[category]
                                                        .filter(plan => (plan.plan_name && plan.plan_name.trim() !== '') || (plan.title && plan.title.trim() !== ''))
                                                        .map((plan) => (
                                                            <button
                                                                key={plan.id}
                                                                onClick={() => openPlanModal(plan)}
                                                                className="bg-black text-white text-base md:text-lg px-6 py-2.5 md:py-1.5 rounded-xl shadow-md flex items-center justify-center gap-1 border-b-[4px] border-r-[4px] border-white hover:scale-[1.03] transition-transform duration-200 relative active:translate-y-1 active:translate-x-1 active:shadow-sm active:border-b-[1px] active:border-r-[1px] w-full"
                                                                style={{
                                                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                                                                }}
                                                            >
                                                                <span className="underline  text-[16px] md:text-[20px] leading-tight text-center">
                                                                    {plan.plan_name || plan.title}
                                                                </span>
                                                                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none opacity-30"
                                                                    style={{
                                                                        border: '2px solid rgba(255, 255, 255, 0.2)',
                                                                        top: '1px',
                                                                        left: '1px',
                                                                        right: '1px',
                                                                        bottom: '1px',
                                                                    }}
                                                                />
                                                            </button>
                                                        ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (<div className="w-full px-4 sm:px-8 lg:px-16">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
                                    {insurancePlans[activeTab] &&
                                        insurancePlans[activeTab]
                                            .filter(plan => (plan.plan_name && plan.plan_name.trim() !== '') || (plan.title && plan.title.trim() !== ''))
                                            .map((plan) => (
                                                <button
                                                    key={plan.id}
                                                    onClick={() => openPlanModal(plan)}
                                                    className="bg-black text-white text-base md:text-lg px-6 py-2.5 md:py-1.5 rounded-xl shadow-md flex items-center justify-center gap-1 border-b-[4px] border-r-[4px] border-white hover:scale-[1.03] transition-transform duration-200 relative active:translate-y-1 active:translate-x-1 active:shadow-sm active:border-b-[1px] active:border-r-[1px] w-full"
                                                    style={{
                                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                                                    }}
                                                >
                                                    <span className="underline text-[16px] md:text-[20px]  leading-tight text-center">
                                                        {plan.plan_name || plan.title}
                                                    </span>
                                                    <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none opacity-30"
                                                        style={{
                                                            // background: 'linear-gradient(145deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)',
                                                            top: '1px',
                                                            left: '1px',
                                                            right: '1px',
                                                            bottom: '1px',
                                                        }}
                                                    />
                                                </button>
                                            ))}
                                </div>
                            </div>
                            )}
                        </div>                        {/* Bottom Get Insured Button */}                        <div className="flex justify-center pt-2">
                            <button
                                onClick={openFormModal}
                                className="get-insured-btn bg-gradient-to-r from-[#529F77] to-[#3C8576] text-white text-base md:text-lg px-4 py-1 rounded-xl shadow-md flex items-center gap-2 border-b-[4px] border-r-[4px] border-white hover:scale-[1.03] transition-transform duration-200 relative active:translate-y-1 active:translate-x-1 active:shadow-sm active:border-b-[1px] active:border-r-[1px]"
                            >
                                <span className="font-sans text-[18px] md:text-[22px] leading-tight">
                                    Get Insured Now
                                </span>
                                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none opacity-30"
                                    style={{
                                        background: 'linear-gradient(145deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)',
                                    }}
                                />
                            </button>
                        </div>
                    </div>
                    )}                </div>
            </div>

            {/* FAQ Section with consistent spacing */}
            <div className="bg-black relative">
                <div className="max-w-7xl mx-auto">
                    {!loading && faqs.length > 0 && (
                        <div className="pt-6 pb-8">
                            <FAQ faqs={faqs} />
                        </div>
                    )}

                    <div className='py-16'>
                        <CallToAction />
                    </div>
                </div>
            </div>

            <JoinCommunity />
            <Footer />

            {/* Plan Details Modal */}
            {showPlanModal && selectedPlan && (
                <div className="fixed inset-0 bg-black transition-opacity duration-300 ease-in-out flex items-center justify-center z-50 p-4 animate-[fadeIn_0.3s_ease-in-out]" onClick={() => setShowPlanModal(false)}>
                    <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 transform transition-all duration-300 ease-in-out animate-[scaleIn_0.3s_ease-in-out]" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="relative bg-gradient-to-r from-green-800 to-green-600 p-6 rounded-t-2xl">
                            <button
                                className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                                onClick={() => setShowPlanModal(false)}
                            >
                                ×
                            </button>
                            <h2 className="text-2xl font-bold text-white pr-8">{selectedPlan.heading}</h2>
                            {/* <p className="text-green-100 mt-2 text-sm">{selectedPlan.heading}</p> */}
                            {/* {selectedPlan.sub_heading && (
                                <p className="text-green-200 mt-1 text-xs">{selectedPlan.sub_heading}</p>
                            )} */}
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-6 space-y-6">
                            {/* Key Features */}
                            {selectedPlan.key_features && (
                                <div className="bg-gray-800 rounded-xl p-4 sm:p-5 border border-gray-700">
                                    <div className="flex items-center mb-4">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                        <h3 className="text-lg font-semibold text-green-400">Key Features</h3>
                                    </div>
                                    <div className="text-gray-300" dangerouslySetInnerHTML={{ __html: selectedPlan.key_features }} />
                                </div>
                            )}

                            {/* Eligibility */}
                            {(selectedPlan.age_title || selectedPlan.policy_title) && (
                                <div className="">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedPlan.age_title && (
                                            <div className="bg-gray-700 rounded-lg p-4">
                                                <div className="text-green-400 text-sm font-medium mb-1">{selectedPlan.age_title}</div>
                                                <div className="text-white font-semibold" dangerouslySetInnerHTML={{ __html: selectedPlan.age_range }} />
                                            </div>
                                        )}
                                        {selectedPlan.policy_title && (
                                            <div className="bg-gray-700 rounded-lg p-4">
                                                <div className="text-green-400 text-sm font-medium mb-1">{selectedPlan.policy_title}</div>
                                                <div className="text-white font-semibold" dangerouslySetInnerHTML={{ __html: selectedPlan.policy_term }} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* CTA Button */}
                            <div className="pt-4">
                                <button
                                    className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
                                    onClick={() => {
                                        setShowPlanModal(false);
                                        openFormModal();
                                    }}
                                >
                                    <span className="flex items-center justify-center">
                                        <span className="mr-2">🛡️</span>
                                        Get Insured Now
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Insurance Form Modal */}
            {showFormModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out animate-[fadeIn_0.3s_ease-in-out]"
                    onClick={() => setShowFormModal(false)}
                >
                    <div
                        className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out animate-[scaleIn_0.3s_ease-in-out]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                            <h2 className="text-2xl font-bold text-white">Get Insurance Quote</h2>
                            <button
                                className="text-gray-400 hover:text-white text-3xl font-light transition-colors"
                                onClick={() => setShowFormModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-6 space-y-6">
                            {/* Insurance Type Selection */}
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-green-400 mb-3">
                                    Select Insurance Type(s):
                                </label>
                                <div className="space-y-3">
                                    {insuranceOptions.map((option) => (
                                        <div key={option.id} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={option.id}
                                                checked={formData.selectedOptions.includes(option.id)}
                                                onChange={() => handleOptionChange(option.id)}
                                                className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                                            />
                                            <label
                                                htmlFor={option.id}
                                                className="ml-3 text-gray-300 font-medium cursor-pointer hover:text-white transition-colors"
                                            >
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Name Field */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-semibold text-green-400">
                                    Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            {/* Phone Field */}
                            <div className="space-y-2">
                                <label htmlFor="phone" className="block text-sm font-semibold text-green-400">
                                    Phone <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all"
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-semibold text-green-400">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all"
                                    placeholder="Enter your email address"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                            >
                                Submit Quote Request
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Page */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out animate-[fadeIn_0.3s_ease-in-out]">
                    <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out animate-[scaleIn_0.3s_ease-in-out]">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                            <h2 className="text-2xl font-bold text-white">Thank You!</h2>
                            <button
                                className="text-gray-400 hover:text-white text-3xl font-light transition-colors"
                                onClick={() => setShowSuccess(false)}
                            >
                                ×
                            </button>
                        </div>

                        {/* Success Content */}
                        <div className="p-6 space-y-6 text-center">
                            <div className="text-6xl mb-4">🎉</div>
                            <h3 className="text-xl font-bold text-green-400">
                                Thank you! {submittedName || 'User'}
                            </h3>
                            <p className="text-gray-300 text-lg">
                                Your insurance quote request has been submitted successfully!
                            </p>
                            <p className="text-gray-300">
                                Our insurance experts will contact you soon with personalized quotes and recommendations.
                            </p>
                                                         <div className="pt-4 border-t border-gray-700">
                                 <p className="text-sm text-gray-400 mb-2">For any queries, feel free to connect with us:</p>
                                 <p className="text-lg font-semibold text-green-400">9811151619</p>
                             </div>
                             
                             {/* WhatsApp Button */}
                             <button
                                 onClick={handleWhatsAppRedirect}
                                 className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center gap-2"
                             >
                                 <svg
                                     xmlns="http://www.w3.org/2000/svg"
                                     width="20"
                                     height="20"
                                     fill="currentColor"
                                     viewBox="0 0 16 16"
                                 >
                                     <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                                 </svg>
                                 Chat on WhatsApp
                             </button>
                             
                             {/* Close Button */}
                             <button
                                 onClick={() => setShowSuccess(false)}
                                 className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                             >
                                 Close
                             </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Insurance;