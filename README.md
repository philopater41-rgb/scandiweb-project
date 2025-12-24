# Scandiweb Junior Fullstack Developer Assignment

Welcome to my repository for Scandiweb's Junior Fullstack Developer Test Assignment.

- Live Demo: [TBD]()
- Task Details: [Scandiweb Notion](https://scandiweb.notion.site/Junior-Full-Stack-Developer-test-task-3833494124714845b71bf46096b6eeb9)

## Table of Contents

- [Scandiweb Junior Fullstack Developer Assignment](#scandiweb-junior-fullstack-developer-assignment)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Prerequisites](#prerequisites)
  - [Installation and Setup](#installation-and-setup)
  - [Technologies](#technologies)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Utilities](#utilities)

## Overview

This application is a straightforward eCommerce platform that enables product browsing and cart management. It consists of two primary pages:

1. **Product Listing Pages (PLP)**
   - Displays products within a chosen category.
   - Serves as the homepage, automatically showing the first category when the site loads.

2. **Product Details Page (PDP)**
   - Provides in-depth information about a selected product, including images and descriptions.
   - Allows users to customize product options before adding them to the cart.
   - Includes an "Add to Cart" button for a smooth shopping experience.

## Prerequisites

Before you begin, ensure you have the following software installed on your system to run the project successfully:

- PHP.
- MySQL.
- Composer.
- Node.js & npm.

## Installation and Setup

1. **Clone the repository to your local machine:**
   - Clone the repository:

   ```bash
   git clone https://github.com/philopater41-rgb/scandiweb-project.git

   ```

   - Navigate to the project directory:

   ```bash
   cd Scandiweb-Junior-Assignment
   ```

2. **Run the Backend:**
   - Install backend dependencies:

   ```bash
   composer install
   ```

   - Update the database configurations in the .env file.

   - Set Up the Database:
     - Ensure that you have MySQL installed and **running**.
     - This command will create the necessary database and tables (or, destroy it and re-create it).
     - If the setup succeed, you'll get a message like this `✅ Database and tables created successfully.`

   ```bash
   composer set-database
   ```

   - Start the PHP built-in server with No Timeout:

   ```bash
   composer run-script start --timeout=0
   ```

3. **Run the Frontend:**
   - Navigate to the frontend directory:

   ```bash
   cd client
   ```

   - Install frontend dependencies:

   ```bash
   npm install
   ```

   - Start the development server to preview the frontend:

   ```bash
   npm run dev
   ```

## Technologies

### Frontend

[![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Apollo Client](https://img.shields.io/badge/-Apollo%20Client-311C87?logo=apollographql&logoColor=white)](https://www.apollographql.com/)
[![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

### Backend

[![PHP](https://img.shields.io/badge/-PHP-777BB4?logo=php&logoColor=white)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/-MySQL-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![GraphQL](https://img.shields.io/badge/-GraphQL-E10098?logo=graphql&logoColor=white)](https://graphql.org/)

### Utilities

[![Composer](https://img.shields.io/badge/-Composer-885630?logo=composer&logoColor=white)](https://getcomposer.org/)
[![phpdotenv](https://img.shields.io/badge/-phpdotenv-4F5B93?logo=php&logoColor=white)](https://github.com/vlucas/phpdotenv)
[![react-toastify](https://img.shields.io/badge/-React%20Toastify-ff9800?logo=react&logoColor=white)](https://github.com/fkhadra/react-toastify)
[![dompurify](https://img.shields.io/badge/-DOMPurify-2D2D2D?logo=javascript&logoColor=white)](https://github.com/cure53/DOMPurify)
[![html-react-parser](https://img.shields.io/badge/-html--react--parser-FF4088?logo=react&logoColor=white)](https://github.com/remarkablemark/html-react-parser)

<!-- ## Project Structure

The project structure is designed to maintain clarity and organization. Here's a brief overview of the key directories:

- **client/**: This directory houses the ReactJS frontend, where the user interface is developed and managed. All frontend-related assets and components are neatly organized within this section.

  - **assets/**: Contains static assets like styles and images, ensuring that all visual elements are easily accessible and well-organized.

  - **components/**: Contains reusable React components that form the building blocks of the user interface. These components are designed to be modular and reusable across different parts of the application.

  - **pages/**: Houses different page components that represent various views of the application (e.g., product listing, product details).

  - **graphql/**: Manages the Apollo Client setup for handling GraphQL queries and mutations. This includes configuration files and query/mutation definitions to interact with the backend efficiently.

  - **DataContext.jsx**: Defines the data context for the application. This context is used to share data and state across different components without prop drilling, making state management more efficient.

  - **router.jsx**: Contains the app routes and routing logic. This file defines how different URLs map to specific components, enabling smooth navigation throughout the application.

- **src/**: Houses the PHP backend code, containing the essential server-side logic that powers the application. It's further structured for improved organization:

  - **config/**: Contains configuration files that return the configuration settings necessary for the application.

  - **GraphQL/**: Manages the GraphQL setup.

  - **Models/**: Contains the models associated with the application. These models represent the underlying data structures and business logic.

  - **Database.php**: Class responsible for managing the database connection, providing methods to connect and interact with the database.

  - **helpers.php**: A file for simple helper functions.

- **public/**: Serves as the hosting location for index.php and the compiled front end, ensuring accessibility for users.

- **.env.example**: Example environment configuration file. Copy this to `.env` and update with your specific configuration settings.

- **schema.sql**: SQL script for setting up the database schema. It includes the necessary table definitions and relations required by the application.

## Learnings

- DOMPurify package used to sanitize HTML content of product description and prevent XSS attacks.
- html-react-parser package used to parse the sanitized HTML content into React elements. It takes raw HTML content as input and outputs React elements that can be rendered within a React component.

### Importance of Sanitizing HTML Content:

(Credits: [HTML React Parser Issue #94](https://github.com/remarkablemark/html-react-parser/issues/94#issuecomment-472423965))

```javascript
// Example HTML content susceptible to XSS attacks
const html = 'hey<iframe src=javascript:alert("xss")></iframe>';

// Parse HTML content without sanitization (unsafe)
const element = parse(html);

// Parse sanitized HTML content using DOMPurify
const element = parse(DOMPurify.sanitize(html));

// Render parsed React elements: {element}
``` -->
