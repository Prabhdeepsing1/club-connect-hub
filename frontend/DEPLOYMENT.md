# VOSC Website - Deployment Guide

## Project Overview
A modern, responsive informational website for the VCE Open Source Community (VOSC), built with React, TypeScript, Tailwind CSS, and Vite.

## Tech Stack
- **Frontend Framework**: React 18.3
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **TypeScript**: Full type safety
- **Routing**: React Router DOM

## Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Navbar.tsx      # Navigation component
│   ├── Footer.tsx      # Footer component
│   ├── EventCard.tsx   # Event card component
│   ├── ProjectCard.tsx # Project card component
│   └── TeamCard.tsx    # Team member card component
├── pages/              # Page components
│   ├── Index.tsx       # Homepage
│   ├── About.tsx       # About page
│   ├── Events.tsx      # Events listing
│   ├── EventDetail.tsx # Individual event page
│   ├── Dashboard.tsx   # Member dashboard (protected)
│   ├── PRAssistant.tsx # PR Quality Assistant
│   ├── Join.tsx        # Join/application page
│   └── NotFound.tsx    # 404 page
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── index.css           # Global styles & design system
```

## Local Development

### Prerequisites
- Node.js 16+ and npm
- Git

### Installation & Setup

1. **Clone the repository** (or use provided files)
```bash
git clone <repository-url>
cd vosc-website
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The site will be available at `http://localhost:8080`

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Deployment to Vercel (Recommended)

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

Follow the prompts. For production deployment:
```bash
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your Git repository
4. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click "Deploy"

Your site will be live in minutes with automatic HTTPS!

## Deployment to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click "Deploy site"

## Deployment to GitHub Pages

1. **Update vite.config.ts** to set base path:
```typescript
export default defineConfig({
  base: '/repository-name/',
  // ... rest of config
})
```

2. **Build the project**
```bash
npm run build
```

3. **Deploy to gh-pages branch**
```bash
npm install -g gh-pages
gh-pages -d dist
```

4. **Configure GitHub repository**:
   - Go to Settings → Pages
   - Source: Deploy from branch
   - Branch: gh-pages, /root

## Environment Configuration

Currently, the site uses mock data. To connect to a backend API:

1. Create a `.env` file:
```env
VITE_API_URL=https://api.your-domain.com
VITE_GITHUB_ORG=vosc-vce
```

2. Update API calls in components to use environment variables:
```typescript
const API_URL = import.meta.env.VITE_API_URL;
```

## Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Vercel automatically provides SSL

### Netlify
1. Go to Site Settings → Domain management
2. Add custom domain
3. Update DNS records
4. SSL is automatically provisioned

## Content Updates

### Updating Events
Edit the mock data in `src/pages/Events.tsx` and `src/pages/Index.tsx`. In production, this would be fetched from an API.

### Updating Team Members
Edit the `teamMembers` array in `src/pages/About.tsx`.

### Updating Projects
Edit the `featuredProjects` array in `src/pages/Index.tsx`.

## Design System

The design system is centralized in:
- `src/index.css` - CSS variables and design tokens
- `tailwind.config.ts` - Tailwind theme configuration

To customize colors, update HSL values in `src/index.css`:
```css
:root {
  --primary: 210 100% 50%;    /* Blue */
  --accent: 189 94% 43%;      /* Cyan */
  /* ... other colors */
}
```

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Tested on iOS Safari and Chrome Mobile

## Performance Optimization

The site includes:
- Code splitting via React.lazy (can be added)
- Optimized images (use WebP format)
- Minified CSS and JavaScript in production
- Tree-shaking for unused code

## Security Best Practices

1. All external links use `rel="noopener noreferrer"`
2. Forms include CSRF protection (implement server-side)
3. No sensitive data exposed in frontend code
4. Use environment variables for API endpoints

## Future Backend Integration

To add backend functionality:

1. **Authentication**: Implement JWT-based auth
2. **API Integration**: Connect to REST API for events, members, etc.
3. **Database**: Use PostgreSQL/MongoDB for data storage
4. **File Uploads**: Add file storage for team photos, event images
5. **Email**: Integrate email service for notifications

### Recommended Backend Stack
- **Framework**: Node.js + Express or Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js or JWT
- **Hosting**: Vercel Edge Functions or Railway

## Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
```bash
# Kill process on port 8080
npx kill-port 8080
# Or change port in vite.config.ts
```

### CSS Not Loading
Ensure Tailwind is properly configured and PostCSS is installed.

## Support & Contact

For issues or questions:
- **Email**: vosc@vce.ac.in
- **GitHub Issues**: [Repository Issues]
- **Community**: Join our Discord/Slack

## License

This project is open source and available under the MIT License.

---

**Developed by VOSC - VCE Open Source Community**
*Built with ❤️ using React, TypeScript, and Tailwind CSS*
