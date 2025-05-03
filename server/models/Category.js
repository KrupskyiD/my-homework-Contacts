class Category {
    constructor(name) {
        this.id = Date.now().toString();
        this.name = name;
    }

    validate() {
        const errors = [];
        
        if (!this.name || this.name.length > 100) {
            errors.push('Name is required and must be less than 100 characters');
        }
        
        return errors;
    }
}

module.exports = Category; 