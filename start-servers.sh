#!/bin/bash

# Start both frontend and backend servers for development
echo "🚀 Starting Umbler Dashboard Development Environment"
echo "======================================================"

# Kill any existing processes on our ports
echo "🔄 Cleaning up existing processes..."
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Wait a moment for processes to terminate
sleep 2

# Start backend server
echo "🖥️  Starting backend server..."
cd backend
npm install
nohup npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend server started with PID: $BACKEND_PID"

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 5

# Check if backend is running
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Backend server is running on http://localhost:3001"
else
    echo "❌ Backend server failed to start. Checking logs..."
    echo "📋 Last 10 lines of backend log:"
    tail -10 ../backend.log
    echo ""
    echo "💡 This is normal if Google Ads API is not configured (development mode)"
    echo "🔧 Backend will run with mock data until you configure the API keys"
fi

# Start frontend server
echo "🌐 Starting frontend server..."
cd ..

# Clean node_modules cache if needed (for Node.js compatibility)
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.vite/deps/_metadata.json" ]; then
    echo "🧹 Cleaning and installing frontend dependencies..."
    rm -rf node_modules/.vite
fi

npm install

# Set environment variables
export REACT_APP_BACKEND_URL=http://localhost:3001/api/umbler
export REACT_APP_WEBSOCKET_URL=http://localhost:3001

nohup npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend server started with PID: $FRONTEND_PID"

# Wait for frontend to start
echo "⏳ Waiting for frontend to initialize..."
sleep 10

# Check if frontend is running
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Frontend server is running on http://localhost:5173"
else
    echo "❌ Frontend server failed to start. Checking logs..."
    echo "📋 Last 10 lines of frontend log:"
    tail -10 frontend.log
    echo ""
    echo "💡 Try running: npm run dev manually to see detailed error"
fi

echo ""
echo "🎉 Development environment is ready!"
echo "======================================"
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:3001"
echo "Health:   http://localhost:3001/health"
echo ""
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "To stop servers: ./stop-servers.sh"
echo "To view logs: tail -f backend.log frontend.log"