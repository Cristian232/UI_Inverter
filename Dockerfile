# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the Docker container
WORKDIR /app

# Copy package.json and package-lock.json for the Vite frontend
COPY package*.json ./

# Install dependencies for the Vite frontend
RUN npm install

# Copy the rest of the Vite frontend application code to the container
COPY . .

# Navigate to the server directory and install dependencies for the Express backend
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install

# Navigate back to the root directory
WORKDIR /app

# Build the React app
RUN npm run build

# Expose the ports that your Vite and Express apps will run on
EXPOSE 3000 5000

# Command to run the application using concurrently
CMD ["npm", "run", "dev_all"]
