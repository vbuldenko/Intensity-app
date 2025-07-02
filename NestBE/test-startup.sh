#!/bin/bash

echo "Testing NestBE build and startup..."

# Build the project
echo "Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

echo "Build successful!"

# Try to start the application
echo "Starting application..."
PORT=3001 npm run start &

# Get the PID of the started process
APP_PID=$!

# Wait a bit for the app to start
sleep 5

# Check if the process is still running
if kill -0 $APP_PID 2>/dev/null; then
    echo "Application started successfully!"
    
    # Try to make a simple health check request
    curl -f http://localhost:3001/api || echo "Health check failed, but app is running"
    
    # Kill the application
    kill $APP_PID
    echo "Application stopped."
else
    echo "Application failed to start!"
    exit 1
fi
