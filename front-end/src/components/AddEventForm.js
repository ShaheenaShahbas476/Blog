import React, { useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const AddEventForm = ({ fetchBlogs }) => {
  const [formData, setFormData] = useState({
    email: '',
    url: '',
    category: '',
    linkedin: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/blogs', formData); // Adjust API URL as needed
      fetchBlogs(); // Refresh blog list after adding new blog
      setFormData({ email: '', url: '', category: '', linkedin: '' }); // Reset form
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return (
    <Row className="mb-4 justify-content-center">
      <Col md={8}>
        <Form onSubmit={handleSubmit}>
          <h2 className="text-center mb-3">Add Your FinOps Event, Podcast, Newsletter</h2>
          <Form.Group controlId="formEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="you@email.com" 
              required 
            />
          </Form.Group>
          <br />
          <Form.Group controlId="formUrl">
            <Form.Label>URL</Form.Label>
            <Form.Control 
              type="text" 
              name="url" 
              value={formData.url} 
              onChange={handleChange} 
              placeholder="Url of the event" 
              required 
            />
          </Form.Group>
          <br />
          <Form.Group controlId="formCategory">
            <Form.Label>Category</Form.Label>
            <Form.Control 
              type="text" 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              placeholder="Event, Newsletter, or Podcast" 
              required 
            />
          </Form.Group>
          <br />
          <Form.Group controlId="formLinkedin">
            <Form.Label>LinkedIn Handle</Form.Label>
            <Form.Control 
              type="text" 
              name="linkedin" 
              value={formData.linkedin} 
              onChange={handleChange} 
              placeholder="LinkedIn Handle" 
              required 
            />
          </Form.Group>
          <br />
          <div className="text-center mt-3">
            <Button variant="primary" type="submit" size="sm">Submit</Button> {/* Smaller button */}
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default AddEventForm;
