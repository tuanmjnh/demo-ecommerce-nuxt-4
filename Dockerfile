# --- Phase 1: Build (Use heavy image to have enough build tools) ---
FROM node:22-alpine AS builder

WORKDIR /app

# Copy the configuration file first to take advantage of cache
COPY package.json ./

# Install all libraries (including devDependencies to build)
RUN npm install

# Copy all code into
COPY . .

# Build (Create .output folder)
RUN npm run build

# --- Stage 2: Run (Use the lightest image to run) ---
FROM node:22-alpine AS runner

WORKDIR /app

# Copy only .output folder from builder stage
# Skip heavy node_modules because Nitro has packed enough in .output
COPY --from=builder /app/.output ./.output

# Declare environment variable (Configure Host to run in Docker)
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

# Open port
EXPOSE 3000

# Run server
CMD ["node", ".output/server/index.mjs"]