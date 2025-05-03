class Storage {
    constructor() {
        this.contacts = [];
        this.categories = [];
    }

    // Contact methods
    addContact(contact) {
        this.contacts.push(contact);
        return contact;
    }

    getContacts() {
        return this.contacts;
    }

    getContactById(id) {
        return this.contacts.find(contact => contact.id === id);
    }

    updateContact(id, updatedContact) {
        const index = this.contacts.findIndex(contact => contact.id === id);
        if (index !== -1) {
            this.contacts[index] = { ...this.contacts[index], ...updatedContact };
            return this.contacts[index];
        }
        return null;
    }

    deleteContact(id) {
        const index = this.contacts.findIndex(contact => contact.id === id);
        if (index !== -1) {
            this.contacts.splice(index, 1);
            return true;
        }
        return false;
    }

    getContactsByCategory(categoryId) {
        return this.contacts.filter(contact => contact.categoryId === categoryId);
    }

    // Category methods
    addCategory(category) {
        this.categories.push(category);
        return category;
    }

    getCategories() {
        return this.categories;
    }

    getCategoryById(id) {
        return this.categories.find(category => category.id === id);
    }

    updateCategory(id, updatedCategory) {
        const index = this.categories.findIndex(category => category.id === id);
        if (index !== -1) {
            this.categories[index] = { ...this.categories[index], ...updatedCategory };
            return this.categories[index];
        }
        return null;
    }

    deleteCategory(id) {
        const contactsWithCategory = this.getContactsByCategory(id);
        if (contactsWithCategory.length > 0) {
            throw new Error('Cannot delete category with associated contacts');
        }
        
        const index = this.categories.findIndex(category => category.id === id);
        if (index !== -1) {
            this.categories.splice(index, 1);
            return true;
        }
        return false;
    }

    isCategoryNameUnique(name, excludeId = null) {
        return !this.categories.some(
            category => category.name === name && category.id !== excludeId
        );
    }
}

module.exports = new Storage(); 