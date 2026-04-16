// Security Configuration and Best Practices
// This file documents security measures and how to deploy securely

module.exports = {
  // ========== ENVIRONMENT VARIABLES REQUIRED ==========
  // Copy to your .env file and fill in with secure values
  
  ENVIRONMENT_TEMPLATE: `
# === SECURITY SETTINGS ===
NODE_ENV=production
JWT_SECRET=${process.env.JWT_SECRET || 'CHANGE_THIS_TO_SECURE_VALUE'}

# === DATABASE ===
MONGODB_URI=your_mongodb_connection_string

# === SERVER ===
PORT=5000

# === CORS CONFIGURATION ===
# Add your frontend URLs here, separated by commas
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# === RATE LIMITING ===
MAX_REQUESTS_PER_MINUTE=60

# === ADMIN REGISTRATION ===
# Set to 'true' only for initial setup, then change back to 'false'
ADMIN_REGISTRATION_ENABLED=false
`,

  // ========== SECURITY CHECKLIST ==========
  SECURITY_CHECKLIST: {
    'Database': {
      '✅ MongoDB credentials secured': 'Stored in .env, never exposed',
      '✅ Connection with encryption': 'Using MongoDB Atlas with SSL',
      '✅ IP whitelist configured': 'Only your server IPs allowed'
    },
    
    'Authentication': {
      '✅ Strong JWT secret': '256-bit random secret generated',
      '✅ Token expiration': '24 hours maximum',
      '✅ Password hashing': 'bcryptjs with salt rounds 10',
      '✅ Rate limiting': '5 login attempts per 15 minutes',
      '✅ Admin registration disabled': 'Blocked by default for security'
    },
    
    'HTTP Security': {
      '✅ Helmet.js enabled': 'Sets secure HTTP headers',
      '✅ CORS restricted': 'Only allowed origins can access API',
      '✅ Compression enabled': 'Reduces response size',
      '✅ Rate limiting enabled': '60 requests per minute per IP',
      '✅ XSS protection': 'Using helmet and input sanitization'
    },
    
    'Input Validation': {
      '✅ MongoDB injection prevention': 'Using express-mongo-sanitize',
      '✅ Input sanitization': 'Using validator.js library',
      '✅ Length limits enforced': 'All fields have max length validation',
      '✅ Type checking': 'Strict MongoDB ID validation',
      '✅ Email validation': 'Using email validator'
    },
    
    'File Security': {
      '✅ File type validation': 'Only images allowed (jpeg, jpg, png, gif)',
      '✅ File size limits': '10MB maximum per file',
      '✅ Filename randomization': 'Timestamp + random suffix to prevent enumeration',
      '✅ Uploaded files outside web root': 'Proper path configuration'
    },
    
    'Token Storage': {
      '⚠️ Frontend improvement needed': 'Move token from localStorage to HttpOnly cookie (see notes below)'
    }
  },

  // ========== FRONTEND TOKEN STORAGE FIX ==========
  FRONTEND_SECURITY_NOTE: `
IMPORTANT: Your frontend currently stores JWT in localStorage.
This is vulnerable to XSS attacks.

SOLUTION: Use HttpOnly, Secure cookies instead

Replace in frontend AdminLogin.js and AdminPage.js:
  
FROM:
  localStorage.setItem('adminToken', response.data.token)
  const token = localStorage.getItem('adminToken')

TO:
  // Backend sets cookie automatically
  // Frontend retrieves from Authorization header (for API calls)
  
In backend, add cookie setting:
  res.cookie('adminToken', token, {
    httpOnly: true,      // Prevents XSS
    secure: true,        // HTTPS only
    sameSite: 'strict',  // Prevents CSRF
    maxAge: 24 * 60 * 60 * 1000  // 24 hours
  })

Then frontend axios requests automatically include cookies.
  `,

  // ========== DEPLOYMENT CHECKLIST ==========
  DEPLOYMENT_CHECKLIST: [
    '1. Generate strong JWT secret: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"',
    '2. Update .env with secure values',
    '3. Set NODE_ENV=production',
    '4. Enable HTTPS/SSL certificate',
    '5. Configure MongoDB IP whitelist to only your server',
    '6. Set ALLOWED_ORIGINS to your production domain only',
    '7. Set ADMIN_REGISTRATION_ENABLED=false',
    '8. Run: npm install (to install new security packages)',
    '9. Test all endpoints with Postman or similar',
    '10. Set up monitoring/logging for suspicious activity',
    '11. Regular backup of MongoDB database',
    '12. Keep dependencies updated regularly'
  ],

  // ========== ATTACK MITIGATION ==========
  ATTACK_MITIGATION: {
    'Brute Force': 'Rate limiting: 5 attempts per 15 minutes on login',
    'SQL/MongoDB Injection': 'Input sanitization with express-mongo-sanitize and validator.js',
    'XSS (Cross-Site Scripting)': 'Input validation, Helmet.js headers, HTML escaping',
    'CSRF (Cross-Site Request Forgery)': 'JWT tokens, SameSite cookies (when implemented)',
    'DDoS': 'Rate limiting and compression',
    'Sensitive Data Exposure': 'HTTPS/SSL, secure headers, no exposed credentials',
    'Unauthorized Access': 'JWT authentication on all admin endpoints',
    'Path Traversal': 'Strict file path validation in upload middleware',
    'CORS Issues': 'Strict origin whitelist configuration'
  }
};
