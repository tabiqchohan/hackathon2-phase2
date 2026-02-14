# Quickstart Guide: Todo Frontend Application

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Access to the backend API server

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the project root with the following variables:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
   NEXT_PUBLIC_JWT_SECRET=your-jwt-secret-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Features

### Authentication
- Navigate to `/auth/signin` to log in
- Navigate to `/auth/signup` to create an account
- Protected routes automatically redirect unauthenticated users

### Todo Management
- Visit `/dashboard` to manage your todos after authentication
- Add new todos using the form
- Update todo status (complete/incomplete)
- Edit todo details
- Delete todos

## Project Structure

```
app/
├── layout.tsx          # Root layout with responsive design
├── page.tsx            # Homepage with auth redirect logic
├── auth/
│   ├── signin/page.tsx
│   ├── signup/page.tsx
│   └── layout.tsx
├── dashboard/
│   ├── page.tsx        # Main dashboard with task list
│   └── layout.tsx
├── globals.css         # Global styles
└── providers.tsx       # Context providers (auth, data)

components/
├── ui/                 # Reusable UI primitives
├── auth/               # Authentication components
├── todo/               # Todo-specific components
└── navigation/         # Navigation components

lib/
├── api.ts              # API client and request functions
├── auth.ts             # Better Auth integration helpers
├── types.ts            # Type definitions
└── utils.ts            # Utility functions
```

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter
- `npm run test` - Run tests

## API Integration

The frontend consumes REST APIs as defined in the API contract. All API calls include JWT authentication headers automatically. The `lib/api.ts` file contains all the API client functions.

## Authentication Flow

1. Unauthenticated users are redirected to `/auth/signin`
2. After successful authentication, users are redirected to `/dashboard`
3. JWT tokens are stored securely and attached to API requests
4. Tokens are refreshed automatically when expired