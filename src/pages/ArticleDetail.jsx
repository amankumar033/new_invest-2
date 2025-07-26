import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JoinCommunity from '../components/JoinCommunity';
import CallToAction from '../components/CallToAction';
import ArticleMeta from '../components/ArticleMeta';
import '../styles/ProseOverrides.css';

const API_BASE = import.meta.env.VITE_API_URL || '';

const ArticleDetail = () => {
  const { slug } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCopyMsg, setShowCopyMsg] = useState(false);
  const isShareSupported = typeof navigator !== 'undefined' && !!navigator.share;

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${API_BASE}api/articles/${slug}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Article not found');
        const json = await res.json();
        const data = json.data;
        setArticle({
          slug: data.slug,
          title: data.title,
          author: data.author,
          authorRole: data.author_role || '',
          date: data.date,
          readTime: data.read_time + ' min read',
          content: data.content,
          image: data.image.startsWith('http') ? data.image : `${API_BASE}backend/storage/app/public/${data.image}`,
          phone_image: data.phone_image ? (data.phone_image.startsWith('http') ? data.phone_image : `${API_BASE}backend/storage/app/public/${data.phone_image}`) : undefined,
          tags: data.tags || [],
          category: data.category || '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  const handleShare = () => {
    if (isShareSupported && article) {
      navigator.share({
        title: article.title,
        text: 'Check out this interesting article!',
        url: window.location.href,
      });
    } else {
      // Fallback: Copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      setShowCopyMsg(true);
      setTimeout(() => setShowCopyMsg(false), 2000);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-pulse">
            <div className="h-[40vh] bg-gray-800 rounded-xl mb-8"></div>
            <div className="h-4 bg-gray-800 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-800 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl text-white mb-4">{error || 'Article Not Found'}</h1>
          <Link to="/articles" className="text-[#54A175] hover:text-[#3C8576]">
            ← Back to Articles
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <ArticleMeta article={article} />
      <Navbar />
      <article className="w-full max-w-full md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-8 text-white">
        {/* Hero Section */}
        <div className="relative h-[28vh] xs:h-[32vh] sm:h-[38vh] md:h-[50vh] lg:h-[60vh] w-full mb-4 sm:mb-8 rounded-xl overflow-hidden">
          <picture>
            <source
              srcSet={article.phone_image ? (article.phone_image.startsWith('http') ? article.phone_image : `${API_BASE}backend/storage/app/public/${article.phone_image}`) : article.image}
              media="(max-width: 640px)"
            />
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </picture>
          <div className="absolute inset-0 "></div>
          {/* Back to Articles Link */}
          <Link 
            to="/articles" 
            className="absolute p-2 top-4 left-4 md:top-8 md:left-8 flex items-center text-white hover:text-[#54A175] transition-colors bg-gray-900/50 backdrop-blur-sm text-white rounded-full hover:bg-gray-900 transition-colors"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Articles
          </Link>
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-2 px-4 py-2 bg-gray-900/50 backdrop-blur-sm text-white rounded-full hover:bg-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {isShareSupported ? 'Share' : 'Copy Link'}
          </button>
          {showCopyMsg && (
            <div className="absolute top-16 right-4 md:top-20 md:right-8 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-10 text-sm">
              Link copied!
            </div>
          )}
        </div>
        {/* Title and Author Info BELOW the image */}
        <div className="px-2 sm:px-6 pb-2 sm:pb-6 mb-2 sm:mb-6">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-6 leading-tight break-words text-white drop-shadow-lg">
            {article.title}
          </h1>
          <div className="flex items-center gap-2 mb-2">
            <img 
              src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${article.author}`}
              alt={article.author}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-800"
            />
            <div>
              <p className="font-medium text-white text-sm sm:text-base">{article.author}</p>
              <p className="text-xs sm:text-sm text-gray-400">{article.authorRole}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm">
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-900 rounded-xl p-2 xs:p-3 sm:p-4 md:p-8 mb-6 sm:mb-8 overflow-x-auto">
          <div className="prose prose-invert max-w-full prose-img:mx-auto prose-img:max-w-full prose-table:w-full prose-table:max-w-full prose-table:overflow-x-auto prose-p:text-base prose-p:sm:text-lg prose-h1:text-2xl prose-h1:sm:text-3xl prose-h2:text-xl prose-h2:sm:text-2xl prose-h3:text-lg prose-h3:sm:text-xl" style={{wordBreak:'break-word'}} dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {article.tags.map(tag => (
            <span 
              key={tag}
              className="px-3 py-1 bg-gray-900 text-gray-300 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between py-6 border-t border-gray-800">
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-gray-300 rounded-full hover:text-[#54A175] transition-colors"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" 
              />
            </svg>
            <span>{isShareSupported ? 'Share' : 'Copy Link'}</span>
          </button>
          {showCopyMsg && (
            <div className="bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-10 text-sm ml-4">
              Link copied!
            </div>
          )}
        </div>
      </article>
      <div className="mb-16">
              <CallToAction />
            </div>
      
      <JoinCommunity />
      <Footer />
    </div>
  );
};

export default ArticleDetail;
