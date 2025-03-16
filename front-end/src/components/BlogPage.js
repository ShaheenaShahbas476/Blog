import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify'; // Import DOMPurify for sanitizing
import { Container, Button, Row, Col } from 'react-bootstrap'; // Import necessary Bootstrap components

const BlogPage = () => {
    const { id } = useParams(); // Get the blog ID from the URL
    const [blog, setBlog] = useState(null); // State to hold the blog data

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/blogs/${id}`); // Fetch blog by ID
                setBlog(response.data); // Set the blog data
            } catch (error) {
                console.error('Error fetching blog:', error);
            }
        };

        fetchBlog();
    }, [id]); // Fetch blog when ID changes

    if (!blog) {
        return <div>Loading...</div>; // Show loading state
    }

    return (
        <Container fluid style={{backgroundColor: 'white'}}>
            <Container className='ml-5 mr-5'>            
                <div 
                    className="blog-content" 
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }} 
                /> 
                <Row className="mt-4">
                    <Col className="text-start">
                        <p className="text-muted">Last updated: {new Date(blog.created_at).toLocaleDateString()}</p>
                    </Col>
                </Row>
                <Row className="mt-2">
                    <Col className="text-start">
                        <p className="text-muted">Author: {blog.authorname || "Unknown Author"}</p>
                    </Col>
                </Row>

                <div className="text-end mt-4">
                    <Button variant="primary" onClick={() => window.history.back()}>
                        Go Back
                    </Button>
                </div>
                <br />
            </Container>
        </Container>
    );
};

export default BlogPage;
