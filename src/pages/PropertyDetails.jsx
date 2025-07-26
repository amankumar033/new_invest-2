import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import CallToAction from '../components/CallToAction';
import RealEstateComponent from '../components/RealEstateComponent';
import JoinCommunity from '../components/JoinCommunity';
import Footer from '../components/Footer';

const PropertyDetails = () => {
  const { slug } = useParams(); // 👈 Get slug from URL
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navLinks = [
    { title: 'Real Estate', href: '/real-estate' },
    { title: 'Insurance', href: '/insurance' },
    { title: 'Mutual Fund', href: '/mutual-fund' },
  ];


  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiBase}api/properties/${slug}`);
        if (!response.ok) throw new Error('Property not found');
        const data = await response.json();
        setProperty(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [slug]);
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-6"></div>
      <div className="text-xl font-semibold tracking-wide">Loading property details...</div>
    </div>
  );
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="mb-6">
        <svg width="80" height="80" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-red-500 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9zm-9 4v.01" />
        </svg>
      </div>
      <div className="text-2xl font-bold mb-2">Property Not Found</div>
      <div className="text-gray-400 mb-6 text-center max-w-md">Sorry, the property you are looking for does not exist or has been removed.</div>
      <a href="/real-estate" className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition-colors shadow-lg">Back to Real Estate</a>
    </div>
  );

  // Prepare dynamic SEO data
  const title = `${property?.project_name || 'Property Details'} - MyInvestorry`;
  const description = property?.description || 'Explore property details on MyInvestoryy.';
  // Get the first property image for og:image
  const ogImage = '/og-image.png';
  const url = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <HelmetProvider>
      <>
        <Helmet>
          <title>{title}</title>
           <link rel="canonical" href={`${url}`} />
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          {/* <meta property="og:image" content={ogImage} /> */}
          <meta property="og:url" content={url} />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={ogImage} />
      
        </Helmet>
        <div className='bg-black min-h-screen text-white'>
          <Navbar links={navLinks} />
          <RealEstateComponent property={property} /> {/* ✅ Send data to child */}
          <CallToAction />
          <div className='mt-20'>
            <JoinCommunity/>
          </div>
          <Footer />
        </div>
      </>
    </HelmetProvider>
  );
};

export default PropertyDetails;
