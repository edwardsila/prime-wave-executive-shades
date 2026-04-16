# Admin Setup Guide

## Backend URL
The correct backend URL is: **https://prime-wave-executive-shades.onrender.com**

## Step 1: Update Render Environment Variables

Go to https://dashboard.render.com and update your service's environment variables:

### Required Variables:
1. **MONGODB_URI**
   ```
   mongodb+srv://prime:wave@cluster0.98b8cib.mongodb.net/primewaveshades?retryWrites=true&w=majority&appName=Cluster0
   ```

2. **ALLOWED_ORIGINS**
   ```
   http://localhost:3000,https://primewaveshades.works,https://www.primewaveshades.works
   ```

3. **JWT_SECRET** (already set)
   - Keep the existing value

4. **NODE_ENV**
   ```
   production
   ```

5. **PORT**
   ```
   5000
   ```

### Steps to Update:
1. Go to https://dashboard.render.com
2. Click on your **prime-wave-executive-shades** service
3. Click **Environment** tab (left sidebar)
4. Update each variable above
5. Click **Save** - it will auto-redeploy

## Step 2: Create Admin User

After Render redeploys (takes ~1-2 minutes), visit this URL in your browser:

```
https://prime-wave-executive-shades.onrender.com/api/setup
```

This will create a default admin user with credentials:
- **Username:** admin
- **Password:** admin123

## Step 3: Login to Admin Panel

1. Go to https://primewaveshades.works/admin-login
2. Enter credentials:
   - Username: **admin**
   - Password: **admin123**
3. Click Login

You should now be able to access the admin dashboard!

## Step 4: Remove Setup Endpoint (Security)

Once admin is created, remove the `/api/setup` endpoint from `backend/server.js` for security:

Delete these lines from server.js (around line 117-131):
```javascript
// Setup endpoint - create default admin (remove this in production)
app.get('/api/setup', async (req, res) => {
  // ... code to remove ...
});
```

Then commit, push, and Render will auto-deploy.

## Troubleshooting

### "Endpoint not found" when accessing setup
- Render is still deploying. Wait 1-2 minutes after saving environment variables.

### "Operation buffering timed out"
- MongoDB URI is incorrect. Check the connection string in Render Environment variables.
- Make sure IP whitelist allows Render (0.0.0.0/0 or Render IPs added in MongoDB Atlas)

### Login still fails after admin creation
- The admin may not have been created. Visit `/api/setup` again and check the response.
- Try visiting the health endpoint first: https://prime-wave-executive-shades.onrender.com/api/health
