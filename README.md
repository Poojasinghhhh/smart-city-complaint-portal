# Smart City Complaint Portal

A modern web application for reporting and tracking civic issues

## Overview

This is a modern web application built with Next.js, React, and Supabase that allows citizens to report and track civic issues in their city. The application features a responsive design, real-time updates, and comprehensive admin dashboard.

## Technology Stack

- **Frontend**: Next.js 16, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Deployment**: Vercel (recommended)
- **Development**: Node.js, npm

## Features

### For Citizens
- Easy complaint submission with photos and location
- Real-time complaint tracking
- Status notifications
- Community feedback system
- Mobile-responsive design

### For Administrators
- Comprehensive dashboard
- Complaint management system
- Analytics and reporting
- Bulk operations
- Role-based access control

## Project Structure

```
Smart City Complaint Portal/
app/                    # Next.js app directory
  admin/               # Admin dashboard pages
  auth/                # Authentication pages
  dashboard/           # User dashboard
  complaint/           # Complaint management
components/            # React components
  ui/                  # UI components
  complaint-form.tsx   # Complaint submission form
  admin-dashboard.tsx  # Admin dashboard
lib/                   # Utility libraries
  supabase/           # Supabase client configuration
  types.ts            # TypeScript type definitions
scripts/               # Database setup scripts
public/                # Static assets
styles/                # Global styles
```

## Setup Instructions

### Prerequisites
- Node.js 16 or higher
- npm 8 or higher
- Supabase account

### Quick Start

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Smart City Complaint Portal
   ```

2. Run the setup script:
   ```bash
   python setup_project.py
   ```

3. Follow the on-screen instructions to:
   - Install dependencies
   - Configure environment variables
   - Set up Supabase database
   - Start the development server

### Manual Setup

If you prefer manual setup:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

3. Set up database:
   - Create a new Supabase project
   - Run the SQL scripts in the `scripts/` directory
   - Configure Row Level Security policies

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | No |
| `NODE_ENV` | Environment mode | No |

## Database Schema

The application uses the following main tables:

- `profiles` - User profiles and authentication data
- `complaints` - Complaint records and status
- `categories` - Complaint categories
- `comments` - User comments and feedback

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user

### Complaints
- `GET /api/complaints` - List complaints
- `POST /api/complaints` - Create complaint
- `PUT /api/complaints/:id` - Update complaint
- `DELETE /api/complaints/:id` - Delete complaint

### Admin
- `GET /api/admin/stats` - Get statistics
- `GET /api/admin/complaints` - Admin complaint list
- `PUT /api/admin/complaints/:id` - Update complaint status

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically

### Manual Deployment
1. Build the application: `npm run build`
2. Start production server: `npm start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Email: support@smartcity.gov.in
- Phone: 1800-123-4567
- Documentation: /docs

## Acknowledgments

- Government of India for supporting this initiative
- Supabase for providing the backend infrastructure
- Next.js team for the excellent framework
- All contributors and testers
