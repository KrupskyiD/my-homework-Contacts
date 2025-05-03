import React, { useState, useEffect } from 'react';
import { Container, Button, Spinner, Accordion, Row, Col } from 'react-bootstrap';
import ContactForm from '../components/ContactForm';
import ConfirmationModal from '../components/ConfirmationModal';
import FilterModal from '../components/FilterModal';
import contactService from '../services/contactService';
import categoryService from '../services/categoryService';

function ContactList({ showFilterModal, setShowFilterModal }) {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact => 
        selectedCategories.includes(contact.categoryId)
      );
      setFilteredContacts(filtered);
    }
  }, [contacts, selectedCategories]);

  const fetchData = async () => {
    try {
      const [contactsData, categoriesData] = await Promise.all([
        contactService.getAllContacts(),
        categoryService.getAllCategories()
      ]);
      setContacts(contactsData);
      setFilteredContacts(contactsData);
      setCategories(categoriesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleDeleteClick = async (contact) => {
    try {
      await contactService.deleteContact(contact.id);
      setContacts(contacts.filter(c => c.id !== contact.id));
    } catch (error) {
      console.error('Error deleting contact:', error);
      setContactToDelete(contact);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await contactService.deleteContact(contactToDelete.id);
      setContacts(contacts.filter(contact => contact.id !== contactToDelete.id));
    } catch (error) {
      console.error('Error deleting contact:', error);
    } finally {
      setShowDeleteModal(false);
      setContactToDelete(null);
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingContact(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingContact) {
        const updatedContact = await contactService.updateContact(editingContact.id, formData);
        setContacts(contacts.map(contact => 
          contact.id === editingContact.id ? updatedContact : contact
        ));
      } else {
        const newContact = await contactService.createContact(formData);
        setContacts([...contacts, newContact]);
      }
      setShowForm(false);
      setEditingContact(null);
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleApplyFilters = (selectedCategoryIds) => {
    setSelectedCategories(selectedCategoryIds);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" style={{ color: '#030b15' }} />
      </div>
    );
  }

  return (
    <>
      <Container className="py-4 mt-4 mt-md-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Contact List</h1>
          <Button variant="primary" onClick={handleAddNew}>
            Add New Contact
          </Button>
        </div>

        <Accordion>
          {filteredContacts.map((contact, index) => (
            <Accordion.Item key={contact.id} eventKey={index.toString()}>
              <Accordion.Header>
                <div className="d-flex justify-content-between align-items-center w-100 pe-3">
                  <span>{contact.name} {contact.surname}</span>
                  <div className="d-flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(contact);
                      }}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(contact);
                      }}
                    >
                      <i className="bi bi-x"></i>
                    </Button>
                  </div>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <div className="contact-details">
                  <div className="mb-3">
                    <h6 className="text-muted">Bio</h6>
                    <p>{contact.bio}</p>
                  </div>
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <h6 className="text-muted">Email</h6>
                        <p>{contact.email}</p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <h6 className="text-muted">Phone</h6>
                        <p>{contact.phoneNumber}</p>
                      </div>
                    </Col>
                  </Row>
                  <div className="mb-3">
                    <h6 className="text-muted">Address</h6>
                    <p>{contact.address || 'No address provided'}</p>
                  </div>
                  <div className="mb-3">
                    <h6 className="text-muted">Category</h6>
                    <p>{categories.find(cat => cat.id === contact.categoryId)?.name || 'Uncategorized'}</p>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>

        <ContactForm
          show={showForm}
          onHide={() => {
            setShowForm(false);
            setEditingContact(null);
          }}
          onSubmit={handleFormSubmit}
          categories={categories}
          initialData={editingContact}
        />

        <ConfirmationModal
          show={showDeleteModal}
          onHide={() => {
            setShowDeleteModal(false);
            setContactToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Contact"
          message="Are you sure you want to delete this contact?"
        />

        <FilterModal
          show={showFilterModal}
          onHide={() => setShowFilterModal(false)}
          categories={categories}
          onApplyFilters={handleApplyFilters}
        />
      </Container>
    </>
  );
}

export default ContactList; 