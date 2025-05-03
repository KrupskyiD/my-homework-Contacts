const Contact = require('../models/Contact');
const storage = require('../models/Storage');

const contactController = {
    // Create a new contact
    createContact: (req, res) => {
        try {
            const { name, surname, bio, phoneNumber, email, address, categoryId } = req.body;
            
            // Validate category exists
            const category = storage.getCategoryById(categoryId);
            if (!category) {
                return res.status(400).json({ error: 'Category does not exist' });
            }

            const contact = new Contact(name, surname, bio, phoneNumber, email, address, categoryId);
            const validationErrors = contact.validate();
            
            if (validationErrors.length > 0) {
                return res.status(400).json({ errors: validationErrors });
            }

            const savedContact = storage.addContact(contact);
            res.status(201).json(savedContact);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get all contacts
    getContacts: (req, res) => {
        try {
            const contacts = storage.getContacts();
            res.json(contacts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get contact by ID
    getContactById: (req, res) => {
        try {
            const contact = storage.getContactById(req.params.id);
            if (!contact) {
                return res.status(404).json({ error: 'Contact not found' });
            }
            res.json(contact);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update contact
    updateContact: (req, res) => {
        try {
            const { name, surname, bio, phoneNumber, email, address, categoryId } = req.body;
            
            // Validate category exists if being updated
            if (categoryId) {
                const category = storage.getCategoryById(categoryId);
                if (!category) {
                    return res.status(400).json({ error: 'Category does not exist' });
                }
            }

            const contact = new Contact(name, surname, bio, phoneNumber, email, address, categoryId);
            const validationErrors = contact.validate();
            
            if (validationErrors.length > 0) {
                return res.status(400).json({ errors: validationErrors });
            }

            const updatedContact = storage.updateContact(req.params.id, {
                name,
                surname,
                bio,
                phoneNumber,
                email,
                address,
                categoryId
            });

            if (!updatedContact) {
                return res.status(404).json({ error: 'Contact not found' });
            }

            res.json(updatedContact);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete contact
    deleteContact: (req, res) => {
        try {
            const success = storage.deleteContact(req.params.id);
            if (!success) {
                return res.status(404).json({ error: 'Contact not found' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = contactController; 