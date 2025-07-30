#!/bin/bash

echo "🛑 Stopping Umbler Dashboard servers..."

# Kill backend processes
echo "🔄 Stopping backend server..."
pkill -f "node.*server.js" 2>/dev/null || true

# Kill frontend processes
echo "🔄 Stopping frontend server..."
pkill -f "vite" 2>/dev/null || true

# Wait for processes to terminate
sleep 2

echo "✅ All servers stopped."