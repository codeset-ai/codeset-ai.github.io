# Codeset Website

A Next.js 14 frontend for the Codeset platform, featuring GitHub OAuth authentication and API key management.

## Features

- 🔐 GitHub OAuth authentication with JWT tokens
- 👤 User dashboard with account overview
- 🔑 API key management (create, view, copy)
- 📱 Responsive design for desktop and mobile
- 🎨 Modern UI with Tailwind CSS and Radix UI components

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Authentication**: GitHub OAuth + JWT
- **Notifications**: Sonner (toast notifications)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- GitHub OAuth App (see setup below)
- Codeset backend API running

### 1. Clone and Install

```bash
git clone <repository-url>
cd codeset-website
npm install
```

### 2. Environment Setup

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your values
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id_here
NEXT_PUBLIC_API_BASE_URL=https://api.codeset.ai/api/v1
```

### 3. GitHub OAuth App Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in the details:
   ```
   Application name: Codeset
   Homepage URL: http://localhost:3000 (for dev) or your production URL
   Authorization callback URL: http://localhost:3000/auth/callback
   ```
4. Copy the **Client ID** to your `.env.local` file
5. Make sure the **Client Secret** is configured in your backend

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Authentication Flow

1. User clicks "Sign In" → Redirects to GitHub OAuth
2. GitHub redirects back to `/auth/callback?code=...`
3. Frontend exchanges authorization code for JWT tokens via backend API
4. Tokens stored in localStorage for subsequent API calls
5. User redirected to protected `/dashboard`

## Project Structure

```
app/
├── layout.tsx              # Root layout with auth provider
├── page.tsx               # Landing page
├── auth/
│   └── callback/
│       └── page.tsx       # OAuth callback handler
└── dashboard/
    ├── layout.tsx         # Protected dashboard layout
    ├── page.tsx          # Dashboard overview
    └── api-keys/
        └── page.tsx      # API key management

components/
├── Header.tsx            # Navigation with auth buttons
├── Footer.tsx           # Site footer
└── ui/                  # Radix UI components

contexts/
└── AuthContext.tsx      # Authentication state management

lib/
├── auth.ts             # Authentication service
└── api.ts              # API client functions
```

## API Integration

The frontend integrates with these backend endpoints:

- `POST /auth/github` - GitHub OAuth authentication
- `POST /auth/refresh` - Token refresh
- `GET /users/me` - Get current user
- `POST /users/me/api-keys` - Create API key

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   ```
   NEXT_PUBLIC_GITHUB_CLIENT_ID=your_production_client_id
   NEXT_PUBLIC_API_BASE_URL=https://api.codeset.ai/api/v1
   ```
3. Update GitHub OAuth App callback URL to your production domain
4. Deploy!

### Other Platforms

This is a standard Next.js app that can be deployed to:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Docker

Make sure to:
1. Set the correct environment variables
2. Update GitHub OAuth callback URLs
3. Configure build command: `npm run build`
4. Configure start command: `npm run start`

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Structure

- **Client-side only authentication** - no server-side sessions
- **Protected routes** using React Context and useEffect
- **Automatic token refresh** on API 401 responses
- **Toast notifications** for user feedback
- **Responsive design** with mobile-first approach

## Troubleshooting

### Common Issues

**"GitHub OAuth failed"**
- Check if `NEXT_PUBLIC_GITHUB_CLIENT_ID` matches your backend's `GITHUB_CLIENT_ID`
- Verify GitHub OAuth callback URL matches exactly
- Ensure backend API is running and accessible

**"Authentication token not found"**
- Clear browser localStorage: `localStorage.clear()`
- Check if API endpoint URLs are correct
- Verify backend API is responding to authentication requests

**Build/deployment errors**
- Ensure all environment variables are set
- Check if all dependencies are installed
- Verify Node.js version compatibility (18+)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and test thoroughly
4. Commit with clear messages: `git commit -m "Add new feature"`
5. Push to your fork and submit a pull request

## License

This project is part of the Codeset platform. See the main repository for license information.