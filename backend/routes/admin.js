const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Product = require('../models/Product');
const Project = require('../models/Project');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Signup (First time setup - comment out after first admin creation)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const admin = new Admin({ username, email, password });
    await admin.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add Product (Protected)
router.post('/products', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, description, category } = req.body;

    if (!name || !description || !req.file) {
      return res.status(400).json({ message: 'Name, description, and image are required' });
    }

    const product = new Product({
      name,
      description,
      category: category || 'Parking Shade',
      image: `/uploads/${req.file.filename}`,
    });

    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Product (Protected)
router.put('/products/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, description, category, inStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete old image if new one is uploaded
    if (req.file) {
      const oldImagePath = path.join(__dirname, '..', product.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      product.image = `/uploads/${req.file.filename}`;
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (inStock !== undefined) product.inStock = inStock;

    product.updatedAt = Date.now();
    await product.save();

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Product (Protected)
router.delete('/products/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete image file
    const imagePath = path.join(__dirname, '..', product.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products (Admin view)
router.get('/products', authMiddleware, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========== PROJECT MANAGEMENT ROUTES ==========

// Create Project
router.post('/projects', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, location, completionDate, featured } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Project image is required' });
    }

    const projectData = {
      title,
      description,
      image: req.file.filename,
      location: location || '',
      completionDate: completionDate || new Date(),
      featured: featured === 'true' || featured === true,
    };

    const project = new Project(projectData);
    await project.save();

    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    if (req.file) {
      fs.unlink(path.join(__dirname, '../public/uploads', req.file.filename), () => {});
    }
    res.status(500).json({ message: error.message });
  }
});

// Update Project
router.put('/projects/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, location, completionDate, featured } = req.body;
    const projectId = req.params.id;

    const project = await Project.findById(projectId);
    if (!project) {
      if (req.file) {
        fs.unlink(path.join(__dirname, '../public/uploads', req.file.filename), () => {});
      }
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update text fields
    if (title) project.title = title;
    if (description) project.description = description;
    if (location !== undefined) project.location = location;
    if (completionDate) project.completionDate = completionDate;
    if (featured !== undefined) project.featured = featured === 'true' || featured === true;

    // Update image if new one provided
    if (req.file) {
      // Delete old image
      if (project.image) {
        fs.unlink(path.join(__dirname, '../public/uploads', project.image), () => {});
      }
      project.image = req.file.filename;
    }

    await project.save();

    res.json({ message: 'Project updated successfully', project });
  } catch (error) {
    if (req.file) {
      fs.unlink(path.join(__dirname, '../public/uploads', req.file.filename), () => {});
    }
    res.status(500).json({ message: error.message });
  }
});

// Delete Project
router.delete('/projects/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete image file
    if (project.image) {
      fs.unlink(path.join(__dirname, '../public/uploads', project.image), () => {});
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Projects (Admin)
router.get('/projects', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
