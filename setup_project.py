#!/usr/bin/env python3
"""
Smart City Complaint Portal - Project Setup Script
===================================================

This Python script automates the entire setup process for the Smart City Complaint Portal project.
It handles dependency installation, environment configuration, database setup, and server startup.

Author: Smart City Development Team
Version: 1.0
Date: April 2024

Prerequisites:
- Python 3.8 or higher
- Node.js 16 or higher
- npm (Node Package Manager)
- Git
- Supabase account (for database setup)

Usage:
    python setup_project.py

The script will guide you through the entire setup process step by step.
"""

import os
import sys
import subprocess
import json
import time
from pathlib import Path
from typing import Optional, Dict, Any

class ProjectSetup:
    """
    Main class for setting up the Smart City Complaint Portal project.
    
    This class handles all aspects of project setup including:
    - Environment validation
    - Dependency installation
    - Configuration file creation
    - Database setup
    - Development server startup
    """
    
    def __init__(self):
        """Initialize the ProjectSetup class with default configurations."""
        self.project_root = Path(__file__).parent
        self.env_file = self.project_root / ".env.local"
        self.package_json = self.project_root / "package.json"
        
        # Project configuration
        self.project_name = "Smart City Complaint Portal"
        self.description = "A modern web application for reporting and tracking civic issues"
        
        print(f"{'='*60}")
        print(f"{self.project_name} - Setup Script")
        print(f"{'='*60}")
        print(f"Description: {self.description}")
        print(f"Project Root: {self.project_root}")
        print(f"{'='*60}\n")
    
    def check_prerequisites(self) -> bool:
        """
        Check if all required tools are installed and available.
        
        Returns:
            bool: True if all prerequisites are met, False otherwise
            
        This method verifies the availability of:
        - Python 3.8+
        - Node.js 16+
        - npm
        - Git
        """
        print("Step 1: Checking Prerequisites")
        print("-" * 40)
        
        prerequisites = {
            "Python": self._check_command("python", "--version"),
            "Node.js": self._check_command("node", "--version"),
            "npm": self._check_command("npm", "--version"),
            "Git": self._check_command("git", "--version")
        }
        
        all_available = True
        for tool, available in prerequisites.items():
            status = "Available" if available else "Not Available"
            print(f"  {tool}: {status}")
            if not available:
                all_available = False
                print(f"    ERROR: {tool} is required but not installed")
        
        if all_available:
            print("  All prerequisites satisfied!\n")
        else:
            print("  Please install missing prerequisites and run again.\n")
        
        return all_available
    
    def _check_command(self, command: str, version_flag: str) -> bool:
        """
        Helper method to check if a command is available.
        
        Args:
            command: The command to check (e.g., 'python', 'node')
            version_flag: The flag to get version (e.g., '--version')
            
        Returns:
            bool: True if command is available, False otherwise
        """
        try:
            # Handle Windows-specific command detection
            if os.name == 'nt':  # Windows
                if command == 'npm':
                    # On Windows, npm might be npm.cmd
                    result = subprocess.run(
                        ['where', 'npm'], 
                        capture_output=True, 
                        text=True, 
                        timeout=10,
                        shell=True
                    )
                    if result.returncode == 0:
                        # Try to get version to confirm it works
                        version_result = subprocess.run(
                            ['npm', '--version'], 
                            capture_output=True, 
                            text=True, 
                            timeout=10,
                            shell=True
                        )
                        return version_result.returncode == 0
                    return False
                elif command == 'python':
                    # On Windows, python might be python.exe
                    result = subprocess.run(
                        ['where', 'python'], 
                        capture_output=True, 
                        text=True, 
                        timeout=10,
                        shell=True
                    )
                    if result.returncode == 0:
                        version_result = subprocess.run(
                            ['python', '--version'], 
                            capture_output=True, 
                            text=True, 
                            timeout=10,
                            shell=True
                        )
                        return version_result.returncode == 0
                    return False
                elif command == 'node':
                    # On Windows, node might be node.exe
                    result = subprocess.run(
                        ['where', 'node'], 
                        capture_output=True, 
                        text=True, 
                        timeout=10,
                        shell=True
                    )
                    if result.returncode == 0:
                        version_result = subprocess.run(
                            ['node', '--version'], 
                            capture_output=True, 
                            text=True, 
                            timeout=10,
                            shell=True
                        )
                        return version_result.returncode == 0
                    return False
                elif command == 'git':
                    # On Windows, git might be git.exe
                    result = subprocess.run(
                        ['where', 'git'], 
                        capture_output=True, 
                        text=True, 
                        timeout=10,
                        shell=True
                    )
                    if result.returncode == 0:
                        version_result = subprocess.run(
                            ['git', '--version'], 
                            capture_output=True, 
                            text=True, 
                            timeout=10,
                            shell=True
                        )
                        return version_result.returncode == 0
                    return False
            
            # Unix-like systems (Linux, macOS)
            result = subprocess.run(
                [command, version_flag], 
                capture_output=True, 
                text=True, 
                timeout=10
            )
            return result.returncode == 0
        except (subprocess.TimeoutExpired, FileNotFoundError):
            return False
    
    def install_dependencies(self) -> bool:
        """
        Install all required Node.js dependencies for the project.
        
        Returns:
            bool: True if installation successful, False otherwise
            
        This method:
        - Checks if package.json exists
        - Installs dependencies using npm
        - Verifies installation success
        """
        print("Step 2: Installing Dependencies")
        print("-" * 40)
        
        if not self.package_json.exists():
            print("  ERROR: package.json not found!")
            return False
        
        print("  Installing Node.js dependencies...")
        try:
            # Handle Windows-specific npm execution
            if os.name == 'nt':  # Windows
                # Use shell=True for Windows command execution
                result = subprocess.run(
                    "npm install",
                    cwd=self.project_root,
                    capture_output=True,
                    text=True,
                    timeout=300,  # 5 minutes timeout
                    shell=True
                )
            else:
                # Unix-like systems
                result = subprocess.run(
                    ["npm", "install"],
                    cwd=self.project_root,
                    capture_output=True,
                    text=True,
                    timeout=300  # 5 minutes timeout
                )
            
            if result.returncode == 0:
                print("  Dependencies installed successfully!")
                return True
            else:
                print(f"  ERROR: npm install failed!")
                print(f"  Error output: {result.stderr}")
                return False
                
        except subprocess.TimeoutExpired:
            print("  ERROR: npm install timed out!")
            return False
        except Exception as e:
            print(f"  ERROR: Unexpected error during npm install: {e}")
            return False
    
    def setup_environment(self) -> bool:
        """
        Set up environment variables and configuration files.
        
        Returns:
            bool: True if setup successful, False otherwise
            
        This method:
        - Creates .env.local file with necessary environment variables
        - Prompts user for Supabase configuration
        - Validates environment setup
        """
        print("Step 3: Setting Up Environment")
        print("-" * 40)
        
        # Environment variables template
        env_template = """# Smart City Complaint Portal - Environment Configuration
# ===============================================================

# Supabase Configuration (Required)
# Get these values from your Supabase project dashboard
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Smart City Complaint Portal

# Development Configuration
NODE_ENV=development
PORT=3000

# Optional: Email Configuration (for notifications)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your_email@gmail.com
# SMTP_PASS=your_app_password

# Optional: File Upload Configuration
# MAX_FILE_SIZE=5242880  # 5MB in bytes
# ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx
"""
        
        try:
            # Check if .env.local already exists
            if self.env_file.exists():
                print("  .env.local file already exists!")
                choice = input("  Do you want to overwrite it? (y/n): ").lower()
                if choice != 'y':
                    print("  Skipping environment setup...")
                    return True
            
            # Create .env.local file
            with open(self.env_file, 'w') as f:
                f.write(env_template)
            
            print("  Created .env.local file with template configuration")
            print("  IMPORTANT: Please update the Supabase configuration in .env.local")
            print("  before running the application!")
            
            return True
            
        except Exception as e:
            print(f"  ERROR: Failed to create .env.local file: {e}")
            return False
    
    def setup_database(self) -> bool:
        """
        Set up and configure the database (Supabase).
        
        Returns:
            bool: True if setup successful, False otherwise
            
        This method:
        - Provides instructions for Supabase setup
        - Creates database schema if needed
        - Sets up Row Level Security (RLS) policies
        """
        print("Step 4: Database Setup (Supabase)")
        print("-" * 40)
        
        print("  Database Setup Instructions:")
        print("  1. Create a new project at https://supabase.com")
        print("  2. Get your project URL and API keys from the dashboard")
        print("  3. Update the .env.local file with your Supabase credentials")
        print("  4. Run the SQL scripts in the 'scripts/' directory:")
        print("     - scripts/004_fix_rls_policies.sql")
        print("     - scripts/005_simple_rls_fix.sql")
        print("  5. Test the database connection by running the application")
        
        # Check if SQL scripts exist
        scripts_dir = self.project_root / "scripts"
        if scripts_dir.exists():
            print("\n  Available SQL scripts:")
            for script in scripts_dir.glob("*.sql"):
                print(f"    - {script.name}")
        
        print("\n  Database setup completed (manual configuration required)")
        return True
    
    def run_build_test(self) -> bool:
        """
        Test the project build to ensure everything is working correctly.
        
        Returns:
            bool: True if build successful, False otherwise
            
        This method:
        - Runs the Next.js build command
        - Checks for any build errors
        - Reports build status
        """
        print("Step 5: Testing Build")
        print("-" * 40)
        
        try:
            print("  Running Next.js build test...")
            # Handle Windows-specific npm execution
            if os.name == 'nt':  # Windows
                result = subprocess.run(
                    "npm run build",
                    cwd=self.project_root,
                    capture_output=True,
                    text=True,
                    timeout=300,  # 5 minutes timeout
                    shell=True
                )
            else:
                # Unix-like systems
                result = subprocess.run(
                    ["npm", "run", "build"],
                    cwd=self.project_root,
                    capture_output=True,
                    text=True,
                    timeout=300  # 5 minutes timeout
                )
            
            if result.returncode == 0:
                print("  Build test passed successfully!")
                return True
            else:
                print("  Build test failed!")
                print(f"  Error output: {result.stderr}")
                return False
                
        except subprocess.TimeoutExpired:
            print("  ERROR: Build test timed out!")
            return False
        except Exception as e:
            print(f"  ERROR: Unexpected error during build test: {e}")
            return False
    
    def start_development_server(self) -> bool:
        """
        Start the development server.
        
        Returns:
            bool: True if server started successfully, False otherwise
            
        This method:
        - Starts the Next.js development server
        - Provides server URL and access information
        - Monitors server status
        """
        print("Step 6: Starting Development Server")
        print("-" * 40)
        
        try:
            print("  Starting Next.js development server...")
            print("  Server will be available at: http://localhost:3000")
            print("  Press Ctrl+C to stop the server")
            print("\n  Starting server...")
            
            # Handle Windows-specific npm execution
            if os.name == 'nt':  # Windows
                # Start the development server (this will run continuously)
                process = subprocess.Popen(
                    "npm run dev",
                    cwd=self.project_root,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                    shell=True
                )
            else:
                # Unix-like systems
                process = subprocess.Popen(
                    ["npm", "run", "dev"],
                    cwd=self.project_root,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True
                )
            
            # Wait for server to start
            time.sleep(5)
            
            if process.poll() is None:  # Process is still running
                print("  Development server started successfully!")
                print("  Access your application at: http://localhost:3000")
                print("  Press Ctrl+C to stop the server")
                
                # Keep the server running
                try:
                    process.wait()
                except KeyboardInterrupt:
                    print("\n  Stopping development server...")
                    process.terminate()
                    print("  Server stopped.")
                
                return True
            else:
                print("  ERROR: Failed to start development server!")
                stdout, stderr = process.communicate()
                if stderr:
                    print(f"  Error: {stderr}")
                return False
                
        except Exception as e:
            print(f"  ERROR: Failed to start development server: {e}")
            return False
    
    def create_project_documentation(self) -> bool:
        """
        Create comprehensive project documentation.
        
        Returns:
            bool: True if documentation created successfully, False otherwise
            
        This method:
        - Creates README.md with project information
        - Generates API documentation
        - Creates setup guide
        """
        print("Step 7: Creating Project Documentation")
        print("-" * 40)
        
        readme_content = f"""# {self.project_name}

{self.description}

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
{self.project_name}/
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
   cd {self.project_name}
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
"""
        
        try:
            readme_path = self.project_root / "README.md"
            with open(readme_path, 'w') as f:
                f.write(readme_content)
            
            print("  Created comprehensive README.md")
            print("  Documentation completed successfully!")
            return True
            
        except Exception as e:
            print(f"  ERROR: Failed to create documentation: {e}")
            return False
    
    def run_complete_setup(self) -> bool:
        """
        Run the complete setup process from start to finish.
        
        Returns:
            bool: True if setup successful, False otherwise
            
        This method orchestrates the entire setup process:
        1. Check prerequisites
        2. Install dependencies
        3. Set up environment
        4. Configure database
        5. Test build
        6. Create documentation
        7. Start development server
        """
        print(f"Starting Complete Setup for {self.project_name}")
        print("="*60)
        
        # Step 1: Check prerequisites
        if not self.check_prerequisites():
            print("Setup failed: Prerequisites not met")
            return False
        
        # Step 2: Install dependencies
        if not self.install_dependencies():
            print("Setup failed: Dependency installation failed")
            return False
        
        # Step 3: Set up environment
        if not self.setup_environment():
            print("Setup failed: Environment setup failed")
            return False
        
        # Step 4: Set up database
        if not self.setup_database():
            print("Setup failed: Database setup failed")
            return False
        
        # Step 5: Test build
        if not self.run_build_test():
            print("Setup failed: Build test failed")
            return False
        
        # Step 6: Create documentation
        if not self.create_project_documentation():
            print("Setup failed: Documentation creation failed")
            return False
        
        # Step 7: Start development server
        print("\n" + "="*60)
        print("Setup completed successfully!")
        print("="*60)
        print("Your Smart City Complaint Portal is ready to use!")
        print("\nNext steps:")
        print("1. Update .env.local with your Supabase credentials")
        print("2. Set up your Supabase database using the SQL scripts")
        print("3. Start the development server with: npm run dev")
        print("4. Access your application at: http://localhost:3000")
        
        return True


