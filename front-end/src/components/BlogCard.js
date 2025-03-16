import React from 'react';
import { Link } from 'react-router-dom';

function BlogCard({ blog }) {
    return (
        <div className="blog-card">
            <img src={blog.image_url} alt={blog.title} />
            <h2>{blog.title}</h2>
            <p>{blog.intro}</p>
            <Link to={`/blogs/${blog.id}`}>Read More</Link>
        </div>
    );
}

export default BlogCard;
