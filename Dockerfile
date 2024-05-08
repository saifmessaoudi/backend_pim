# Use a base image with Node.js pre-installed
FROM node:20.11

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to container
COPY package*.json ./

# Install dependencies (excluding devDependencies)
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose port (if necessary)
EXPOSE 3030

# Command to run the application
CMD ["node", "server.js"]
