import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import categoryService from '../services/categoryService';

function ContactForm({ show, onHide, onSubmit, categories: initialCategories, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    address: '',
    bio: '',
    categoryId: ''
  });
  const [errors, setErrors] = useState({});
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categories, setCategories] = useState(initialCategories);

  // Update categories when initialCategories prop changes
  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  // Initialize form data and reset errors when show or initialData changes
  useEffect(() => {
    if (show) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          surname: initialData.surname || '',
          email: initialData.email || '',
          phoneNumber: initialData.phoneNumber || '',
          address: initialData.address || '',
          bio: initialData.bio || '',
          categoryId: initialData.categoryId || ''
        });
      } else {
        setFormData({
          name: '',
          surname: '',
          email: '',
          phoneNumber: '',
          address: '',
          bio: '',
          categoryId: ''
        });
      }
      // Reset errors when form is shown or contact is changed
      setErrors({});
    }
  }, [show, initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.length > 100) {
      newErrors.name = 'Name is required and must be less than 100 characters';
    }
    
    if (!formData.surname || formData.surname.length > 100) {
      newErrors.surname = 'Surname is required and must be less than 100 characters';
    }
    
    if (!formData.bio || formData.bio.length > 250) {
      newErrors.bio = 'Bio is required and must be less than 250 characters';
    }
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else {
      const phoneRegex = /^\+?\d{10,15}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Phone number must contain only digits and optionally start with \'+\'. Length must be between 10 and 15 characters.';
      }
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (typeof formData.email !== 'string') {
      newErrors.email = 'Email must be a valid string in the format name@example.com.';
    } else {
      const [localPart, domainPart] = formData.email.split('@');
      
      // Check if email has both parts
      if (!localPart || !domainPart) {
        newErrors.email = 'Email must be a valid string in the format name@example.com.';
      } else {
        // Check both parts for ASCII-only characters
        const asciiOnlyRegex = /^[\x00-\x7F]+$/;
        if (!asciiOnlyRegex.test(localPart) || !asciiOnlyRegex.test(domainPart)) {
          newErrors.email = 'Email must contain only English alphabet letters before and after "@"';
        } else {
          // Then validate the email format
          const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Email must be a valid string in the format name@example.com.';
          }
        }
      }
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Always validate the form before submission
    if (!validateForm()) {
      // If validation fails, the errors are already set by validateForm()
      // and will be displayed in the form
      return;
    }

    // Only call onSubmit if validation passes
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for the field being changed
    setErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const newCategory = await categoryService.createCategory({ name: newCategoryName });
      // Update local categories state with the new category
      setCategories(prevCategories => [...prevCategories, newCategory]);
      // Set the new category as selected
      setFormData(prev => ({ ...prev, categoryId: newCategory.id }));
      setShowCategoryModal(false);
      setNewCategoryName('');
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  // Reset form and errors when modal is closed
  useEffect(() => {
    if (!show) {
      setFormData({
        name: '',
        surname: '',
        email: '',
        phoneNumber: '',
        address: '',
        bio: '',
        categoryId: ''
      });
      setErrors({});
    }
  }, [show]);

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{initialData ? 'Edit Contact' : 'Add New Contact'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Surname</Form.Label>
              <Form.Control
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                isInvalid={!!errors.surname}
              />
              <Form.Control.Feedback type="invalid">
                {errors.surname}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                isInvalid={!!errors.phoneNumber}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phoneNumber}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                isInvalid={!!errors.bio}
              />
              <Form.Control.Feedback type="invalid">
                {errors.bio}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <div className="d-flex">
                <Form.Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  isInvalid={!!errors.categoryId}
                  className="me-2"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
                <Button variant="outline-primary" onClick={() => setShowCategoryModal(true)}>
                  Add New
                </Button>
              </div>
              <Form.Control.Feedback type="invalid">
                {errors.categoryId}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={onHide} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {initialData ? 'Save Changes' : 'Create'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddCategory}>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={() => setShowCategoryModal(false)} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ContactForm; 