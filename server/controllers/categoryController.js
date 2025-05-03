const Category = require('../models/Category');
const storage = require('../models/Storage');

const categoryController = {
    // Create a new category
    createCategory: (req, res) => {
        try {
            const { name } = req.body;
            
            // Check if category name is unique
            if (!storage.isCategoryNameUnique(name)) {
                return res.status(400).json({ error: 'Category name must be unique' });
            }

            const category = new Category(name);
            const validationErrors = category.validate();
            
            if (validationErrors.length > 0) {
                return res.status(400).json({ errors: validationErrors });
            }

            const savedCategory = storage.addCategory(category);
            res.status(201).json(savedCategory);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get all categories
    getCategories: (req, res) => {
        try {
            const categories = storage.getCategories();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update category
    updateCategory: (req, res) => {
        try {
            const { name } = req.body;
            
            // Check if category name is unique (excluding current category)
            if (!storage.isCategoryNameUnique(name, req.params.id)) {
                return res.status(400).json({ error: 'Category name must be unique' });
            }

            const category = new Category(name);
            const validationErrors = category.validate();
            
            if (validationErrors.length > 0) {
                return res.status(400).json({ errors: validationErrors });
            }

            const updatedCategory = storage.updateCategory(req.params.id, { name });
            if (!updatedCategory) {
                return res.status(404).json({ error: 'Category not found' });
            }

            res.json(updatedCategory);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete category
    deleteCategory: (req, res) => {
        try {
            const success = storage.deleteCategory(req.params.id);
            if (!success) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.status(204).send();
        } catch (error) {
            if (error.message === 'Cannot delete category with associated contacts') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = categoryController; 