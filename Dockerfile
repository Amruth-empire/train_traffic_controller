# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Install pnpm and dependencies
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml postcss.config.mjs ./
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code and build it
COPY . .
RUN pnpm run build

# Stage 2: Create a lightweight production image
FROM node:20-alpine

# Set the working directory for the production application
WORKDIR /app

# Set environment variables for production
ENV NODE_ENV=production

# Copy necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]