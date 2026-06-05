# Peaky Blinders E-Commerce - Grafana Dashboard Guide 📊

Since you've built a microservices architecture, Prometheus is already collecting metrics from your Frontend, Product Catalog, and Shopping Cart. Now we just need to visualize them!

---

## Step 1: Connect Prometheus to Grafana
Before you can build a dashboard, Grafana needs to know where Prometheus is.

1. Open **Grafana** (`http://localhost:3000`) and log in (`admin` / `admin`).
2. On the left sidebar, click the ⚙️ **Gear icon (Connections)** -> **Data sources**.
3. Click the blue **Add data source** button.
4. Select **Prometheus**.
5. In the **Connection** -> **Prometheus server URL** field, type:
   👉 `http://prometheus-service:9090`
   *(Since Grafana and Prometheus are in the same Kubernetes cluster, they can talk to each other using their service names!)*
6. Scroll all the way down and click **Save & test**. You should see a green checkmark saying "Successfully queried the Prometheus API."

---

## Step 2: Create Your First Dashboard
1. On the left sidebar, click the ➕ **Plus icon (Create)** -> **Dashboard**.
2. Click **+ Add visualization**.
3. Select your **Prometheus** data source.

---

## Step 3: Add Panels (Metrics)
Here are some of the custom metrics your application is emitting. Copy these into the **"Metrics browser"** query box at the bottom of the panel editor, and click **Run queries** (or `Shift + Enter`).

### Panel 1: Total Frontend Traffic (Bar Chart / Stat)
* **Query:** `sum(frontend_requests_total)`
* **What it does:** Shows the total number of people visiting your storefront.
* **Panel Style:** Change the visualization type (top right) to "Stat" to see a big number.

### Panel 2: Total Items Added to Cart (Time Series)
* **Query:** `sum(shopping_cart_requests_total{method="POST"})`
* **What it does:** Shows how many times users have clicked the "Add to Cart" button.
* **Panel Style:** Leave it as "Time series" to see a line graph of purchases over time.

### Panel 3: 500 Error Rate (The Rollback Trigger!)
* **Query:** `sum(rate(frontend_requests_total{status_code="500"}[1m])) / sum(rate(frontend_requests_total[1m])) * 100`
* **What it does:** This is the EXACT metric your GitHub Actions rollback script looks at! If this spikes above 10%, your pipeline triggers an automatic rollback.
* **Panel Style:** Change to "Time series" and make the line color Red for visual effect!

---

## Step 4: Save!
Click the **Save** button in the top right corner. Give your dashboard a name like `Peaky Blinders Production Traffic`!

To see data flow in real-time, go to your Frontend (`http://localhost:5000`) and start clicking around and adding items to your cart. You will see the graphs in Grafana instantly spike!
