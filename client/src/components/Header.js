import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Header({ onFilterClick }) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">Contact Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Button 
            variant="outline-light" 
            as={Link} 
            to="/contacts" 
            className="me-2"
          >
            Contacts
          </Button>
          <Button 
            variant="outline-light" 
            as={Link} 
            to="/categories"
            className="me-2"
          >
            Categories
          </Button>
          {onFilterClick && (
            <Button 
              variant="dark" 
              className="text-white"
              onClick={onFilterClick}
            >
              <i className="bi bi-funnel-fill me-1"></i>
              Filters
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header; 