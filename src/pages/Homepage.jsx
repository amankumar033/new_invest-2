import React, { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import DiversifiedOptions from "../components/DiversifiedOptions";
import LegacyCards from "../components/LegacyCards";
import AwardsSection from "../components/AwardSection";
import CallToAction from "../components/CallToAction";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import JoinCommunity from "../components/JoinCommunity";
import Footer from "../components/Footer";
import Loader  from "../components/Loader";

const Homepage = () => {
  const navLinks = [
    { title: "Real Estate", href: "/real-estate" },
    { title: "Insurance", href: "/insurance" },
    { title: "Mutual Fund", href: "/mutual-fund" },
  ];

  const [homepageData, setHomepageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL; // e.g., http://127.0.0.1:8000

  useEffect(() => {
    const fetchHomepageData = async () => {
      if (!apiUrl) {
        console.error("VITE_API_URL is not set in your .env file.");
        setApiError("API URL not configured.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}api/homepage`);
        if (!response.ok) {
          throw new Error("Failed to fetch homepage data.");
        }
        const data = await response.json();
        setHomepageData(data);
      } catch (err) {
        console.error("Error fetching homepage:", err);
        setApiError("Something went wrong while loading the homepage.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageData();
  }, [apiUrl]);

  if (loading) {
    return (
      <Loader/>
    );
  }

  if (apiError) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <p> </p>
      </div>
    );
  }

  // SEO meta tags
  const title = "MyInvestoryy - Free Personalized Financial & Investment Planning";
  const description = "Get a free personalized investment plan from MyInvestoryy. Expert advice on financial planning, mutual funds, insurance, and real estate investment.";
  const ogImage = "https://myinvestoryy.com/favicon.png";
  const url = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <HelmetProvider>
      <>
      
        <Helmet>
          <title>{title}</title>
          <link rel="canonical" href={url} />
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={ogImage} />
          <meta property="og:url" content={url} />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={ogImage} />
        </Helmet>
        <div className="bg-black min-h-screen text-white">
          {/* Navbar */}
          <Navbar links={navLinks} />

          {/* Hero Section */}
          <div className="px-5 pt-8 sm:p-10">
            <HeroSection homepageData={homepageData} />
          </div>

          {/* Other sections */}
         {homepageData.investment_options?.length > 0 && (
      <DiversifiedOptions homepageData={homepageData} />
    )}

    {homepageData?.legacycards?.length > 0 && (
      <LegacyCards homepageData={homepageData} />
    )}

    {Array.isArray(homepageData?.awards) && homepageData.awards.length > 0 && (
      <AwardsSection awards={homepageData.awards} />
    )}


    <CallToAction homepageData={homepageData} />


    {Array.isArray(homepageData?.testimonials) && homepageData.testimonials.length > 0 && (
      <Testimonials testimonialsData={homepageData.testimonials} />
    )}

    {Array.isArray(homepageData?.faqs) && homepageData.faqs.length > 0 && (
      <div className="mb-18 md:mb-24">
        <FAQ faqs={homepageData.faqs} />
        </div>
    )}

          <JoinCommunity homepageData={homepageData} />
          <Footer />
        </div>
      </>
    </HelmetProvider>
  );
};

export default Homepage;
