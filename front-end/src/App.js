import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import BlogList from './components/BlogList';
import AddEventForm from './components/AddEventForm';
import CategoryFilter from './components/CategoryFilter';
import SearchBar from './components/SearchBar';
import CreateBlog from './components/CreateBlog';
import BlogPage from './components/BlogPage'; // Import the BlogPage component
import axios from 'axios';
import { Container, Button } from 'react-bootstrap';

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const categories = ['All', 'Finops 22', 'Finops 23', 'Finops 24'];
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateBlog, setShowCreateBlog] = useState(false); // State for controlling CreateBlog visibility

    // Fetch blogs based on selected category and search term
    const fetchBlogs = useCallback(async () => {
        try {
            let response;
            if (searchTerm) {
                response = await axios.post('http://localhost:3001/vector-search', { query: searchTerm });
            } else if (selectedCategory === 'All') {
                response = await axios.get('http://localhost:3001/blogs');
            } else {
                response = await axios.get(`http://localhost:3001/blogs/category/${encodeURIComponent(selectedCategory)}`);
            }
            setBlogs(response.data.blogs);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    }, [selectedCategory, searchTerm]);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    // Handle search form submit
    const handleSearch = (e) => {
        e.preventDefault();
        fetchBlogs();
    };

    // Toggle CreateBlog visibility
    const handleToggleCreateBlog = () => {
        setShowCreateBlog((prevShow) => !prevShow);
    };

    return (
        <Router>
            <div style={{ margin: 0, fontFamily: 'Arial, sans-serif', backgroundColor: '#f7f5f2' }}>
                <Navbar />
                <Routes>
                    {/* Home route with all components */}
                    <Route 
                        path="/" 
                        element={
                            <Container className="my-4">
                                <h1 style={{ textAlign: 'center', margin: '20px 0' }}>
                                    Every Finops Event, Podcast, Newsletter that you ever wanted to know, ALL in one place
                                </h1>
                                <SearchBar setSearchTerm={setSearchTerm} handleSearch={handleSearch} />
                                <CategoryFilter
                                    categories={categories}
                                    selectedCategory={selectedCategory}
                                    setSelectedCategory={setSelectedCategory}
                                />
                                <br /><br />
                                <BlogList blogs={blogs} />
                                <br /><br />
                                
                                {/* Button to toggle CreateBlog visibility */}
                                <Button 
                                    variant="primary" 
                                    onClick={handleToggleCreateBlog}
                                    style={{ marginBottom: '20px' }}
                                >
                                    {showCreateBlog ? 'Hide Create Blog' : 'Create Blog'}
                                </Button>
                                
                                {/* Conditionally render CreateBlog component */}
                                {showCreateBlog && <CreateBlog />}
                                <br /><br />
                                <AddEventForm className="mt-3" fetchBlogs={fetchBlogs} />
                            </Container>
                        } 
                    />
                    {/* Blog page route */}
                    <Route path="/blog/:id" element={<BlogPage />} /> {/* Route for individual blog pages */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
