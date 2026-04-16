// Frontend Security Configuration
// Instructions for securing token storage and API communication

module.exports = {
  'CRITICAL: Token Storage Security Fix': `
Your application currently stores JWT in localStorage.
This is vulnerable to XSS (Cross-Site Scripting) attacks.

IMPLEMENTATION STEPS:
=====================

1. UPDATE BACKEND (server.js):
   Add cookie configuration to login response:
   
   res
     .cookie('adminToken', token, {
       httpOnly: true,        // Cannot be accessed by JavaScript
       secure: true,          // HTTPS only (production)
       sameSite: 'strict',    // Prevents CSRF
       maxAge: 24 * 60 * 60 * 1000  // 24 hours
     })
     .json({ token, message: 'Login successful' })

2. UPDATE FRONTEND AdminLogin.js:
   Remove: localStorage.setItem('adminToken', response.data.token)
   
   Replace with:
   - Cookies are set automatically by backend
   - Axios will include them automatically
   - No action needed in frontend code

3. UPDATE FRONTEND AdminPage.js:
   Remove: const token = localStorage.getItem('adminToken')
   
   Replace with:
   - Axios will send cookies automatically
   - Update API calls to not manually set Authorization header
   
   FROM:
   axios.get('/api/admin/products', {
     headers: { Authorization: \`Bearer \${token}\` }
   })
   
   TO:
   axios.get('/api/admin/products')  // Cookie sent automatically

4. LOGOUT SECURITY:
   Clear cookie on logout:
   res.cookie('adminToken', '', {
     httpOnly: true,
     secure: true,
     sameSite: 'strict',
     maxAge: 0  // Immediately expire
   })

5. CONFIGURE AXIOS FOR CREDENTIALS:
   In frontend API config:
   
   axios.defaults.withCredentials = true
   
   This ensures cookies are sent with cross-origin requests.
  `,

  'FRONTEND SECURITY CHECKLIST': [
    '✅ Remove token from localStorage',
    '✅ Use HttpOnly cookies instead',
    '✅ Enable withCredentials in axios',
    '✅ Validate user input before sending',
    '✅ Implement Content Security Policy (CSP) headers',
    '✅ Use HTTPS in production only',
    '✅ Keep dependencies updated',
    '✅ Implement proper error handling (no sensitive data in errors)',
    '⚠️ Add form validation for all inputs',
    '⚠️ Implement session timeout mechanism'
  ],

  'RECOMMENDED PACKAGES FOR FRONTEND': [
    'helmet (already in backend)',
    'csurf (for CSRF protection)',
    'helmet-csp (for Content Security Policy)',
    'xss (for XSS prevention)'
  ],

  'TESTING SECURITY': {
    'Test CORS': 'curl -H "Origin: http://evil.com" http://localhost:5000/api/health',
    'Test Rate Limiting': 'Make >60 requests in 1 minute to see 429 Too Many Requests',
    'Test Auth': 'Try accessing /api/admin/products without token - should get 401',
    'Test Invalid Token': 'Use expired token or wrong secret - should get 401',
    'Test SQL Injection': 'Try admin query injection in username field - sanitized and safe',
    'Test File Upload': 'Try uploading non-image files - should be rejected'
  }
};
