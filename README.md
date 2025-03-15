# System Requirements & Setup

The microservice runs on Node.js and requires npm to install dependencies. It uses Express.js for backend routing and basic HTML/JavaScript for the frontend interface. To use the service, simply start the Node.js server, access the HTML page in a browser, and perform calculations. The system is lightweight and can be deployed on any server.

1) Download Node.js (LTS version) from https://nodejs.org/ and install it.

2) Open a terminal and navigate to your preferred directory.

3) Initialize a Node.js project through terminal:
   ```sh
   npm init -y
   ```

4) Install Express.js for backend routing and Winston for logging:
   ```sh
   npm install express Winston
   ```

5) Now create `server.js` file which will work as API with a frontend HTML file, `index.html`, within `public` directory with the given codes.

6) Run the Microservice:
   ```sh
   node server.js
   ```

7) Access `http://localhost:3000` in a browser.
