class Contact {
    constructor(name, surname, bio, phoneNumber, email, address, categoryId) {
        this.id = Date.now().toString();
        this.name = name;
        this.surname = surname;
        this.bio = bio;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.address = address || '';
        this.date = new Date();
        this.categoryId = categoryId;
    }

    validate() {
        const errors = [];
        
        if (!this.name || this.name.length > 100) {
            errors.push('Name is required and must be less than 100 characters');
        }
        
        if (!this.surname || this.surname.length > 100) {
            errors.push('Surname is required and must be less than 100 characters');
        }
        
        if (!this.bio || this.bio.length > 250) {
            errors.push('Bio is required and must be less than 250 characters');
        }
        
        if (!this.phoneNumber) {
            errors.push('Phone number is required');
        } else if (!this.isValidPhoneNumber(this.phoneNumber)) {
            errors.push('Phone number must contain only digits and optionally start with \'+\'. Length must be between 10 and 15 characters.');
        }
        
        if (!this.email) {
            errors.push('Email is required');
        } else if (typeof this.email !== 'string') {
            errors.push('Email must be a valid string in the format name@example.com.');
        } else if (!this.isValidEmail(this.email)) {
            errors.push('Email must contain only English alphabet letters before and after "@"');
        }
        
        if (!this.categoryId) {
            errors.push('Category ID is required');
        }
        
        return errors;
    }

    isValidEmail(email) {
        const [localPart, domainPart] = email.split('@');
        
        // Check if email has both parts
        if (!localPart || !domainPart) {
            return false;
        }
        
        // Check both parts for ASCII-only characters
        const asciiOnlyRegex = /^[\x00-\x7F]+$/;
        if (!asciiOnlyRegex.test(localPart) || !asciiOnlyRegex.test(domainPart)) {
            return false;
        }
        
        // Then validate the email format
        const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    isValidPhoneNumber(phoneNumber) {
        const phoneRegex = /^\+?\d{10,15}$/;
        return phoneRegex.test(phoneNumber);
    }
}

module.exports = Contact; 