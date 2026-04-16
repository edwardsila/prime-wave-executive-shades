import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/PreviousProjects.css';

const PreviousProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/projects');
      // Filter featured projects or show all if less than 6
      const displayProjects = response.data.length > 6
        ? response.data.filter(p => p.featured)
        : response.data;
      setProjects(displayProjects);
      setError(null);
    } catch (err) {
      setError('Failed to load projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="previous-projects">
        <div className="container">
          <div className="loading">Loading projects...</div>
        </div>
      </section>
    );
  }

  if (error || projects.length === 0) {
    return null; // Don't show section if no projects
  }

  return (
    <section className="previous-projects">
      <div className="container">
        <div className="section-header">
          <h2>Our Previous Projects</h2>
          <p>Explore our portfolio of completed installations and transformations</p>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project._id} className="project-card">
              <div className="project-image-container">
                <img 
                  src={`/uploads/${project.image}`} 
                  alt={project.title}
                  className="project-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Project+Image';
                  }}
                />
                <div className="project-overlay">
                  <Link to={`/project/${project._id}`} className="view-button">
                    View Details
                  </Link>
                </div>
              </div>
              <div className="project-info">
                <h3>{project.title}</h3>
                {project.location && <p className="location">📍 {project.location}</p>}
                <p className="description">{project.description.substring(0, 100)}...</p>
                {project.completionDate && (
                  <p className="date">
                    Completed: {new Date(project.completionDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short'
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && !loading && (
          <div className="no-projects">
            <p>No projects available at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PreviousProjects;
