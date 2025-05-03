import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import ContactList from './pages/ContactList';
import CategoryList from './pages/CategoryList';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function AppContent() {
  const location = useLocation();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const isContactPage = location.pathname === '/' || location.pathname === '/contacts';

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header onFilterClick={isContactPage ? () => setShowFilterModal(true) : undefined} />
      <Container fluid className="flex-grow-1 py-4">
        <Routes>
          <Route path="/" element={<ContactList showFilterModal={showFilterModal} setShowFilterModal={setShowFilterModal} />} />
          <Route path="/contacts" element={<ContactList showFilterModal={showFilterModal} setShowFilterModal={setShowFilterModal} />} />
          <Route path="/categories" element={<CategoryList />} />
        </Routes>
      </Container>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App; 
