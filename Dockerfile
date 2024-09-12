# Use an ARM-compatible Node.js base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the React app for production
RUN npm run build

# Use a minimal server like serve to serve the built app
RUN npm install -g serve

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run when the container starts
CMD ["serve", "-s", "dist", "-l", "3000"]

