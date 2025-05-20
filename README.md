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
7) Monitor application
   i) kubectl top pods -n default
   
   (Shows all pod metrics in default namespace)
   
   ii) kubectl top pod calculator-app-5f56646b87-54smx -n default
   
   (Check the resource usage (CPU and memory) of a specific pod.)
   iii) kubectl get --raw /apis/metrics.k8s.io/v1beta1/namespaces/default/pods/calculator-app-5f56646b87-54smx
   (It returns JSON data about resource usage (CPU and memory) for that pod.)
   iv) kubectl logs calculator-app-5f56646b87-54smx -n default
   (It fetches and displays the logs from the container(s) inside the pod named calculator-app-5f56646b87-54smx in the default namespace. )


