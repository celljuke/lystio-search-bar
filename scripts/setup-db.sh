#!/bin/bash

echo "🚀 Setting up Lystio database..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start PostgreSQL container
echo "📦 Starting PostgreSQL container..."
docker-compose up -d postgres

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Check if container is running and healthy
for i in {1..12}; do
    if docker-compose exec -T postgres psql -U lystio_user -d lystio -c '\q' >/dev/null 2>&1; then
        echo "✅ Database is ready!"
        break
    fi
    if [ $i -eq 12 ]; then
        echo "❌ Database failed to start within 60 seconds"
        echo "🔍 Check Docker logs: docker-compose logs postgres"
        exit 1
    fi
    echo "   Still waiting... (${i}/12)"
    sleep 5
done

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Push database schema
echo "📊 Pushing database schema..."
npm run db:push

echo "🎉 Database setup complete!"
echo ""
echo "📋 Database connection details:"
echo "   Host: localhost"
echo "   Port: 5433"
echo "   Database: lystio"
echo "   Username: lystio_user"
echo "   Password: lystio_password"
echo ""
echo "🔗 Connection URL: postgresql://lystio_user:lystio_password@localhost:5433/lystio"
echo ""
echo "▶️  You can now run: npm run dev" 