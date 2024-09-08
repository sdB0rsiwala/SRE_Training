import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosConfig';
import '../styles/BlogSection.css'; // Import custom styles

const BlogSection = () => {
    const [blogs, setBlogs] = useState([]);
    const placeholderImage = 'path_to_placeholder_image.jpg'; // Path to your placeholder image

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axiosInstance.get('/api/blogpost/');
                console.log(response.data); // Log to check the photo field
                setBlogs(response.data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };

        fetchBlogs();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <section className="blog-section">
            <div className="container">
                <div className="header-row">
                    <div className="col-md-6">
                        <h2>Latest Posts</h2>
                    </div>
                    <div className="col-md-6 text-right">
                        <a href="/blog" className="read-blog-link">Read Blog</a>
                    </div>
                </div>
                <div className="blog-slider">
                    {blogs.map((blog) => (
                        <div className="blog-card" key={blog.id}>
                            <div className="card">
                                <img
                                    src={blog.photo || placeholderImage}
                                    className="card-img-top"
                                    alt={blog.title}
                                    onError={(e) => e.target.src = placeholderImage}
                                />
                                <div className="card-body">
                                    <p className="card-text">
                                        {formatDate(blog.date_posted)} - {blog.author}
                                    </p>
                                    <h5 className="card-title">{blog.title}</h5>                        
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

    );
};

export default BlogSection;
