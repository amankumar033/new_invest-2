import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_BASE = import.meta.env.VITE_API_URL || '';

const Articles = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${API_BASE}api/articles`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch articles');
        const json = await res.json();
        setArticles(json.data.map(article => ({
          ...article,
          image: article.image.startsWith('http') ? article.image : `${API_BASE}backend/storage/app/public/${article.image}`,
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const categories = [
    { id: 'all', name: 'All Articles' },
    // Dynamically add categories from articles if needed
    ...Array.from(new Set(articles.map(a => a.category))).filter(Boolean).map(cat => ({ id: cat, name: cat.charAt(0).toUpperCase() + cat.slice(1) }))
  ];

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-800 rounded w-1/2 mx-auto mb-8"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-800 rounded-xl mb-8"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl text-white mb-4">{error}</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
          Investment Insights
        </h1>
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category.id
                  ? 'bg-[#54A175] text-white'
                  : 'bg-gray-900 text-gray-300 border border-gray-800 hover:border-[#54A175] hover:text-[#54A175]'
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <Link
              to={`/articles/${article.slug}`}
              key={article.slug}
              className="group bg-gray-900 border border-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105"
            >
              <div className="relative">
                <picture>
                  <source
                    srcSet={article.phone_image ? `${article.phone_image.startsWith('http') ? article.phone_image : `${API_BASE}backend/storage/app/public/${article.phone_image}`}` : `${article.image}`}
                    media="(max-width: 640px)"
                  />
                  <img
                    src={`${article.image}`}
                    alt={article.title}
                    className="w-full h-48 object-cover brightness-75 group-hover:brightness-100 transition-all"
                  />
                </picture>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent h-16"></div>
              </div>
              <div className="p-6 bg-gray-900">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm text-[#54A175]">{article.date}</span>
                  <span className="text-sm text-gray-600">•</span>
                  <span className="text-sm text-[#54A175]">{article.read_time} min read</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#54A175] transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-400 mb-4">
                  {article.summary || (article.content ? article.content.replace(/<[^>]+>/g, '').slice(0, 120) + '...' : '')}
                </p>
                <div className="flex items-center text-[#54A175] font-medium group-hover:text-[#3C8576]">
                  Read More
                  <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Articles;
