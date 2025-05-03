import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

function FilterModal({ show, onHide, categories, onApplyFilters }) {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleApply = () => {
    onApplyFilters(selectedCategories);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Filter Contacts</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Select Categories</Form.Label>
            {categories.map(category => (
              <Form.Check
                key={category.id}
                type="checkbox"
                id={`category-${category.id}`}
                label={category.name}
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
              />
            ))}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleApply}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default FilterModal; 