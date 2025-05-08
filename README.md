# System Requirements & Setup

The microservice runs on Node.js and requires npm to install dependencies. It uses Express.js for backend routing and basic HTML/JavaScript for the frontend interface. To use the service, simply start the Node.js server, access the HTML page in a browser, and perform calculations. The system is lightweight and can be deployed on any server.

1) Download Node.js (LTS version) from https://nodejs.org/ and install it.

2) Install Mongo db and create user

3) Configure kubernetes secrets
   -Create a Kubernetes Secret for MongoDB user credentials:
   
4) Create kubernetes yaml
   Kubectl apply -f <to all .yaml files>

5) Run the application
   kubectl port-forward svc/calculator-service 30323:30323
   
6) Access `http://localhost:30323` in a browser.
