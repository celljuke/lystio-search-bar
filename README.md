# Lystio Search Bar

A modern, feature-rich property search interface built with Next.js 15, featuring real-time search, interactive maps, and smooth animations.

## ✨ Features

- 🔍 **Advanced Search** - Multi-filter search with location, category, and price
- 🗺️ **Interactive Maps** - Mapbox integration with property markers and clustering
- 🎨 **Beautiful UI** - Smooth animations with Framer Motion
- 📊 **Dynamic Filtering** - Real-time price histograms and filter updates
- 🌍 **Location Search** - City selection with district information
- 🎯 **Type-Safe** - Full TypeScript and tRPC integration
- 🚀 **External API** - Powered by Lystio REST API (no local database needed)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **API**: tRPC for type-safe API layer
- **External API**: Lystio REST API
- **Validation**: Zod schemas
- **UI**: Tailwind CSS + Radix UI + shadcn/ui
- **Animations**: Framer Motion
- **Maps**: Mapbox GL JS
- **State**: Zustand

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Mapbox Access Token (for maps)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd lystio-search-bar
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Mapbox (required for maps)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here

# Lystio API (optional - defaults to https://api.lystio.co)
LYSTIO_API_URL=https://api.lystio.co
```

**Get your Mapbox token:**

- Sign up at [mapbox.com](https://www.mapbox.com/)
- Go to [Account > Access Tokens](https://account.mapbox.com/access-tokens/)
- Copy your default public token or create a new one

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**

```
http://localhost:3001
```

That's it! 🎉 No database setup required.

## 📁 Project Structure

```
lystio-search-bar/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Home page
│   └── layout.tsx           # Root layout
├── components/              # Shared components
│   ├── map/                 # Map components
│   └── ui/                  # UI primitives (shadcn)
├── modules/                 # Feature modules
│   └── search/              # Search feature
│       ├── components/      # Search UI components
│       ├── hooks/           # Custom hooks
│       ├── schemas/         # Zod schemas
│       ├── utils/           # Utilities
│       └── store.ts         # Zustand state
├── server/                  # tRPC backend
│   ├── api/                 # API routes
│   │   ├── routers/         # tRPC routers
│   │   └── trpc.ts          # tRPC setup
│   └── services/            # Business logic
│       ├── search/          # Search service
│       └── location/        # Location service
├── lib/                     # Shared utilities
│   ├── trpc/               # tRPC client setup
│   ├── config.ts           # App configuration
│   └── utils.ts            # Helper functions
└── public/                  # Static assets
    └── images/              # Images
```

## 🎯 Key Features

### Search System

- Multi-filter search (location, category, price)
- Real-time search results
- Price range with histogram visualization
- Rent/Buy mode toggle
- Category and subcategory selection

### Map Integration

- Interactive property markers
- Airbnb-style marker design
- Property popups with images
- Click markers to view details
- Smooth animations and transitions

### Location Features

- City selection with images
- District information
- Boundary-based filtering
- Dynamic location search

### UI/UX

- Smooth Framer Motion animations
- Responsive design (mobile + desktop)
- Airbnb-inspired search bar
- Loading states and skeletons
- Error handling

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server with Turbopack

# Production
npm run build        # Build for production
npm run start        # Start production server
```

## 🌐 API Integration

This project uses the external Lystio API:

**Base URL:** `https://api.lystio.co`

**Key Endpoints:**

- `POST /tenement/search` - Search properties
- `POST /tenement/search/histogram` - Get price histogram
- `GET /geo/boundary/popular` - Get popular locations
- `POST /geo/boundary` - Get location boundaries

No authentication required for these public endpoints.

## 📝 Environment Variables

| Variable                          | Description               | Required | Default                 |
| --------------------------------- | ------------------------- | -------- | ----------------------- |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Mapbox API token for maps | ✅ Yes   | -                       |
| `LYSTIO_API_URL`                  | Lystio API base URL       | ❌ No    | `https://api.lystio.co` |

## 🎨 Customization

### Brand Colors

The app uses a purple theme (`#A540F3`). To customize:

- Update colors in `tailwind.config.ts`
- Search for `#A540F3` and replace

### Map Style

To change the Mapbox style:

- Edit `components/map/index.tsx`
- Update the `style` property in the Map initialization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Lystio API for property data
- Mapbox for mapping services
- shadcn/ui for UI components
- Framer Motion for animations
