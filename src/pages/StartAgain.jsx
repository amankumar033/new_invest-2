import React from 'react';
import Navbar from '../components/Navbar';
import { useLocation } from 'react-router-dom';
import JoinCommunity from '../components/JoinCommunity';
import StartAgainBtn from '../components/StartAgainBtn';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const StartAgain = () => {
  const location = useLocation();
  const name = location.state?.name || 'User';
  const phone = location.state?.phone || 'Phone';
  const navLinks = [
    { title: 'Home', href: '/' },
    { title: 'Real Estate', href: '/real-estate' },
    { title: 'Insurance', href: '/insurance' },
    { title: 'Mutual Fund', href: '/mutual-fund' },
  ];

  // SEO meta tags
  const title = "Start Again | MyInvestoryy";
  const description = "Restart your investment journey with MyInvestoryy.";
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
          <Navbar links={navLinks} />
          <StartAgainBtn userName={name} phone={phone} />

        </div>
        <JoinCommunity />
      </>
    </HelmetProvider>
  );
};

export default StartAgain;
