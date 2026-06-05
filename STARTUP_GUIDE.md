# Peaky Blinders E-Commerce - Daily Startup Guide 🚀

This guide explains the exact steps you need to take to spin up your entire DevOps pipeline and access your application from scratch every time you open your laptop.

---

## Step 1: Start your Kubernetes Cluster
Since you are using Minikube locally, you need to turn on the cluster first.
1. Open a **PowerShell** window.
2. Run the following command:
   ```powershell
   minikube start
   ```
*(Wait a minute or two for Minikube to fully start up and say "Done").*

---

## Step 2: Start your GitHub Actions Runner
Because you did not install the runner as a background service, you need to turn it on manually so GitHub can send deployments to your laptop.
1. Open a **new PowerShell** window.
2. Navigate to your actions runner folder:
   ```powershell
   cd "C:\Users\STA-MADH-54\Documents\DevOps Project Peaky Blinders\actions-runner"
   ```
3. Start the runner:
   ```powershell
   ./run.cmd
   ```
*(Leave this window open in the background! It should say "Connected to GitHub").*

---

## Step 3: Trigger a Deployment (Optional)
If you just want to see the app that is already running from yesterday, you can skip this step! 

However, if you want to deploy fresh code:
1. Make a change in your code (e.g., edit the frontend or backend).
2. Commit and push the code to GitHub.
3. Your CI/CD pipeline will automatically build the images, push to Docker Hub, and send the deployment to your laptop (which is listening via the runner you started in Step 2).

---

## Step 4: Access Your Application
Because Windows sometimes blocks direct access to Minikube's internal IP, you must securely forward the ports to your `localhost`.

Open a **new PowerShell** window and run these three commands (you can run them in separate tabs, or just use the ones you need):

**1. To access the Frontend Store:**
```powershell
kubectl port-forward svc/frontend-service 5000:5000
```
👉 Open your browser to: [http://localhost:5000](http://localhost:5000)

**2. To access Grafana (Monitoring Dashboard):**
```powershell
kubectl port-forward svc/grafana-service 3000:3000
```
👉 Open your browser to: [http://localhost:3000](http://localhost:3000) *(Login: admin / admin)*

**3. To access Prometheus (Raw Metrics):**
```powershell
kubectl port-forward svc/prometheus-service 9090:9090
```
👉 Open your browser to: [http://localhost:9090](http://localhost:9090)

---

## Step 5: Shutting Down (End of Day)
When you are done working and want to save battery/RAM on your laptop:
1. Go to the terminal running your GitHub Runner (`run.cmd`) and press `Ctrl + C` to stop it.
2. Go to the terminals running your `port-forward` commands and press `Ctrl + C` to stop them.
3. Finally, turn off Minikube by running:
   ```powershell
   minikube stop
   ```
