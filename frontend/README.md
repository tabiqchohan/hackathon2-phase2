# Todo Frontend Application

A Next.js frontend application for the Todo Web Application with authentication and task management features.

## Features

- User authentication (sign up and sign in)
- Protected dashboard for managing tasks
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Responsive design for desktop and mobile
- Filter tasks (all, active, completed)

## Tech Stack

- Next.js 16+ with App Router
- React 18+
- TypeScript
- Tailwind CSS
- Better Auth for authentication

## Environment Variables

Create a `.env.local` file in the root of the frontend directory with the following variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Global layout
│   ├── page.tsx            # Home page
│   ├── auth/               # Authentication pages
│   │   ├── layout.tsx
│   │   ├── signin/page.tsx
│   │   └── signup/page.tsx
│   └── dashboard/page.tsx  # Protected dashboard
├── components/             # Reusable React components
│   ├── auth/               # Authentication components
│   ├── todo/               # Todo-specific components
│   └── ui/                 # Generic UI components
├── lib/                    # Utilities and API client
│   ├── api.ts              # API client implementation
│   └── types.ts            # TypeScript type definitions
├── public/                 # Static assets
├── package.json
├── next.config.js
├── tsconfig.json
└── README.md
```