import React, { useState } from 'react';
import CategoryFilter from '../components/CategoryFilter';
import BlogList from '../components/BlogList';
import { Container, Row, Col } from 'react-bootstrap';

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Blog List</h1>
          <CategoryFilter onCategoryChange={handleCategoryChange} />
          <BlogList category={selectedCategory} />
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
