# 🎯 Quick Reference Guide

## 🚀 Start the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Runs on: `http://localhost:5000`

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```
Runs on: `http://localhost:3000`

---

## 🔐 Admin Login

**URL**: `http://localhost:3000/admin-login`

**Default Credentials**:
- Username: `admin`
- Password: `your_password` (set during first setup)

---

## 📦 Admin Dashboard Tasks

### Add Product
1. Click "Add New Product"
2. Fill in all fields
3. Upload image
4. Click "Add Product"

### Edit Product
1. Find product in table
2. Click "Edit" button
3. Update fields
4. Click "Update Product"

### Delete Product
1. Find product in table
2. Click "Delete" button
3. Confirm deletion

---

## 🌐 Important URLs

| Purpose | URL |
|---------|-----|
| Home Page | `http://localhost:3000` |
| Admin Login | `http://localhost:3000/admin-login` |
| Admin Dashboard | `http://localhost:3000/admin` |
| API Base | `http://localhost:5000/api` |
| Mongo Express | `http://localhost:8081` |

---

## 📝 Configuration Files

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/prime-wave-shades
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

### Frontend Proxy (package.json)
```json
"proxy": "http://localhost:5000"
```

---

## 🔄 Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev          # backend
npm start            # frontend

# Create admin account (one-time)
curl -X POST http://localhost:5000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"pass123"}'

# Stop servers
Ctrl + C

# Clear cache
rm -rf node_modules
npm install
```

---

## 🎨 Customization Quick Edits

### Change WhatsApp Number
**File**: `frontend/src/components/WhatsAppBubble.js`
```javascript
const phoneNumber = '971123456789'; // ← Change this
```

### Change Primary Color
**Search & Replace** in all CSS files:
- Find: `#667eea`
- Replace: `#your_color`

### Change Secondary Color
**Search & Replace** in all CSS files:
- Find: `#764ba2`
- Replace: `#your_color`

### Change Hero Images
**File**: `frontend/src/components/HeroSection.js`
```javascript
const heroImages = [
  'your_image_url_1',
  'your_image_url_2',
  'your_image_url_3',
];
```

---

## 🐛 Troubleshooting

| Error | Solution |
|-------|----------|
| Port 5000 already in use | Change PORT in `.env` |
| MongoDB connection failed | Check `.env` URI and mongod running |
| Images not uploading | Check `backend/uploads/` folder exists |
| Admin login fails | Verify credentials match database |
| CORS error | Check proxy in `frontend/package.json` |

---

## 📚 Key File Locations

```
Models          → backend/models/
Routes/API      → backend/routes/
Components      → frontend/src/components/
Pages           → frontend/src/pages/
Styles          → frontend/src/styles/
Database Config → backend/.env
```

---

## 🔌 API Quick Reference

```bash
# Get all products
curl http://localhost:5000/api/products

# Login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Add product (replace TOKEN with JWT)
curl -X POST http://localhost:5000/api/admin/products \
  -H "Authorization: Bearer TOKEN" \
  -F "name=Product Name" \
  -F "description=Description" \
  -F "price=1000" \
  -F "image=@image.jpg"
```

---

## 💡 Pro Tips

1. **Use Mongo Express** (localhost:8081) to view database
2. **Use Postman** to test API endpoints
3. **Use React DevTools** browser extension for debugging
4. **Keep `.env` files in .gitignore** for security
5. **Test locally** before deploying
6. **Backup database** regularly
7. **Update hero images** with real parking shade photos

---

## 📱 Feature Checklist

- ✅ Home page with hero section
- ✅ Product grid with listings
- ✅ WhatsApp contact button
- ✅ Admin login system
- ✅ Add products
- ✅ Edit products
- ✅ Delete products
- ✅ Image uploads
- ✅ Responsive design
- ✅ MongoDB database

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com/manual)
- [JWT Auth](https://jwt.io)
- [REST API Best Practices](https://restfulapi.net)

---

## 📞 When Something Goes Wrong

1. Check backend terminal for error messages
2. Open browser console (F12) for frontend errors
3. Verify MongoDB is running
4. Check `.env` file configuration
5. Restart both servers
6. Clear browser cache
7. Check database connection

---

**Last Updated**: April 2026
**Version**: 1.0.0
