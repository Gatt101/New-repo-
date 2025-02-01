import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import FeedCard from "../components/feed/FeedCard"; // Assuming FeedCard is set up to display post data

const IndexPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [newsPosts, setNewsPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axiosInstance.get("/auth/news", {
          params: { language: "en" },
        });
        const newsData = response.data.articles;
        setNewsPosts(newsData);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Filter and sort news
  const filteredAndSortedPosts = newsPosts
    .filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.publishedAt) - new Date(a.publishedAt);
      if (sortBy === "oldest") return new Date(a.publishedAt) - new Date(b.publishedAt);
      return 0;
    });

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Add padding-top or margin-top to move content below the navbar */}
      <div className="mx-auto w-full max-w-3xl pt-16"> {/* Adjust pt-16 as needed */}
        {/* Search bar */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 px-4 border border-gray-300 rounded-lg"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* News Feed */}
        <div className="space-y-6">
          {loading && <p className="text-center">Loading news articles...</p>}
          {!loading && error && <p className="text-center text-red-500">{error}</p>}
          {!loading && !error && filteredAndSortedPosts.length === 0 && (
            <p className="text-center">No posts found matching your criteria</p>
          )}
          {!loading &&
            !error &&
            filteredAndSortedPosts.map((post, index) => (
              <FeedCard
                key={index}
                title={post.title}
                content={post.description}
                author={post.source.name}
                timestamp={post.publishedAt}
                image={post.urlToImage}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default IndexPage;