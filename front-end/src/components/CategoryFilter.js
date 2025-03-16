import React from 'react';
import { Button } from 'react-bootstrap';
import './CategoryFilter.css'; // Import your custom CSS

const CategoryFilter = ({ categories, selectedCategory, setSelectedCategory }) => {
    return (
        <div className="category-filter">
            <div className="button-group">
                {categories.map((category) => (
                    <Button
                        key={category}
                        variant={category === selectedCategory ? 'primary' : 'outline-primary'}
                        onClick={() => setSelectedCategory(category)} // Update selected category
                        className="category-button"
                    >
                        {category}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilter;
