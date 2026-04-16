# Prime Wave Executive Shades - Parking Shade eCommerce Platform

A modern, full-stack web application for selling premium parking shades and privacy solutions. Built with MERN stack (MongoDB, Express, React, Node.js).

## Features

### Home Page
- **Modern Hero Section**: Animated carousel with three moving photos
- **Product Showcase**: Beautiful grid layout displaying all available products
- **WhatsApp Contact Bubble**: Floating bubble on the bottom-right for direct WhatsApp communication
- **Responsive Design**: Fully responsive for mobile, tablet, and desktop

### Admin Dashboard
- **Product Management**: Add, edit, and delete products
- **Image Upload**: Upload product images with validation
- **Product Details**: Manage name, description, price, and category
- **Authentication**: Secure admin login with JWT tokens
- **Inventory Control**: Mark products as in stock or out of stock

### Backend
- **MongoDB Integration**: NoSQL database for product and admin data
- **RESTful API**: Complete API for product and admin operations
- **File Upload**: Image upload handling with multer
- **Authentication**: JWT-based authentication for admin routes
- **Password Security**: Bcrypt encryption for admin passwords

## Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI and JWT secret
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000` and backend on `http://localhost:5000`

## Initial Admin Setup

Create the first admin account:
```bash
curl -X POST http://localhost:5000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "your_password"
  }'
```

Then login at `http://localhost:3000/admin-login`

## Key Features

✨ **Beautiful UI**: Modern gradient design with smooth animations
📱 **Responsive**: Works perfectly on mobile, tablet, and desktop
🛍️ **Product Management**: Easy admin panel to manage products
🖼️ **Image Upload**: Upload product images with validation
💬 **WhatsApp Integration**: Direct contact button for inquiries
🔐 **Secure**: JWT authentication and bcrypt password hashing
💾 **MongoDB**: Scalable NoSQL database

## Customization

Update WhatsApp number in `frontend/src/components/WhatsAppBubble.js`:
```javascript
const phoneNumber = '971123456789'; // Your WhatsApp number
```

Update colors in any CSS file (currently using `#667eea` to `#764ba2`)

## Technology Stack

**Frontend**: React 18, React Router, Axios, React Slick, React Icons
**Backend**: Express.js, MongoDB, Mongoose, JWT, Bcryptjs, Multer
**Database**: MongoDB

## License
ISC
