const validator = require('validator');

// Validate and sanitize product input
const validateProduct = (name, description, category) => {
  const errors = [];

  if (!name || !name.trim()) {
    errors.push('Product name is required');
  } else if (name.length > 200) {
    errors.push('Product name must be less than 200 characters');
  }

  if (!description || !description.trim()) {
    errors.push('Product description is required');
  } else if (description.length > 2000) {
    errors.push('Description must be less than 2000 characters');
  }

  if (category && category.length > 100) {
    errors.push('Category must be less than 100 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      name: name ? validator.escape(name.trim()) : '',
      description: description ? validator.escape(description.trim()) : '',
      category: category ? validator.escape(category.trim()) : 'Parking Shade'
    }
  };
};

// Validate admin credentials
const validateAdminCredentials = (username, email, password) => {
  const errors = [];

  if (!username || !username.trim() || username.length < 3) {
    errors.push('Username must be at least 3 characters');
  } else if (username.length > 50) {
    errors.push('Username must be less than 50 characters');
  }

  if (!email || !validator.isEmail(email)) {
    errors.push('Valid email is required');
  }

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters');
  } else if (password.length > 128) {
    errors.push('Password is too long');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      username: username ? validator.escape(username.trim()) : '',
      email: email ? validator.escape(email.trim()) : '',
      password: password
    }
  };
};

// Validate project input
const validateProject = (title, description, location, completionDate) => {
  const errors = [];

  if (!title || !title.trim()) {
    errors.push('Project title is required');
  } else if (title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  if (!description || !description.trim()) {
    errors.push('Project description is required');
  } else if (description.length > 3000) {
    errors.push('Description must be less than 3000 characters');
  }

  if (location && location.length > 500) {
    errors.push('Location must be less than 500 characters');
  }

  if (completionDate && !validator.isISO8601(completionDate.toString())) {
    errors.push('Invalid completion date format');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      title: title ? validator.escape(title.trim()) : '',
      description: description ? validator.escape(description.trim()) : '',
      location: location ? validator.escape(location.trim()) : '',
      completionDate: completionDate || new Date()
    }
  };
};

module.exports = {
  validateProduct,
  validateAdminCredentials,
  validateProject
};