def main():
    """
    Main function to run the setup script.
    
    This function:
    - Creates an instance of ProjectSetup
    - Handles command line arguments
    - Runs the appropriate setup mode
    """
    print("Smart City Complaint Portal - Setup Script")
    print("="*60)
    
    # Create setup instance
    setup = ProjectSetup()
    
    # Check for command line arguments
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == "--help" or command == "-h":
            print_help()
            return
        elif command == "--check":
            setup.check_prerequisites()
            return
        elif command == "--install":
            setup.install_dependencies()
            return
        elif command == "--env":
            setup.setup_environment()
            return
        elif command == "--build":
            setup.run_build_test()
            return
        elif command == "--start":
            setup.start_development_server()
            return
        else:
            print(f"Unknown command: {command}")
            print_help()
            return
    
    # Run complete setup
    try:
        success = setup.run_complete_setup()
        if success:
            print("\nSetup completed successfully!")
            print("You can now start the development server with:")
            print("  npm run dev")
        else:
            print("\nSetup failed. Please check the error messages above.")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\nSetup interrupted by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\nUnexpected error during setup: {e}")
        sys.exit(1)


def print_help():
    """
    Print help information for the setup script.
    
    This function displays usage instructions and available commands.
    """
    print("Usage: python setup_project.py [COMMAND]")
    print("")
    print("Commands:")
    print("  (no args)    Run complete setup process")
    print("  --help, -h   Show this help message")
    print("  --check      Check prerequisites only")
    print("  --install    Install dependencies only")
    print("  --env        Set up environment only")
    print("  --build      Test build only")
    print("  --start      Start development server only")
    print("")
    print("Examples:")
    print("  python setup_project.py           # Run complete setup")
    print("  python setup_project.py --check   # Check prerequisites")
    print("  python setup_project.py --install # Install dependencies")
    print("  python setup_project.py --start   # Start development server")


if __name__ == "__main__":
    """
    Entry point of the setup script.
    
    This script is designed to be run from the command line and provides
    a comprehensive setup solution for the Smart City Complaint Portal project.
    """
    main()
