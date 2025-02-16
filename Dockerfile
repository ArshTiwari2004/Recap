# using node image to build the react app
FROM node

# Set the working directory
WORKDIR /recap

# Copy the rest of the application code to the working directory
COPY . .

# Install dependencies
RUN npm install

# Build the React application
RUN npm run dev

# Start the web server
CMD ["npm", "run", "dev"]