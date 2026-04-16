import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../config/axios';
import Logo from '../components/Logo';
import '../styles/AdminPage.css';

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'projects'
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Parking Shade',
    image: null,
  });
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    description: '',
    location: '',
    completionDate: '',
    featured: false,
    image: null,
  });
  const navigate = useNavigate();

  const token = localStorage.getItem('adminToken');

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get('/api/admin/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      if (error.response?.status === 401) {
        navigate('/admin-login');
      }
    }
  }, [navigate]);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await axios.get('/api/admin/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      if (error.response?.status === 401) {
        navigate('/admin-login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (!token) {
      navigate('/admin-login');
    } else {
      fetchProducts();
      fetchProjects();
    }
  }, [token, navigate, fetchProducts, fetchProjects]);

  const handleChange = (e) => {
    const { name, value, files, checked } = e.target;
    if (activeTab === 'products') {
      if (name === 'image') {
        setFormData((prev) => ({
          ...prev,
          image: files[0],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else if (activeTab === 'projects') {
      if (name === 'image') {
        setProjectFormData((prev) => ({
          ...prev,
          image: files[0],
        }));
      } else if (name === 'featured') {
        setProjectFormData((prev) => ({
          ...prev,
          featured: checked,
        }));
      } else {
        setProjectFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (activeTab === 'products') {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('category', formData.category);
        if (formData.image) {
          data.append('image', formData.image);
        }

        if (editingProduct) {
          await axios.put(`/api/admin/products/${editingProduct._id}`, data, config);
        } else {
          await axios.post('/api/admin/products', data, config);
        }

        setFormData({
          name: '',
          description: '',
          category: 'Parking Shade',
          image: null,
        });
        setEditingProduct(null);
        setShowForm(false);
        fetchProducts();
      } else if (activeTab === 'projects') {
        const data = new FormData();
        data.append('title', projectFormData.title);
        data.append('description', projectFormData.description);
        data.append('location', projectFormData.location);
        data.append('completionDate', projectFormData.completionDate);
        data.append('featured', projectFormData.featured);
        if (projectFormData.image) {
          data.append('image', projectFormData.image);
        }

        if (editingProject) {
          await axios.put(`/api/admin/projects/${editingProject._id}`, data, config);
        } else {
          await axios.post('/api/admin/projects', data, config);
        }

        setProjectFormData({
          title: '',
          description: '',
          location: '',
          completionDate: '',
          featured: false,
          image: null,
        });
        setEditingProject(null);
        setShowForm(false);
        fetchProjects();
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving item');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    if (activeTab === 'products') {
      setEditingProduct(item);
      setFormData({
        name: item.name,
        description: item.description,
        category: item.category,
        image: null,
      });
    } else if (activeTab === 'projects') {
      setEditingProject(item);
      setProjectFormData({
        title: item.title,
        description: item.description,
        location: item.location || '',
        completionDate: item.completionDate?.split('T')[0] || '',
        featured: item.featured,
        image: null,
      });
    }
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete this ${activeTab === 'products' ? 'product' : 'project'}?`)) {
      try {
        const endpoint = activeTab === 'products' ? `/api/admin/products/${id}` : `/api/admin/projects/${id}`;
        await axios.delete(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (activeTab === 'products') {
          fetchProducts();
        } else {
          fetchProjects();
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    setEditingProject(null);
    setFormData({
      name: '',
      description: '',
      category: 'Parking Shade',
      image: null,
    });
    setProjectFormData({
      title: '',
      description: '',
      location: '',
      completionDate: '',
      featured: false,
      image: null,
    });
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <Link to="/" className="admin-logo">
          <Logo size="small" showText={false} />
        </Link>
        <h1>Admin Dashboard</h1>
        <div className="admin-header-nav">
          <Link to="/" className="nav-btn">Home</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="admin-container">
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('products');
              setShowForm(false);
              handleCancel();
            }}
          >
            Products
          </button>
          <button
            className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('projects');
              setShowForm(false);
              handleCancel();
            }}
          >
            Projects
          </button>
        </div>
        <div className="admin-controls">
          <button
            onClick={() => setShowForm(!showForm)}
            className="add-product-btn"
          >
            {showForm ? 'Cancel' : `Add New ${activeTab === 'products' ? 'Product' : 'Project'}`}
          </button>
        </div>

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <>
            {showForm && (
              <div className="product-form-container">
                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit} className="product-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Product Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter product name"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      placeholder="Enter product description"
                      rows="4"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="category">Category</label>
                      <input
                        type="text"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Enter category"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="image">Product Image {editingProduct && '(Leave empty to keep current)'}</label>
                      <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleChange}
                        accept="image/*"
                        required={!editingProduct}
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" disabled={loading} className="submit-btn">
                      {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                    <button type="button" onClick={handleCancel} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="products-list">
              <h2>Products ({products.length})</h2>
              {products.length === 0 ? (
                <p className="no-products">No products added yet</p>
              ) : (
                <div className="products-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product._id}>
                          <td>
                            <img src={`/uploads/${product.image}`} alt={product.name} className="product-thumb" onError={(e) => {e.target.src = 'https://via.placeholder.com/50'}} />
                          </td>
                          <td>{product.name}</td>
                          <td className="description-cell">{product.description}</td>
                          <td>{product.category}</td>
                          <td className="actions-cell">
                            <button
                              onClick={() => handleEdit(product)}
                              className="edit-btn"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="delete-btn"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <>
            {showForm && (
              <div className="product-form-container">
                <h2>{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
                <form onSubmit={handleSubmit} className="product-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="title">Project Title</label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={projectFormData.title}
                        onChange={handleChange}
                        required
                        placeholder="Enter project title"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={projectFormData.description}
                      onChange={handleChange}
                      required
                      placeholder="Enter project description"
                      rows="4"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="location">Location</label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={projectFormData.location}
                        onChange={handleChange}
                        placeholder="Enter project location"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="completionDate">Completion Date</label>
                      <input
                        type="date"
                        id="completionDate"
                        name="completionDate"
                        value={projectFormData.completionDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="image">Project Image {editingProject && '(Leave empty to keep current)'}</label>
                      <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleChange}
                        accept="image/*"
                        required={!editingProject}
                      />
                    </div>
                    <div className="form-group checkbox-group">
                      <label htmlFor="featured">
                        <input
                          type="checkbox"
                          id="featured"
                          name="featured"
                          checked={projectFormData.featured}
                          onChange={handleChange}
                        />
                        Featured Project
                      </label>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" disabled={loading} className="submit-btn">
                      {loading ? 'Saving...' : editingProject ? 'Update Project' : 'Add Project'}
                    </button>
                    <button type="button" onClick={handleCancel} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="products-list">
              <h2>Projects ({projects.length})</h2>
              {projects.length === 0 ? (
                <p className="no-products">No projects added yet</p>
              ) : (
                <div className="products-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Location</th>
                        <th>Featured</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project) => (
                        <tr key={project._id}>
                          <td>
                            <img src={`/uploads/${project.image}`} alt={project.title} className="product-thumb" onError={(e) => {e.target.src = 'https://via.placeholder.com/50'}} />
                          </td>
                          <td>{project.title}</td>
                          <td>{project.location || '—'}</td>
                          <td>{project.featured ? '✓' : '—'}</td>
                          <td className="actions-cell">
                            <button
                              onClick={() => handleEdit(project)}
                              className="edit-btn"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(project._id)}
                              className="delete-btn"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
