import React from "react";

const FeedCard = ({ title, content, author, timestamp, image }) => {
  // If there's no image, return null and don't render the component
  if (!image) return null; // Skip rendering this article if there's no image

  return (
    <div className="bg-white shadow-lg p-6 w-[70%] mx-auto rounded-[12px]">
      <div className="mb-4">
        {/* Render the image only if it exists */}
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover rounded-[12px]"
        />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-700 text-sm mb-4">
        <span className="font-medium text-gray-600">{author}</span> |{" "}
        {new Date(timestamp).toLocaleDateString()}
      </p>
      <p className="text-gray-600">{content}</p>
    </div>
  );
};

export default FeedCard;