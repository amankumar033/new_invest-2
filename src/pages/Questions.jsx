import React from 'react'
import JoinCommunity from '../components/JoinCommunity'
import Quiz from '../components/DynamicQuiz'
import Navbar from '../components/Navbar'
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Questions = () => {
    const navLinks = [
        { title: 'Home', href: '/' },
      ];

    // SEO meta tags
    const title = "Investment Questions | MyInvestoryy";
    const description = "Answer a few questions to get your personalized investment plan on MyInvestoryy.";
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
            <Quiz
              userName="Ayush"
            />
            <JoinCommunity/>
          </div>
        </>
      </HelmetProvider>
    )
}

export default Questions;