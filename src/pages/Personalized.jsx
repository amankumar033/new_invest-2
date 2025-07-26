import React, { useEffect } from 'react'
import Footer from '../components/Footer'
import LegacyCards from '../components/LegacyCards'
import AwardsSection from '../components/AwardSection'
import JoinCommunity from '../components/JoinCommunity'
import Navbar from '../components/Navbar'
import InvestmentForm from '../components/InvestmentForm'
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Personalized = () => {
   useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navLinks = [
    { title: 'Home', href: '/' },
    { title: 'Real Estate', href: '/real-estate' },
    { title: 'Insurance', href: '/insurance' },
    { title: 'Mutual Fund', href: '/mutual-fund' },
  ];

  // SEO meta tags
  const title = "Personalized Investment Plan | MyInvestoryy";
  const description = "Get your personalized investment plan with MyInvestoryy.";
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
          <InvestmentForm/>
          <div className='mt-20'>
            <JoinCommunity/>
          </div>
          <Footer />
        </div>
      </>
    </HelmetProvider>
  )
}

export default Personalized