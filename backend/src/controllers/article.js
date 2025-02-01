import axios from 'axios';

const getArticles = async (req, res) => {
  try {
    // Fetch news data with the language filter set to 'en'
    const response = await axios.get(process.env.NEWS_API_URL, {
      params: {
        language: 'en', // Fetch only English articles
      },
    });

    // Filter out articles that do not have an image or content
    const filteredArticles = response.data.articles.filter(
      (article) => article.urlToImage && article.title && article.description
    );

    // Send back the filtered articles (those with images and content)
    res.status(200).json({ articles: filteredArticles });
  } catch (err) {
    console.error("Error fetching news:", err);
    res.status(500).json({ message: "Failed to fetch news" });
  }
};

export default getArticles;