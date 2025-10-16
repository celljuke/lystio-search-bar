# 🏠 Lystio Search Bar

A modern, full-featured property search application built with Next.js 15, featuring advanced search capabilities, interactive maps, and a beautiful responsive UI.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.1-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.17-2D3748?style=flat-square&logo=prisma)
![tRPC](https://img.shields.io/badge/tRPC-11.6-2596BE?style=flat-square&logo=trpc)

## ✨ Features

### 🔍 Advanced Search

- **Smart Location Search** - Powered by Mapbox with autocomplete and bbox filtering
- **Category Filters** - 11 property categories with detailed subcategories
- **Price Range** - Interactive slider with histogram visualization
- **Map Integration** - Interactive Mapbox GL map with property clustering
- **Real-time Results** - Instant property filtering with tRPC

### 📱 Responsive Design

- **Mobile-First** - Fully optimized mobile experience with custom search modal
- **Desktop-Optimized** - Rich desktop interface with expandable search bar
- **Accessibility** - WCAG compliant with keyboard navigation and ARIA labels

### 🎨 Modern UI/UX

- **shadcn/ui Components** - Beautiful, accessible components
- **Smooth Animations** - Motion-powered transitions
- **Dark Mode Ready** - Theme support with next-themes
- **Pixel-Perfect** - Carefully crafted design matching Figma specs

### 🏗️ Architecture

- **Module-Based** - Clean separation of concerns with feature modules
- **Type-Safe** - End-to-end type safety with tRPC and Zod
- **Performant** - Virtual scrolling, optimistic updates, and smart caching
- **Scalable** - PostgreSQL database with Prisma ORM

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ and npm
- **Docker** and Docker Compose (for local database)
- **Mapbox Access Token** (for map features)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd lystio-search-bar
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://lystio_user:lystio_password@localhost:5433/lystio?schema=public"
DATABASE_URL_UNPOOLED="postgresql://lystio_user:lystio_password@localhost:5433/lystio?schema=public"

# Mapbox (Required for map features)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="your_mapbox_access_token_here"
```

> **Get a Mapbox Token**: Sign up at [mapbox.com](https://account.mapbox.com/) and create an access token.

### 4. Set Up the Database

Our automated script handles everything:

```bash
npm run db:setup
```

This will:

- ✅ Start PostgreSQL container via Docker Compose
- ✅ Wait for database to be ready
- ✅ Generate Prisma client
- ✅ Push database schema
- ✅ Display connection details

**Alternative Manual Setup:**

```bash
# Start database
npm run db:start

# Generate Prisma client
npm run db:generate

# Push schema
npm run db:push
```

### 5. Seed the Database (Optional)

Populate with sample property data:

```bash
npm run db:seed
```

This creates ~1000 sample properties across Vienna, Graz, Salzburg, and other Austrian cities.

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📦 Project Structure

```
lystio-search-bar/
├── app/                          # Next.js App Router
│   ├── api/trpc/                 # tRPC API routes
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # Shared components
│   ├── header/                   # Header with navigation
│   │   ├── header-actions.tsx    # User menu, favorites, create listing
│   │   ├── header-logo.tsx       # Logo component
│   │   ├── mobile-header.tsx     # Mobile header layout
│   │   └── desktop-search-area.tsx
│   ├── map/                      # Mapbox GL integration
│   └── ui/                       # shadcn/ui components
├── modules/                      # Feature modules
│   └── search/                   # Search feature
│       ├── components/           # Search-specific UI
│       ├── hooks/                # Custom React hooks
│       ├── schemas/              # Zod validation schemas
│       ├── store.ts              # Zustand state management
│       ├── types/                # TypeScript types
│       └── utils/                # Helper functions
├── server/                       # Backend logic
│   ├── api/                      # tRPC routers and context
│   └── services/                 # Business logic
│       └── search/               # Search service
├── prisma/                       # Database
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Seed data
├── lib/                          # Utilities
│   ├── generated/prisma/         # Generated Prisma client
│   ├── trpc/                     # tRPC setup
│   └── utils.ts                  # Helper functions
└── scripts/                      # Automation scripts
    └── setup-db.sh               # Database setup script
```

## 🛠️ Available Scripts

### Development

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
```

### Database Management

```bash
npm run db:setup     # 🚀 Complete database setup (recommended)
npm run db:start     # Start PostgreSQL container
npm run db:stop      # Stop PostgreSQL container
npm run db:restart   # Restart PostgreSQL container
npm run db:logs      # View database logs

npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database (no migration)
npm run db:migrate   # Create and run migration
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:reset     # Reset database (⚠️ deletes all data)
npm run db:seed      # Seed database with sample data
```

### Database Access

**Prisma Studio** (Recommended):

```bash
npm run db:studio
```

Opens at [http://localhost:5555](http://localhost:5555)

**PostgreSQL Client**:

```bash
docker exec -it lystio-db psql -U lystio_user -d lystio
```

**Connection Details**:

- Host: `localhost`
- Port: `5433`
- Database: `lystio`
- Username: `lystio_user`
- Password: `lystio_password`

## 🏛️ Tech Stack

### Frontend

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - Component library
- **[Lucide Icons](https://lucide.dev/)** - Icon library

### State Management & Data Fetching

- **[tRPC](https://trpc.io/)** - End-to-end type-safe APIs
- **[TanStack Query](https://tanstack.com/query)** - Server state management
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Client state management
- **[Zod](https://zod.dev/)** - Runtime validation

### Database & ORM

- **[PostgreSQL 16](https://www.postgresql.org/)** - Relational database
- **[Prisma](https://www.prisma.io/)** - Type-safe ORM
- **[Docker](https://www.docker.com/)** - Containerization

### Maps & Geolocation

- **[Mapbox GL](https://www.mapbox.com/)** - Interactive maps
- **[@mapbox/search-js-react](https://www.npmjs.com/package/@mapbox/search-js-react)** - Location search

### Additional Tools

- **[Motion](https://motion.dev/)** - Animation library
- **[date-fns](https://date-fns.org/)** - Date utilities
- **[Virtua](https://github.com/inokawa/virtua)** - Virtual scrolling

## 🎨 Key Features Explained

### Smart Search System

**Location Search**:

- Mapbox-powered autocomplete with bbox filtering
- Predefined city shortcuts (Vienna, Graz, Salzburg, etc.)
- Geographic boundary-based property filtering
- Mobile-optimized search modal

**Category Filtering**:

- 11 main categories (Apartments, Houses, Commercial, etc.)
- 70+ subcategories with individual IDs
- Numeric ID-based backend filtering for performance
- "Select All" functionality for subcategories

**Price Range**:

- Interactive dual-handle slider
- Visual histogram showing property distribution
- Separate ranges for rent and buy modes
- Dynamic price formatting

### Module Architecture

Each feature is a self-contained module:

```typescript
modules/search/
├── components/    # UI components
├── hooks/         # Custom hooks (usePropertySearch, useCategory)
├── schemas/       # Zod validation schemas
├── services/      # Business logic
├── store.ts       # Zustand store
├── types/         # TypeScript interfaces
└── utils/         # Helper functions (filter-converter, location-utils)
```

This structure ensures:

- ✅ Clear separation of concerns
- ✅ Easy testing and maintenance
- ✅ Reusable components
- ✅ Type safety across layers

### tRPC Integration

End-to-end type safety from database to UI:

```typescript
// Server: Define type-safe API
export const searchRouter = router({
  search: publicProcedure.input(searchInputSchema).query(async ({ input }) => {
    return searchService.search(input);
  }),
});

// Client: Type-safe consumption
const { data } = trpc.search.search.useQuery({
  filter: { type: [2], subType: [46, 47] },
  paging: { page: 1, pageSize: 26 },
});
```

## 🔧 Configuration

### Environment Variables

| Variable                          | Description                  | Required |
| --------------------------------- | ---------------------------- | -------- |
| `DATABASE_URL`                    | PostgreSQL connection string | ✅ Yes   |
| `DATABASE_URL_UNPOOLED`           | Direct database connection   | ✅ Yes   |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Mapbox API token             | ✅ Yes   |

### Database Configuration

Modify `docker-compose.yml` to customize database settings:

```yaml
environment:
  POSTGRES_USER: lystio_user
  POSTGRES_PASSWORD: lystio_password
  POSTGRES_DB: lystio
ports:
  - "5433:5432" # Host:Container
```

### Mapbox Configuration

Update `lib/config.ts` for Mapbox settings:

```typescript
export const config = {
  mapbox: {
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "",
  },
};
```

## 🐛 Troubleshooting

### Database Connection Issues

**Problem**: `Error: P1001: Can't reach database server`

```bash
# Check if Docker is running
docker ps

# Check database logs
npm run db:logs

# Restart database
npm run db:restart
```

### Prisma Client Issues

**Problem**: `PrismaClient is unable to run in this browser environment`

```bash
# Regenerate Prisma client
npm run db:generate

# If still failing, delete and regenerate
rm -rf lib/generated/prisma node_modules/.prisma
npm install
```

### Mapbox Not Loading

**Problem**: Map tiles not displaying

1. Verify your Mapbox token in `.env.local`
2. Check browser console for 401 errors
3. Ensure token has proper scopes (Styles API, Geocoding API)
4. Restart dev server after adding token

### Port Already in Use

**Problem**: Port 5433 already in use

```bash
# Option 1: Change port in docker-compose.yml
ports:
  - "5434:5432"  # Use different port

# Option 2: Stop existing process
lsof -ti:5433 | xargs kill -9
```

## 📚 Learn More

### Next.js

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Learn Next.js](https://nextjs.org/learn)

### Database & APIs

- [Prisma Documentation](https://www.prisma.io/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### UI Libraries

- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 🙏 Acknowledgments

- [Vercel](https://vercel.com) for Next.js
- [Mapbox](https://www.mapbox.com) for mapping services
- [Prisma](https://www.prisma.io) for database tooling
- [shadcn](https://ui.shadcn.com) for beautiful components

---

Built with ❤️ using [Next.js](https://nextjs.org) and [TypeScript](https://www.typescriptlang.org)
