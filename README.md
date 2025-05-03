# Contact Management Application

A full-stack contact management application built with React and Node.js/Express.

## Features

- Full CRUD operations for contacts and categories
- Responsive design with Bootstrap
- Form validation
- Category-based contact filtering
- Offline data persistence using localStorage
- Loading animations
- Mobile-friendly interface

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Project Structure

```
project-root/
├── server/              # Backend
│   ├── controllers/     # Route controllers
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── app.js           # Express server
│   └── package.json     # Backend dependencies
├── client/              # Frontend
│   ├── public/          # Static files
│   ├── src/             # React source
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   └── App.js       # Main component
│   └── package.json     # Frontend dependencies
└── README.md            # This file
```

## Setup and Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd contact-management-app
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Install frontend dependencies:
```bash
cd ../client
npm install
```

## Running the Application

1. Start the backend server:
```bash
cd server
npm start
```

2. Start the frontend development server:
```bash
cd client
npm start
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

### Contacts
- `POST /api/contacts` - Create a new contact
- `GET /api/contacts` - Get all contacts
- `GET /api/contacts/:id` - Get a specific contact
- `PUT /api/contacts/:id` - Update a contact
- `DELETE /api/contacts/:id` - Delete a contact

### Categories
- `POST /api/categories` - Create a new category
- `GET /api/categories` - Get all categories
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

## Technologies Used

- Frontend:
  - React
  - React Router
  - Bootstrap
  - Axios
  - React Bootstrap

- Backend:
  - Node.js
  - Express
  - CORS
  - Express Validator

## License

This project is licensed under the MIT License. 