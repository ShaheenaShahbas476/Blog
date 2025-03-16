import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button } from 'react-bootstrap';
import Login from './Login';
import Register from './Register';
import './Navbar.css'; 

function NavBar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginSuccess = () => {
    setShowLogin(false);
    // Additional logic on successful login, if needed
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
    // Additional logic on successful registration, if needed
  };

  return (
    <Navbar expand="lg" className="bg-white shadow-sm">
      <Container fluid>
        <Navbar.Brand href="#" className="text-dark fs-4 ps-4">AllFinOps</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className="justify-content-end">
          <Nav>
            <Nav.Link href="#Home" className="text-dark">Home</Nav.Link>
            <Nav.Link href="#About" className="text-dark">About</Nav.Link>
            <Nav.Link href="#Contact-us" className="text-dark">Contact Us</Nav.Link>
            <Button onClick={() => setShowLogin(true)} className="me-2">Login</Button>
            <Button onClick={() => setShowRegister(true)}>Register</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* Conditionally render the Login and Register components */}
      {showLogin && (
        <Login onLoginSuccess={handleLoginSuccess} onClose={() => setShowLogin(false)} />
      )}
      {showRegister && (
        <Register onRegisterSuccess={handleRegisterSuccess} onClose={() => setShowRegister(false)} />
      )}
    </Navbar>
  );
}

export default NavBar;
