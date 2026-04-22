# Smart City Complaint Portal - Deployment Guide

## Quick Deployment for Professor Demonstration

### Option 1: Local Development Server (Fastest)
```bash
# Run this command in your project directory
npm run dev
```
**Access**: http://localhost:3000

### Option 2: Production Build
```bash
# Build the project
npm run build

# Start production server
npm start
```
**Access**: http://localhost:3000

### Option 3: Vercel Deployment (Recommended for Professor)
1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy Project**:
   ```bash
   vercel --name smart-city-complaint-portal
   ```

4. **Get Your Link**: Vercel will provide you with a live URL like:
   ```
   https://smart-city-complaint-portal.vercel.app
   ```

### Option 4: Netlify Deployment
1. **Install Netlify CLI**:
   ```bash
   npm i -g netlify-cli
   ```

2. **Build and Deploy**:
   ```bash
   npm run build
   netlify deploy --prod --dir=.next
   ```

## For Your Professor

### Project Information to Share:
- **Project Name**: Smart City Complaint Portal
- **Technology Stack**: Next.js, React, TypeScript, Supabase
- **Features**: 
  - Complaint submission with file uploads
  - Real-time status tracking
  - Admin dashboard with full CRUD operations
  - Reply system for admin responses
  - Export functionality
  - Responsive design

### Demo Credentials (if needed):
- **Admin Login**: admin@smartcity.com / admin123
- **User Login**: user@smartcity.com / user123

### Key Pages to Show:
1. **Homepage** (/) - Modern landing page
2. **Complaint Form** (/complaint) - Submit new issues
3. **Track Status** (/track) - Monitor complaints
4. **Admin Panel** (/admin) - Manage complaints

## Quick Start Command
```bash
npm run dev
```
Then open http://localhost:3000 in your browser.

This is the fastest way to show your professor the complete Smart City Complaint Portal!
