# Step 1: Build the frontend (Vite)
FROM node:20-slim AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Step 2: Set up the backend (Node.js/TypeScript)
FROM node:20-slim
WORKDIR /app

# Install system dependencies if needed
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy backend files
COPY server/package*.json ./server/
COPY shared/ ./shared/
RUN cd server && npm install

# Copy built frontend from Step 1 to the server's public/dist directory
COPY --from=frontend-builder /app/client/dist ./server/public

# Copy the rest of the server code
COPY server/ ./server/

# Hugging Face Spaces uses Port 7860 by default
ENV PORT=7860
EXPOSE 7860

# Start the server
WORKDIR /app/server
CMD ["npm", "start"]
