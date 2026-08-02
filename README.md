# 📦 StockFlow – Smart Inventory Management System

StockFlow is a full-stack Inventory Management System designed to help manage products, monitor stock levels, record stock movements, and view inventory statistics through a simple and user-friendly dashboard.

The application provides a centralized system for managing product inventory and maintaining a history of stock transactions.

---

## ✨ Features

### 🔐 Authentication
- Admin login system
- Protected application routes
- Token-based authentication
- Secure access to inventory data

### 📊 Dashboard
- Total number of products
- Total available stock
- Total inventory value
- Low-stock product count
- Out-of-stock product count
- Recent stock transactions
- Low-stock alerts

### 📦 Product Management
- Add new products
- View all products
- Edit existing products
- Delete products
- Search products
- View product quantity and price
- Calculate current stock value

### 🔄 Stock Management
- Record Stock IN
- Record Stock OUT
- Automatically update product quantity
- Prevent stock from becoming negative
- Add notes to stock transactions
- Display current stock levels

### 📜 Transaction History
- Maintain inventory transaction records
- View Stock IN and Stock OUT transactions
- Display product name and quantity
- Store transaction notes
- Record transaction date and time

---

## 🛠️ Technologies Used

### Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- React Router

### Backend

- Node.js
- Express.js
- REST API

### Database

- MySQL

### Other Tools

- Git
- GitHub
- VS Code
- MySQL Workbench

---

## 🏗️ Project Structure

```text
Smart-Inventory-System/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── Sidebar.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Inventory.jsx
│   │   │   ├── History.jsx
│   │   │   └── Login.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── inventoryController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── user.js
│   │   ├── product.js
│   │   └── inventory.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── inventoryRoutes.js
│   │
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🗄️ Database

The application uses MySQL for storing application data.

Main tables include:

### Products

Stores information such as:

- Product name
- Category
- Quantity
- Price
- Creation date

### Inventory Transactions

Stores stock movement information such as:

- Product ID
- Transaction type (`IN` or `OUT`)
- Quantity
- Notes
- Transaction date

### Users

Stores information required for authentication.

---

## 🔌 API Endpoints

### Authentication

```text
POST /api/auth/login
```

### Products

```text
GET    /api/products
POST   /api/products
GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id
GET    /api/products/search?q=
```

### Inventory

```text
POST /api/inventory/in
POST /api/inventory/out
GET  /api/inventory/history
GET  /api/inventory/dashboard
GET  /api/inventory/recent
GET  /api/inventory/low-stock
```

---

## 🚀 Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/Priyanshu-kararwal/Smart-Inventory-System.git
```

Move into the project:

```bash
cd Smart-Inventory-System
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory and configure the required environment variables.

Example:

```env
PORT=5000

DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=smart_inventory

JWT_SECRET=your_secret_key
```

Start the backend:

```bash
node server.js
```

The backend will run on:

```text
http://localhost:5000
```

### 3. Install Frontend Dependencies

Open another terminal:

```bash
cd client
npm install
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

## 🔒 Environment Variables

Sensitive information such as database credentials and secret keys is stored using environment variables.

The `.env` file is excluded from Git using `.gitignore` and should never be committed to the repository.

---

## 🎯 Purpose of the Project

The purpose of StockFlow is to demonstrate the development of a complete full-stack inventory management application.

The project demonstrates:

- Frontend development using React
- Backend development using Node.js and Express
- REST API development
- MySQL database integration
- Authentication
- CRUD operations
- Stock management
- Frontend-backend integration
- Git and GitHub version control

---

## 🔮 Future Improvements

Possible future improvements include:

- Multiple user roles
- Supplier management
- Product images
- Barcode support
- Sales reports
- Inventory charts
- Export to CSV/PDF
- Email notifications for low stock
- Pagination and advanced filtering
- Cloud deployment

---

## 👨‍💻 Author

**Priyanshu**

B.Tech – Computer Science & Engineering

---

## 📄 License

This project is created for educational and portfolio purposes.
