# Begin with Node.js runtime version 14
FROM node:14-alpine

# Configure application directory
WORKDIR /app

# Transfer dependency definition files first
COPY package*.json ./

# Resolve and install required packages
RUN npm ci

# Transfer application source code
COPY . ./

# Define network interface
EXPOSE 3000

# Specify application launch command
CMD ["node", "index.js"]