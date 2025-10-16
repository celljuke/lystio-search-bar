# 🚀 Setup Guide

This guide will help you set up the Lystio Search Bar application from scratch.

## Prerequisites Checklist

Before you begin, ensure you have:

- [ ] **Node.js 20+** installed ([Download](https://nodejs.org/))
- [ ] **npm** (comes with Node.js)
- [ ] **Docker Desktop** installed and running ([Download](https://www.docker.com/products/docker-desktop))
- [ ] **Git** installed ([Download](https://git-scm.com/))
- [ ] **Mapbox Account** (free tier) ([Sign Up](https://account.mapbox.com/auth/signup/))

## Step-by-Step Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd lystio-search-bar

# Install dependencies
npm install
```

### 2. Get Your Mapbox Access Token

1. Go to [Mapbox Account](https://account.mapbox.com/)
2. Navigate to "Access Tokens"
3. Click "Create a token" or use the default public token
4. Ensure these scopes are enabled:
   - ✅ Styles API
   - ✅ Geocoding API
5. Copy the token

### 3. Create Environment File

Create a file named `.env.local` in the root directory:

```bash
# Create the file
touch .env.local
```

Add the following content to `.env.local`:

```env
# Database Configuration
DATABASE_URL="postgresql://lystio_user:lystio_password@localhost:5433/lystio?schema=public"
DATABASE_URL_UNPOOLED="postgresql://lystio_user:lystio_password@localhost:5433/lystio?schema=public"

# Mapbox Configuration
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="pk.your_actual_mapbox_token_here"
```

**Important**: Replace `pk.your_actual_mapbox_token_here` with your actual Mapbox token!

### 4. Set Up the Database

#### Option A: Automated Setup (Recommended)

```bash
npm run db:setup
```

This single command will:

1. Start PostgreSQL in Docker
2. Wait for it to be ready
3. Generate Prisma client
4. Create database schema
5. Display connection details

**Expected output:**

```
🚀 Setting up Lystio database...
📦 Starting PostgreSQL container...
⏳ Waiting for database to be ready...
✅ Database is ready!
🔧 Generating Prisma client...
📊 Pushing database schema...
🎉 Database setup complete!
```

#### Option B: Manual Setup

If you prefer to run each step individually:

```bash
# 1. Start PostgreSQL
npm run db:start

# 2. Wait 10 seconds for database to be ready
sleep 10

# 3. Generate Prisma client
npm run db:generate

# 4. Push database schema
npm run db:push
```

### 5. Seed Sample Data (Optional)

Populate the database with ~1000 sample properties:

```bash
npm run db:seed
```

This creates properties in Vienna, Graz, Salzburg, Linz, Innsbruck, and Klagenfurt with realistic data including:

- Property details (size, rooms, price)
- Locations with coordinates
- Property types and subtypes
- Images and media
- Owner information

**Note**: Seeding takes ~30 seconds to complete.

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at:

- **Frontend**: http://localhost:3000
- **tRPC API**: http://localhost:3000/api/trpc

### 7. Verify Everything Works

1. **Check the homepage loads**: http://localhost:3000
2. **Test the search**:
   - Click on the location field
   - Select "Vienna" from the dropdown
   - You should see properties on the map and list
3. **Test category filter**:
   - Click "Category"
   - Select "Apartments"
   - Properties should filter accordingly
4. **Test map interaction**:
   - Pan and zoom the map
   - Click on property markers
5. **Test mobile view**:
   - Resize browser to mobile width
   - Click search input to open mobile search modal

## Database Management

### Access the Database

#### Using Prisma Studio (GUI)

```bash
npm run db:studio
```

Opens a web interface at http://localhost:5555

#### Using PostgreSQL CLI

```bash
docker exec -it lystio-db psql -U lystio_user -d lystio
```

**Useful psql commands:**

```sql
\dt              -- List all tables
\d properties    -- Describe properties table
SELECT COUNT(*) FROM properties;  -- Count properties
\q               -- Quit
```

### Common Database Tasks

```bash
# View database logs
npm run db:logs

# Restart database
npm run db:restart

# Stop database
npm run db:stop

# Reset database (⚠️ deletes all data)
npm run db:reset

# Re-seed data
npm run db:seed
```

## Troubleshooting

### Docker Not Running

**Error**: `Cannot connect to the Docker daemon`

**Solution**:

```bash
# macOS/Windows: Start Docker Desktop
# Linux: Start Docker service
sudo systemctl start docker
```

### Port 5433 Already in Use

**Error**: `Bind for 0.0.0.0:5433 failed: port is already allocated`

**Solutions**:

1. **Find and stop the process using the port**:

```bash
# Find the process
lsof -ti:5433

# Kill the process
lsof -ti:5433 | xargs kill -9
```

2. **Change the port** in `docker-compose.yml`:

```yaml
ports:
  - "5434:5432" # Use different port
```

Then update your `.env.local`:

```env
DATABASE_URL="postgresql://lystio_user:lystio_password@localhost:5434/lystio?schema=public"
```

### Database Connection Failed

**Error**: `Can't reach database server`

**Check**:

```bash
# Is container running?
docker ps | grep lystio-db

# Check container health
docker inspect lystio-db | grep Health -A 10

# View logs
npm run db:logs
```

**Solutions**:

```bash
# Restart database
npm run db:restart

# If that doesn't work, recreate container
docker-compose down
docker-compose up -d postgres
```

### Prisma Client Out of Sync

**Error**: `Prisma Client did not initialize yet`

**Solution**:

```bash
# Regenerate Prisma client
npm run db:generate

# If still failing, clean and regenerate
rm -rf lib/generated/prisma node_modules/.prisma
npm install
```

### Mapbox Map Not Loading

**Error**: Map shows gray tiles or 401 error in console

**Check**:

1. Token is in `.env.local` with correct format: `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="pk.ey..."`
2. Token has correct scopes (Styles API, Geocoding API)
3. `.env.local` file exists in root directory
4. Dev server was restarted after adding the token

**Verify token**:

```bash
# Check if environment variable is set
npm run dev

# In another terminal
curl -I "https://api.mapbox.com/styles/v1/mapbox/streets-v11?access_token=YOUR_TOKEN"
# Should return 200 OK
```

### Module Not Found Errors

**Error**: `Cannot find module '@/...'`

**Solution**:

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart dev server
npm run dev
```

### Slow Performance

**Tips**:

1. **Enable Turbopack** (already configured):

   ```bash
   npm run dev  # Uses Turbopack by default
   ```

2. **Check Docker resources**:

   - Docker Desktop → Settings → Resources
   - Allocate at least 4GB RAM

3. **Clear browser cache** and hard reload (Cmd/Ctrl + Shift + R)

## Development Workflow

### Making Database Changes

1. **Modify the schema**: Edit `prisma/schema.prisma`

2. **Create a migration**:

```bash
npm run db:migrate
# Enter migration name when prompted
```

3. **Push schema** (for prototyping without migration):

```bash
npm run db:push
```

### Adding New Features

1. Create feature module in `modules/`
2. Add components, hooks, and types
3. Create tRPC router in `server/api/routers/`
4. Update root router in `server/api/root.ts`
5. Test with tRPC client

### Environment-Specific Configuration

Create additional env files as needed:

- `.env.local` - Local development (gitignored)
- `.env.development` - Development environment
- `.env.production` - Production environment

## Next Steps

Once setup is complete:

1. **Explore the codebase**: Start with `app/page.tsx` and `modules/search/`
2. **Read the architecture**: Check `README.md` for project structure
3. **Try the features**: Test search, filters, and map interactions
4. **Make changes**: The app hot-reloads automatically
5. **Run tests**: `npm test` (when tests are added)

## Getting Help

If you encounter issues:

1. Check this troubleshooting section
2. Review the main `README.md`
3. Check Docker and database logs
4. Search existing issues
5. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Node version, Docker version)

---

**Happy coding! 🚀**
