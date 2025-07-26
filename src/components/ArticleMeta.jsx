import { Helmet } from 'react-helmet-async';

const ArticleMeta = ({ article }) => {
  if (!article) return null;
  const url = typeof window !== 'undefined' ? window.location.href : '';
  return (
    <Helmet>
      <title>{article.title} | MyInvestoryy</title>
      <meta name="description" content={article.content?.replace(/<[^>]+>/g, '').slice(0, 150) + '...'} />
      <meta property="og:title" content={article.title} />
      <meta property="og:description" content={article.content?.replace(/<[^>]+>/g, '').slice(0, 150) + '...'} />
      <meta property="og:image" content={article.image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="article" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={article.title} />
      <meta name="twitter:description" content={article.content?.replace(/<[^>]+>/g, '').slice(0, 150) + '...'} />
      <meta name="twitter:image" content={article.image} />
    </Helmet>
  );
};

export default ArticleMeta;
