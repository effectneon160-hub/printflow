# PrintFlow - Print Management Platform

## Overview
A React + Vite + TypeScript frontend application for managing print jobs, customers, quotes, invoices, and products.

## Architecture
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Emotion
- **Routing**: React Router DOM v6
- **State**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Project Structure
```
src/
  App.tsx          - Main app with routing
  index.tsx        - Entry point
  index.css        - Global styles
  components/      - Shared UI components
  pages/           - Page-level components (Dashboard, Customers, Quotes, Jobs, Invoices, Products, Reports, Settings)
  store/           - Zustand state stores
```

## Running the App
- Command: `npm run dev`
- Port: 5000
- Host: 0.0.0.0

## Key Configuration
- `vite.config.ts`: Server configured for host `0.0.0.0`, port `5000`, `allowedHosts: true` (for Replit proxy)
- `tailwind.config.js`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration
