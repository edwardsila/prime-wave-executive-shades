import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../config/axios';
import Logo from '../components/Logo';
import '../styles/ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/projects/${id}`);
      setProject(response.data);
      setError(null);
    } catch (err) {
      setError('Project not found');
      console.error('Error fetching project:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchAllProjects = useCallback(async () => {
    try {
      const response = await axios.get('/projects');
      setProjects(response.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  }, []);

  useEffect(() => {
    fetchProject();
    fetchAllProjects();
  }, [id, fetchProject, fetchAllProjects]);

  if (loading) {
    return (
      <div className="project-detail">
        <div className="container">
          <div className="loading">Loading project...</div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-detail">
        <div className="container">
          <div className="error">
            <p>{error || 'Project not found'}</p>
            <Link to="/" className="back-button">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  // Get related projects (featured ones, excluding current)
  const relatedProjects = projects
    .filter(p => p._id !== id && p.featured)
    .slice(0, 3);

  return (
    <div className="project-detail">
      <header className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <Logo size="medium" showText={true} />
          </Link>
          <div className="navbar-menu">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/admin-login" className="nav-link admin-link">Admin</Link>
          </div>
        </div>
      </header>

      <div className="container">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>

        <div className="project-content">
          <div className="project-image-section">
            <img
              src={`/uploads/${project.image}`}
              alt={project.title}
              className="project-main-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x600?text=Project+Image';
              }}
            />
          </div>

          <div className="project-info-section">
            <h1>{project.title}</h1>

            {project.location && (
              <p className="location">
                📍 <strong>Location:</strong> {project.location}
              </p>
            )}

            {project.completionDate && (
              <p className="completion-date">
                📅 <strong>Completed:</strong> {new Date(project.completionDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}

            <div className="description">
              <h2>Project Details</h2>
              <p>{project.description}</p>
            </div>

            <div className="project-actions">
              <a href="https://wa.me/971501234567?text=I%20am%20interested%20in%20this%20project" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="action-button whatsapp-btn">
                💬 Chat on WhatsApp
              </a>
              <a href="tel:+971501234567" className="action-button call-btn">
                📞 Call Us
              </a>
            </div>

            {project.featured && (
              <div className="featured-badge">✨ Featured Project</div>
            )}
          </div>
        </div>

        {relatedProjects.length > 0 && (
          <div className="related-projects">
            <h2>Other Featured Projects</h2>
            <div className="related-grid">
              {relatedProjects.map((p) => (
                <Link key={p._id} to={`/project/${p._id}`} className="related-card">
                  <img
                    src={`/uploads/${p.image}`}
                    alt={p.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Project';
                    }}
                  />
                  <div className="related-info">
                    <h3>{p.title}</h3>
                    {p.location && <p>{p.location}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="cta-section">
          <h2>Ready to Transform Your Space?</h2>
          <p>Get a free consultation from our experts</p>
          <a href="https://wa.me/971501234567?text=I%20would%20like%20a%20free%20consultation%20for%20parking%20shades" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="cta-button">
            Get Free Consultation
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
