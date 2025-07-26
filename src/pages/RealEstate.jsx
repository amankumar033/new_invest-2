import React from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import JoinCommunity from '../components/JoinCommunity';
import Footer from '../components/Footer';
import CallToAction from '../components/CallToAction';
import RealEstateListings from '../components/RealEstateListing';

const RealEstate = () => {
    const navLinks = [
        { title: 'Home', href: '/' },
        { title: 'Real Estate', href: '/real-estate' },
        { title: 'Insurance', href: '/insurance' },
        { title: 'Mutual Fund', href: '/mutual-fund' },
    ];
    // SEO meta tags
    const title = "Real Estate Investment Options | MyInvestoryy";
    const description = "Explore real estate investment opportunities with MyInvestoryy.";
    const ogImage = "/og-image.png";
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
            {/* <meta property="og:image" content={ogImage} /> */}
            <meta property="og:url" content={url} />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
          </Helmet>
          <div className='bg-black min-h-screen text-white'>
            <Navbar links={navLinks}/>
            <div className="bg-black">
              <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4">
                <h1 className="text-3xl text-center jaini-regular font-bold text-white mb-8 mt-17 md:mt-0">Real Estate</h1>
                <RealEstateListings/>
              </div>
            </div>
            
            {/* FAQ Section with consistent spacing */}
            <div className="bg-black relative">
              <div className="max-w-7xl mx-auto">
                <div className='py-16'>
                  <CallToAction/>
                </div>
              </div>
            </div>
            
            <div className='mt-20'>
              <JoinCommunity/>
            </div>
            <Footer />
          </div>
        </>
      </HelmetProvider>
    )
}

export default RealEstate