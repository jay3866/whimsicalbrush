# A Whimsical Brush - Artist Portfolio

## Project Overview

A Whimsical Brush is a professional artist portfolio website built with React, TypeScript, and Supabase. The site features a fully customizable content management system, artwork gallery, events management, and contact functionality.

## Tech Stack

- **Frontend:**
  - React 18.3
  - TypeScript
  - Vite
  - TailwindCSS
  - Framer Motion
  - Lucide React (icons)

- **Backend:**
  - Supabase (PostgreSQL database)
  - Edge Functions (serverless)
  - Row Level Security (RLS)

- **Storage:**
  - Supabase Storage for images
  - Three buckets: artwork-images, event-images, site-content

## Key Features

1. **Dynamic Content Management**
   - Fully customizable site content through admin panel
   - Theme customization (colors, logo, site name)
   - Section-by-section content editing

2. **Artwork Gallery**
   - Image upload and management
   - Featured works selection
   - Detailed artwork information
   - Lightbox view with artwork details

3. **Events Management**
   - Create, edit, and delete events
   - Image upload for events
   - Date, time, and location tracking

4. **Contact System**
   - Contact form with email notifications
   - Message management in admin panel
   - Read/unread status tracking

5. **Newsletter Integration**
   - Mailchimp integration via Edge Functions
   - Custom subscription form
   - Error handling and success messages

## Database Schema

### Tables

1. **artworks**
   - Primary artwork storage
   - Includes title, image_url, medium, year, dimensions, status
   - Featured flag and display order for homepage

2. **events**
   - Event information storage
   - Includes title, date, time, location, description, image_url

3. **site_content**
   - Stores all editable site content
   - Key-value pairs with content type

4. **messages**
   - Stores contact form submissions
   - Includes name, email, message, read status

## Security

1. **Authentication**
   - Email/password authentication
   - Admin role management
   - Protected admin routes

2. **Row Level Security (RLS)**
   - Public read access for artworks, events
   - Authenticated write access for admin functions
   - Protected message access

3. **Storage Security**
   - Public read access for images
   - Authenticated upload/delete access
   - Separate buckets for different content types

## Environment Setup

Required environment variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

For newsletter functionality:
```env
MAILCHIMP_API_KEY=your_mailchimp_api_key
MAILCHIMP_LIST_ID=your_list_id
MAILCHIMP_SERVER_PREFIX=your_server_prefix
```

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Admin Access

- Admin registration route: `/registerjrb`
- Admin login: `/login`
- Admin dashboard: `/admin`

## Content Management

### Site Settings
- Logo configuration
- Site name
- Primary color theme

### Page Content
Editable sections per page:
- Home
- About
- Contact
- Events

### Media Management
Three storage buckets:
1. artwork-images: Gallery images
2. event-images: Event promotional images
3. site-content: General site imagery

## Deployment

The project is configured for deployment on Netlify with:
- Automatic builds on push
- Environment variable configuration
- Redirect rules for SPA

## Edge Functions

Located in `/supabase/functions`:
- `subscribe`: Newsletter subscription handler
  - Mailchimp integration
  - Error handling
  - CORS configuration

## Component Structure

1. **Layout Components**
   - Navbar
   - Footer
   - NewsletterSignup

2. **Page Components**
   - Home
   - About
   - Gallery
   - Events
   - Contact
   - Admin
   - Messages

3. **Admin Components**
   - Content editor
   - Image upload
   - Color picker
   - Message management

## Styling

- TailwindCSS for utility-first styling
- Custom CSS variables for theme colors
- Responsive design breakpoints
- Custom component classes

## Best Practices

1. **Performance**
   - Image optimization
   - Lazy loading
   - Component code splitting

2. **Security**
   - Input validation
   - XSS prevention
   - CORS configuration
   - Secure file uploads

3. **Error Handling**
   - Form validation
   - API error handling
   - User feedback

## Future Improvements

1. **Features**
   - Image optimization service
   - Social media integration
   - Blog functionality
   - E-commerce integration

2. **Technical**
   - Image lazy loading
   - Service worker for offline support
   - Performance monitoring
   - Analytics integration

## Support

For technical support or questions:
1. Check existing documentation
2. Review database schema
3. Contact the development team

## License

All rights reserved. Custom development for A Whimsical Brush.