# 🚀 Quick Setup Instructions

## Current Status
✅ Node.js installed  
✅ Dependencies installed  
✅ Development server running on http://localhost:3000  
⚠️ **Supabase configuration needed**

## 📋 Required Setup Steps

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up and create a new project
3. Wait for your project to be ready (2-3 minutes)

### 2. Get Your Supabase Credentials
From your Supabase project dashboard:
- **Project URL**: Settings → API → Project URL
- **Anon Key**: Settings → API → anon/public key
- **Service Role Key**: Settings → API → service_role key (keep this secret!)

### 3. Create Environment File
1. Copy `.env.local.example` to `.env.local`
2. Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 4. Set Up Database Tables
Run these SQL scripts in your Supabase SQL Editor (in order):
1. `scripts/001_create_profiles.sql`
2. `scripts/002_create_complaints.sql` 
3. `scripts/003_create_complaint_updates.sql`

### 5. Restart the Server
Stop the current server (Ctrl+C) and restart:
```bash
npm run dev
```

## 🧪 Test the Application

1. Open http://localhost:3000
2. Click "Sign Up" and create an account
3. Try submitting a test complaint
4. Check browser console for debugging info

## 🔧 Troubleshooting

### If you see "Supabase client not initialized":
- Check your `.env.local` file exists
- Verify the environment variables are correct
- Restart the development server

### If complaints don't show up:
- Check browser console for errors
- Verify database tables were created
- Check user authentication status

### If email notifications don't work:
- Currently emails are logged to console only
- Check browser console for email logs
- This is normal for development

## 📞 Need Help?
- Check the README.md for detailed documentation
- Look at browser console for error messages
- Verify all setup steps are completed
