const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Product = require('../models/Product');
const Project = require('../models/Project');
const authMiddleware = require('../middleware/auth');
const { validateProduct, validateAdminCredentials, validateProject } = require('../middleware/validation');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// ========== AUTHENTICATION ROUTES ==========

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find admin by username (case-insensitive)
    const admin = await Admin.findOne({ username: new RegExp(`^${username}$`, 'i') });
    if (!admin) {
      // Generic error message for security (don't reveal if user exists)
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token with 24-hour expiration
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      token, 
      message: 'Login successful',
      admin: { id: admin._id, username: admin.username }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// Admin Registration - DISABLED BY DEFAULT FOR SECURITY
// Only enable this endpoint for initial setup, then disable it
router.post('/register', async (req, res) => {
  // Check if registration is enabled
  if (process.env.ADMIN_REGISTRATION_ENABLED !== 'true') {
    return res.status(403).json({ message: 'Admin registration is currently disabled' });
  }

  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validate input
    const validation = validateAdminCredentials(username, email, password);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ 
      $or: [
        { username: new RegExp(`^${username}$`, 'i') },
        { email: email.toLowerCase() }
      ]
    });

    if (existingAdmin) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Create new admin
    const admin = new Admin({
      username: validation.sanitized.username,
      email: validation.sanitized.email.toLowerCase(),
      password: validation.sanitized.password
    });

    await admin.save();

    res.status(201).json({ 
      message: 'Admin created successfully',
      admin: { id: admin._id, username: admin.username }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

// ========== PRODUCT MANAGEMENT ROUTES ==========

// Add Product (Protected)
router.post('/products', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, description, category } = req.body;

    // Validate input
    const validation = validateProduct(name, description, category);
    if (!validation.isValid) {
      if (req.file) fs.unlinkSync(path.join(__dirname, '..', 'uploads', req.file.filename));
      return res.status(400).json({ errors: validation.errors });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Product image is required' });
    }

    // Create product with sanitized data
    const product = new Product({
      name: validation.sanitized.name,
      description: validation.sanitized.description,
      category: validation.sanitized.category,
      image: `/uploads/${req.file.filename}`,
      createdBy: req.admin.id
    });

    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    if (req.file) fs.unlinkSync(path.join(__dirname, '..', 'uploads', req.file.filename));
    console.error('Product creation error:', error);
    res.status(500).json({ message: 'Failed to add product' });
  }
});

// Update Product (Protected)
router.put('/products/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, description, category, inStock } = req.body;

    // Validate ID
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    // Find product
    const product = await Product.findById(req.params.id);
    if (!product) {
      if (req.file) fs.unlinkSync(path.join(__dirname, '..', 'uploads', req.file.filename));
      return res.status(404).json({ message: 'Product not found' });
    }

    // Validate input if provided
    if (name || description || category) {
      const validation = validateProduct(name || product.name, description || product.description, category || product.category);
      if (!validation.isValid) {
        if (req.file) fs.unlinkSync(path.join(__dirname, '..', 'uploads', req.file.filename));
        return res.status(400).json({ errors: validation.errors });
      }

      if (name) product.name = validation.sanitized.name;
      if (description) product.description = validation.sanitized.description;
      if (category) product.category = validation.sanitized.category;
    }

    // Update image if provided
    if (req.file) {
      const oldImagePath = path.join(__dirname, '..', product.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      product.image = `/uploads/${req.file.filename}`;
    }

    if (inStock !== undefined) product.inStock = Boolean(inStock);

    product.updatedAt = Date.now();
    await product.save();

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    if (req.file) fs.unlinkSync(path.join(__dirname, '..', 'uploads', req.file.filename));
    console.error('Product update error:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// Delete Product (Protected)
router.delete('/products/:id', authMiddleware, async (req, res) => {
  try {
    // Validate ID
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

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
    console.error('Product deletion error:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

// Get all products (Admin view - Protected)
router.get('/products', authMiddleware, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(1000);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// ========== PROJECT MANAGEMENT ROUTES ==========

// Create Project (Protected)
router.post('/projects', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, location, completionDate, featured } = req.body;

    // Validate input
    const validation = validateProject(title, description, location, completionDate);
    if (!validation.isValid) {
      if (req.file) fs.unlinkSync(path.join(__dirname, '..', 'uploads', req.file.filename));
      return res.status(400).json({ errors: validation.errors });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Project image is required' });
    }

    const projectData = {
      title: validation.sanitized.title,
      description: validation.sanitized.description,
      image: req.file.filename,
      location: validation.sanitized.location,
      completionDate: validation.sanitized.completionDate,
      featured: featured === 'true' || featured === true,
      createdBy: req.admin.id
    };

    const project = new Project(projectData);
    await project.save();

    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    if (req.file) fs.unlinkSync(path.join(__dirname, '..', 'uploads', req.file.filename));
    console.error('Project creation error:', error);
    res.status(500).json({ message: 'Failed to create project' });
  }
});

// Update Project (Protected)
router.put('/projects/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    // Validate ID
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const { title, description, location, completionDate, featured } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      if (req.file) fs.unlinkSync(path.join(__dirname, '..', 'uploads', req.file.filename));
      return res.status(404).json({ message: 'Project not found' });
    }

    // Validate input if provided
    if (title || description || location || completionDate) {
      const validation = validateProject(title || project.title, description || project.description, location || project.location, completionDate || project.completionDate);
      if (!validation.isValid) {
        if (req.file) fs.unlinkSync(path.join(__dirname, '..', 'uploads', req.file.filename));
        return res.status(400).json({ errors: validation.errors });
      }

      if (title) project.title = validation.sanitized.title;
      if (description) project.description = validation.sanitized.description;
      if (location !== undefined) project.location = validation.sanitized.location;
      if (completionDate) project.completionDate = validation.sanitized.completionDate;
    }

    if (featured !== undefined) project.featured = featured === 'true' || featured === true;

    // Update image if provided
    if (req.file) {
      if (project.image) {
        fs.unlink(path.join(__dirname, '..', 'uploads', project.image), () => {});
      }
      project.image = req.file.filename;
    }

    await project.save();
    res.json({ message: 'Project updated successfully', project });
  } catch (error) {
    if (req.file) fs.unlinkSync(path.join(__dirname, '..', 'uploads', req.file.filename));
    console.error('Project update error:', error);
    res.status(500).json({ message: 'Failed to update project' });
  }
});

// Delete Project (Protected)
router.delete('/projects/:id', authMiddleware, async (req, res) => {
  try {
    // Validate ID
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete image file
    if (project.image) {
      fs.unlink(path.join(__dirname, '..', 'uploads', project.image), () => {});
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Project deletion error:', error);
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

// Get All Projects (Admin - Protected)
router.get('/projects', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }).limit(1000);
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

module.exports = router;// Add Product (Protected)
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
