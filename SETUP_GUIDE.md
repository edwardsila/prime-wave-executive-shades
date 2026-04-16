# 🚀 Quick Start Guide for Prime Wave Executive Shades

## Overview
This is a complete MERN stack e-commerce platform for selling parking shades. It includes:
- 🏠 Beautiful homepage with animated hero section
- 📦 Product showcase grid
- 💬 WhatsApp floating contact button
- 🔐 Admin dashboard with product management
- 💾 MongoDB database integration

## System Requirements
- Node.js v14 or higher
- MongoDB (local or cloud - MongoDB Atlas)
- npm or yarn
- Git (optional)

## Step 1: Setup MongoDB

### Option A: Local MongoDB
If you have MongoDB installed locally, ensure it's running:
```bash
mongod
```

### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/database`)

## Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and update with your values
MONGODB_URI=mongodb://localhost:27017/prime-wave-shades  # or your Atlas URI
JWT_SECRET=your_very_secure_secret_key_here
PORT=5000
NODE_ENV=development
```

## Step 3: Create Admin Account

Make sure backend server is NOT running yet. In a terminal, run:

```bash
curl -X POST http://localhost:5000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "SecurePassword123!"
  }'
```

Or use Postman/Insomnia:
- URL: `POST http://localhost:5000/api/admin/register`
- Body (JSON):
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "SecurePassword123!"
}
```

## Step 4: Start Backend Server

```bash
cd backend
npm run dev
```

You should see: `Server running on port 5000`

## Step 5: Setup Frontend

In a NEW terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will open at `http://localhost:3000`

## Step 6: Login to Admin Dashboard

1. Go to `http://localhost:3000/admin-login`
2. Enter credentials you created in Step 3:
   - Username: `admin`
   - Password: `SecurePassword123!`

## Step 7: Add Your First Product

1. Click "Add New Product"
2. Fill in:
   - Product Name: e.g., "Premium Parking Shade"
   - Price: e.g., 1500
   - Description: e.g., "High-quality parking shade with UV protection"
   - Category: "Parking Shade"
   - Image: Upload a photo
3. Click "Add Product"

## Step 8: View Products on Homepage

1. Go to `http://localhost:3000`
2. Your products should appear in the grid below the hero section

## Customization

### Update WhatsApp Number
Edit `frontend/src/components/WhatsAppBubble.js`:
```javascript
const phoneNumber = '971123456789'; // Change to your WhatsApp number
```

### Update Hero Images
Edit `frontend/src/components/HeroSection.js` and replace the placeholder image URLs with your own parking shade images.

### Change Brand Colors
Search for these color codes in CSS files and replace:
- `#667eea` (purple/blue)
- `#764ba2` (darker purple)

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use:

Backend (change port in .env):
```
PORT=5001
```

Frontend (set environment variable):
```bash
PORT=3001 npm start
```

### MongoDB Connection Error
- Check if MongoDB is running
- Verify connection string in .env
- For Atlas: Ensure IP is whitelisted in Network Access

### Images Not Uploading
- Check `backend/uploads/` folder exists
- Verify file size is under 10MB
- Ensure file is JPG, PNG, GIF, or JPEG

### CORS Errors
- Backend should have CORS enabled (it does by default)
- Frontend proxy in `package.json` should match backend URL

## Project Structure Quick Reference

```
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & file upload
│   ├── server.js        # Main server file
│   └── .env            # Configuration
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── styles/      # CSS files
│   └── package.json
└── README.md
```

## Common Tasks

### Add More Products
Login → Admin Dashboard → "Add New Product" → Fill form → Upload image

### Edit a Product
Admin Dashboard → Find product in table → "Edit" button

### Delete a Product
Admin Dashboard → Find product in table → "Delete" button

### Change Admin Password
Currently, you need to update directly in MongoDB. Consider adding this feature in the future.

## API Endpoints (for reference)

**Public:**
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

**Admin (requires JWT token):**
- `POST /api/admin/login` - Admin login
- `POST /api/admin/products` - Add product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/products` - Get all products

## Next Steps for Production

1. **Domain & Hosting**
   - Backend: Heroku, Railway, or AWS
   - Frontend: Vercel, Netlify, or GitHub Pages

2. **SSL Certificate**
   - Get from Let's Encrypt (free) or another provider

3. **Email Notifications**
   - Add nodemailer for order confirmations

4. **Payment Gateway**
   - Integrate Stripe, PayPal, or local payment methods

5. **SEO Optimization**
   - Add meta tags, sitemap, robots.txt

6. **Analytics**
   - Add Google Analytics

## Support

For issues, check:
1. Backend logs in terminal
2. Browser console (F12) for frontend errors
3. MongoDB connection in .env
4. Node.js version (`node --version`)

Happy building! 🎉
