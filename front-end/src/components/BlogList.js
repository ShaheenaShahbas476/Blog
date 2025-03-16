import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './BlogList.css';

const BlogList = ({ blogs = [] }) => (
  <>
    {blogs.length === 0 ? (
      <p>No blogs available at the moment.</p>
    ) : (

      <Row xs={1} md={4} className="g-4">
        {blogs.map((blog) => (
          
          <Col key={blog.id}>
            <Link to={`/blog/${blog.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Card 
                className="h-100 blog-card" 
                style={{ 
                  border: '1px solid #e3e3e3', 
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease' 
                }}
              >
                
                <Card.Img 
                  variant="top" src={`http://localhost:3001${blog.image_url}`}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                
                <Card.Body>
                  <Card.Title>{blog.title}</Card.Title>
                  <Card.Text>{blog.intro}</Card.Text>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">
                    Last updated {new Date(blog.created_at).toLocaleDateString()}
                  </small>
                </Card.Footer>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    )}
  </>
);

export default BlogList;
