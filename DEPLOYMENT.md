# 🚀 Deployment Guide

## Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] `.env` variables documented
- [ ] Admin account created
- [ ] Hero images replaced with real ones
- [ ] WhatsApp number updated
- [ ] Custom colors applied
- [ ] MongoDB Atlas account created
- [ ] Hosting accounts created
- [ ] Domain name registered

## Database Setup (MongoDB Atlas)

### 1. Create Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create new project named "Prime Wave Shades"

### 2. Create Cluster
1. Click "Create Cluster"
2. Select Free tier (M0)
3. Choose region closest to your users
4. Name: `prime-wave-cluster`
5. Click "Create Cluster"

### 3. Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Username: `admin_user`
4. Generate secure password
5. Grant "readWriteAnyDatabase" role
6. Save credentials securely

### 4. Configure Network Access
1. Go to "Network Access"
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (or add specific IPs)
4. This allows connections from any server

### 5. Get Connection String
1. Go to "Clusters"
2. Click "Connect"
3. Select "Drivers"
4. Copy connection string
5. Replace `<password>` with your database password

## Backend Deployment (Using Railway.app)

### 1. Prepare Backend
```bash
cd backend

# Create production .env
cp .env.example .env.production
```

### 2. Update .env.production
```
MONGODB_URI=mongodb+srv://admin_user:PASSWORD@cluster.mongodb.net/prime-wave?retryWrites=true&w=majority
JWT_SECRET=super_long_secret_key_at_least_32_characters_long
PORT=5000
NODE_ENV=production
```

### 3. Deploy to Railway
1. Go to https://railway.app
2. Create account with GitHub
3. Click "New Project"
4. Select "GitHub Repo"
5. Connect your repository
6. Select the `prime-wave-executive-shades` repo
7. Add environment variables from `.env.production`
8. Deploy!

**Get Backend URL**: Dashboard shows your deployed URL (e.g., `https://app.railway.app`)

## Frontend Deployment (Using Vercel)

### 1. Update Frontend Config
Edit `frontend/.env.production`:
```
REACT_APP_API_URL=https://your-railway-backend-url.com
```

Update `frontend/package.json`:
```json
{
  "proxy": "https://your-railway-backend-url.com"
}
```

### 2. Deploy to Vercel
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. Select Frontend folder: `frontend`
6. Add environment variables
7. Deploy!

**Get Frontend URL**: Vercel shows your deployed URL (e.g., `https://prime-wave-shades.vercel.app`)

## Alternative: Docker Deployment

### 1. Create Dockerfile for Backend
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000
CMD ["node", "server.js"]
```

### 2. Create Dockerfile for Frontend
```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
```

### 3. Deploy with Docker Compose
```bash
docker-compose up -d
```

## Setting Up Custom Domain

### 1. Register Domain
- Use Namecheap, GoDaddy, or Route53
- Example: `primewaveshades.com`

### 2. Point Domain to Backend
For Railway:
1. Get Railway deployment URL
2. Add CNAME record pointing to Railway
3. Or use Railway's custom domain feature

### 3. Point Domain to Frontend
For Vercel:
1. Go to Vercel project settings
2. Add custom domain
3. Follow Vercel's DNS instructions

### 4. Enable HTTPS
- Both Railway and Vercel provide free SSL certificates
- HTTPS is automatic

## Environment Variables for Production

### Backend (.env)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=very_long_secret_key_minimum_32_chars
PORT=5000
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com
```

### Frontend (.env.production)
```
REACT_APP_API_URL=https://api.yourdomain.com
```

## Post-Deployment Steps

### 1. Create Admin Account
```bash
curl -X POST https://api.yourdomain.com/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@youremail.com",
    "password": "secure_password_123"
  }'
```

### 2. Add Products
1. Visit `https://yourdomain.com/admin-login`
2. Login with admin credentials
3. Add your parking shade products

### 3. Test Everything
- Visit homepage
- Check all products display
- Test WhatsApp button
- Try admin login
- Verify images load

### 4. Set Up Monitoring
Consider adding:
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **New Relic**: Performance monitoring
- **Google Analytics**: Traffic analysis

## Maintenance

### Regular Tasks
- [ ] Monitor error logs
- [ ] Check database usage
- [ ] Update dependencies monthly
- [ ] Backup database weekly
- [ ] Review analytics
- [ ] Update product photos

### Security
- [ ] Enable 2FA on all accounts
- [ ] Rotate JWT secret annually
- [ ] Update Node.js version quarterly
- [ ] Review security vulnerabilities: `npm audit`
- [ ] Add rate limiting to API
- [ ] Enable HTTPS everywhere

### Scaling (If Needed)
- Use MongoDB Atlas paid tier
- Add CDN for static files (Cloudflare)
- Implement caching (Redis)
- Add load balancer
- Separate read/write databases

## Cost Estimation

| Service | Free Tier | Paid Starting |
|---------|-----------|---------------|
| MongoDB Atlas | 512 MB | $57/month |
| Railway | $5 credit | Pay as you go |
| Vercel | Hobby | Pro $20/month |
| Domain | - | $10-15/year |
| Total (Monthly) | Free | ~$65+ |

## Troubleshooting Deployment

### Backend Won't Start
1. Check environment variables are set
2. Verify MongoDB connection string
3. Check logs in deployment dashboard
4. Ensure Node version is compatible

### Frontend Can't Connect to API
1. Check `REACT_APP_API_URL` is correct
2. Verify CORS is enabled on backend
3. Check network tab for failed requests
4. Ensure backend is running

### Database Connection Fails
1. Verify IP is whitelisted in MongoDB Atlas
2. Check username/password is correct
3. Ensure database name matches connection string
4. Verify network connectivity

### Images Not Loading
1. Check upload folder is writable
2. Verify image paths are correct
3. Check CORS headers
4. Use absolute URLs for images

## Performance Optimization

### Frontend
1. **Lazy load images**: Use React Suspense
2. **Code splitting**: Implement route-based splitting
3. **Minify assets**: Already done by React build
4. **Compression**: Enable gzip on server
5. **Caching**: Set proper cache headers

### Backend
1. **Database indexing**: Add indexes to frequently queried fields
2. **Caching**: Use Redis for frequently accessed data
3. **Pagination**: Implement for product listing
4. **Compression**: Use compression middleware
5. **Rate limiting**: Prevent abuse

## Disaster Recovery

### Backup Strategy
1. **Database**: Enable automatic backups in MongoDB Atlas
2. **Code**: Use Git with regular commits
3. **Images**: Backup `uploads` folder regularly
4. **Secrets**: Store in secure vault, not Git

### Recovery Procedure
1. Restore database from backup
2. Re-deploy code from Git
3. Restore image files
4. Verify everything works

## Going Live Checklist

- [ ] Domain registered and pointing
- [ ] SSL certificate installed
- [ ] Database backed up
- [ ] Admin account created
- [ ] Sample products added
- [ ] WhatsApp number verified
- [ ] Images optimized
- [ ] Links tested
- [ ] Mobile version tested
- [ ] Performance checked
- [ ] Analytics installed
- [ ] Support email configured
- [ ] Monitoring enabled

## Support & Resources

- **Railway**: https://railway.app/docs
- **Vercel**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Let's Encrypt**: https://letsencrypt.org

## Next Steps

After successful deployment:
1. Monitor analytics
2. Gather customer feedback
3. Plan feature additions
4. Consider mobile app
5. Setup payment processing
6. Implement order system

---

**Deployment Status**: Ready for production ✅
**Estimated Setup Time**: 2-3 hours
**Estimated Monthly Cost**: $50-100 (depending on traffic)
