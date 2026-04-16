import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/PreviousProjects.css';
import projects from '../data/projects';

const PreviousProjects = () => {
  const [displayProjects, setDisplayProjects] = useState([]);

  useEffect(() => {
    setDisplayProjects(projects);
  }, []);

  return (
    <section className="previous-projects">
      <div className="container">
        <div className="section-header">
          <h2>Our Previous Projects</h2>
          <p>Explore our portfolio of completed installations and transformations</p>
        </div>

        <div className="projects-grid">
          {displayProjects.map((project) => (
            <div key={project._id} className="project-card">
              <div className="project-image-container">
                <img 
                  src={project.image} 
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

        {displayProjects.length === 0 && (
          <div className="no-projects">
            <p>No projects available at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PreviousProjects;
