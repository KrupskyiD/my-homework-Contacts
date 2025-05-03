import React, { useState, useEffect } from 'react';
import { Container, Button, Spinner, ListGroup, Modal, Form } from 'react-bootstrap';
import categoryService from '../services/categoryService';
import ConfirmationModal from '../components/ConfirmationModal';
import WarningModal from '../components/WarningModal';

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [errors, setErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showWarningModal, setShowWarningModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await categoryService.getAllCategories();
      setCategories(categoriesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.length > 100) {
      newErrors.name = 'Name is required and must be less than 100 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingCategory) {
        const updatedCategory = await categoryService.updateCategory(editingCategory.id, formData);
        setCategories(categories.map(category => 
          category.id === editingCategory.id ? updatedCategory : category
        ));
      } else {
        const newCategory = await categoryService.createCategory(formData);
        setCategories([...categories, newCategory]);
      }
      setShowForm(false);
      setEditingCategory(null);
      setFormData({ name: '' });
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDeleteClick = async (category) => {
    try {
      await categoryService.deleteCategory(category.id);
      setCategories(categories.filter(c => c.id !== category.id));
    } catch (error) {
      console.error('Error deleting category:', error);
      if (error.response?.data?.error === 'Cannot delete category with associated contacts') {
        setShowWarningModal(true);
      } else {
        setCategoryToDelete(category);
        setShowDeleteModal(true);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await categoryService.deleteCategory(categoryToDelete.id);
      setCategories(categories.filter(category => category.id !== categoryToDelete.id));
    } catch (error) {
      console.error('Error deleting category:', error);
    } finally {
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" style={{ color: '#030b15' }} />
      </div>
    );
  }

  return (
    <Container className="py-4 mt-4 mt-md-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Category List</h1>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          Add New Category
        </Button>
      </div>

      <ListGroup>
        {categories.map((category) => (
          <ListGroup.Item key={category.id} className="d-flex justify-content-between align-items-center">
            <span>{category.name}</span>
            <div className="d-flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleEdit(category)}
              >
                <i className="bi bi-pencil"></i>
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteClick(category)}
              >
                <i className="bi bi-x"></i>
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Modal show={showForm} onHide={() => {
        setShowForm(false);
        setEditingCategory(null);
        setFormData({ name: '' });
      }}>
        <Modal.Header closeButton>
          <Modal.Title>{editingCategory ? 'Edit Category' : 'Add New Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingCategory(null);
                  setFormData({ name: '' });
                }}
                className="me-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingCategory ? 'Save Changes' : 'Create'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
      />

      <WarningModal
        show={showWarningModal}
        onHide={() => setShowWarningModal(false)}
        title="Warning"
        message="You cannot delete this category because it has associated contacts."
      />
    </Container>
  );
}

export default CategoryList; 