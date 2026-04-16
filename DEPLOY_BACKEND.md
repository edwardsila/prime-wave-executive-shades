# 🚀 Deploy Backend to Railway

Your frontend is now deployed on Vercel. Now we need to deploy your backend separately to Railway (free tier available).

## Step 1: Create Railway Account

1. Go to: https://railway.app
2. Click **"Start Project"**
3. Sign up with GitHub (easiest option)
4. Authorize Railway to access your repos

## Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub"**
3. Search for: `prime-wave-executive-shades`
4. Select your repo
5. Click **"Deploy Now"**

## Step 3: Configure Environment Variables

Railway will ask for environment variables:

1. Click **"Variables"** or **"Add Variables"**
2. Add these:
   ```
   MONGODB_URI = mongodb+srv://prime:wave@cluster0.98b8cib.mongodb.net/?appName=Cluster0
   JWT_SECRET = b16b2bdcf293f3367bab9ca2b7a611aa66d148ef9a3ca7a0c5fcb0a40c130a2f
   ALLOWED_ORIGINS = https://primewaveshades.works,https://www.primewaveshades.works
   NODE_ENV = production
   PORT = 3001
   ```
3. Click **"Save"**

## Step 4: Configure Build & Start Commands

In Railway project settings:

**Build Command:**
```bash
cd backend && npm install
```

**Start Command:**
```bash
cd backend && npm start
```

Or if using main server.js:
```bash
node backend/server.js
```

## Step 5: Get Your Backend URL

1. Once deployed, Railway gives you a URL like: `https://prime-wave-backend-production.up.railway.app`
2. Copy this URL

## Step 6: Update Frontend

1. Go to your Vercel dashboard
2. Go to project settings → **Environment Variables**
3. Update `REACT_APP_API_URL`:
   ```
   REACT_APP_API_URL = https://prime-wave-backend-production.up.railway.app
   ```
4. **Redeploy** frontend (go to Deployments → click latest → Redeploy)

## Step 7: Test

1. Visit: https://primewaveshades.works
2. Try logging in to admin
3. API calls should now work! ✓

---

## Alternative: Deploy Backend to Render

If you prefer Render instead:

1. Go to: https://render.com
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repo
4. Set:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `node backend/server.js`
5. Add same environment variables
6. Deploy
7. Get your URL (like: `https://prime-wave-backend.onrender.com`)
8. Update Vercel env var with this URL

---

## Troubleshooting

**Backend won't build:**
- Make sure `backend/package.json` has all dependencies
- Check `backend/server.js` exports correctly
- Check logs in Railway/Render dashboard

**API calls still fail:**
- Check CORS is allowing your frontend domain
- Verify backend URL is correct in Vercel env vars
- Check browser console (F12) for actual error

**Need help?**
- Railway docs: https://docs.railway.app
- Render docs: https://render.com/docs
