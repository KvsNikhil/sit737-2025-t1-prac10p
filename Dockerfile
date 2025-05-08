# Begin with Node.js runtime version 22.14.0
FROM node:22.14.0-alpine

# Configure application directory
WORKDIR /app

# Transfer dependency definition files first
COPY package*.json ./ 

# Resolve and install required packages
RUN npm install

# Transfer application source code
COPY . ./

# Define network interface
EXPOSE 3000

# Specify application launch command
CMD ["node", "server.js"]
