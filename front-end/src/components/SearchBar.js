import React, { useState, useRef } from 'react';
import { Form } from 'react-bootstrap';

const SearchBar = ({ setSearchTerm, handleSearch }) => {
    const [query, setQuery] = useState('');
    const typingTimeoutRef = useRef(null);

    const handleInputChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        setSearchTerm(newQuery); // Update parent component's search term

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            handleSearch(e); // Trigger search
        }, 500);
    }; 

    return (
        <Form className="d-flex justify-content-center align-items-center w-100">
            <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                value={query}
                onChange={handleInputChange} // Call when typing
                style={{ maxWidth: '400px' }} // Set a maximum width for the search bar
            />
        </Form>
    );
};

export default SearchBar;
