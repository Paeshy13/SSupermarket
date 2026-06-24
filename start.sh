#!/bin/bash
echo "🛒 Starting Samrat Supermarket..."

echo "📦 Starting Django backend on :8000..."
cd backend && python manage.py runserver 0.0.0.0:8000 &
BACKEND_PID=$!

echo "⚡ Starting Next.js frontend on :3000..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Samrat Supermarket is running!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   Admin:    http://localhost:8000/admin (admin/samrat2024)"
echo ""
echo "Press Ctrl+C to stop both servers."

wait $BACKEND_PID $FRONTEND_PID
