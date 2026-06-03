#!/bin/bash
# ==============================================================================
# Automated Prometheus-based Rollback Script
# 
# This script monitors the HTTP 5xx error rate for our microservices via Prometheus
# for 3 minutes after a deployment. If the error rate exceeds 10%, it automatically
# triggers a `kubectl rollout undo` to revert to the previous stable state.
# ==============================================================================

set -e # Exit immediately if a command fails

# Configuration
MONITOR_DURATION=180     # Total monitoring time in seconds (3 minutes)
POLL_INTERVAL=15         # How often to query Prometheus in seconds
ERROR_THRESHOLD=10       # 10% error rate threshold
PROMETHEUS_PORT=9090     # Local port for port-forwarding

SERVICES=("frontend" "product-catalog" "shopping-cart")

echo "======================================================"
echo "🚀 Starting Post-Deployment Monitoring & Auto-Rollback"
echo "======================================================"
echo "Monitoring for ${MONITOR_DURATION} seconds..."

# 1. Establish Port-Forward to Prometheus in the background
# We do this so the GitHub Actions runner can securely access Prometheus inside K8s
echo "-> Establishing secure connection to Prometheus API..."
kubectl port-forward svc/prometheus-service ${PROMETHEUS_PORT}:${PROMETHEUS_PORT} > /dev/null 2>&1 &
PF_PID=$!

# Ensure port-forward is killed when script exits (even on failure/cancellation)
trap "kill -9 $PF_PID 2>/dev/null" EXIT

# Give port-forward a few seconds to establish
sleep 5

# Function to check error rate for a specific service
check_error_rate() {
  local service_name=$1
  
  # Format metric name based on service (e.g. frontend_requests_total)
  # Replace hyphens with underscores
  local metric_prefix="${service_name//-/_}"
  local metric_name="${metric_prefix}_requests_total"

  # PromQL Query: (5xx errors in last 2m / total requests in last 2m) * 100
  # Note: Prometheus requires URL encoding for the query
  local promql="(sum(rate(${metric_name}{status_code=~\"5..\"}[2m])) / sum(rate(${metric_name}[2m]))) * 100"
  
  # Fetch data from Prometheus API
  local api_url="http://localhost:${PROMETHEUS_PORT}/api/v1/query"
  local response=$(curl -s --data-urlencode "query=${promql}" "${api_url}")
  
  # Parse the JSON response using jq (GitHub runners have jq pre-installed)
  local error_rate=$(echo "${response}" | jq -r '.data.result[0].value[1]')

  # Edge case: If error_rate is "null" (no traffic) or "NaN" (divide by zero), treat as 0%
  if [[ "$error_rate" == "null" ]] || [[ "$error_rate" == "NaN" ]]; then
    echo "0"
  else
    # Return integer part of the error rate for easy comparison
    echo "${error_rate}" | awk '{print int($1)}'
  fi
}

# 2. Monitoring Loop
end_time=$((SECONDS + MONITOR_DURATION))

while [ $SECONDS -lt $end_time ]; do
  for service in "${SERVICES[@]}"; do
    
    rate=$(check_error_rate "${service}")
    
    echo "[$(date +'%H:%M:%S')] Service: ${service} | 5xx Error Rate: ${rate}%"

    # 3. Rollback Logic
    if [ "${rate}" -ge "${ERROR_THRESHOLD}" ]; then
      echo "❌ CRITICAL: Error rate for ${service} breached ${ERROR_THRESHOLD}% threshold! (Currently ${rate}%)"
      echo "🔄 Initiating AUTOMATED ROLLBACK for ${service}..."
      
      # Trigger the rollback
      kubectl rollout undo deployment/${service}
      
      echo "✅ Rollback executed. The deployment has been reverted to the previous stable state."
      echo "Failing the CI/CD pipeline step so the team is alerted."
      
      exit 1 # Exit with error code to fail the GitHub Actions job
    fi
  done
  
  sleep $POLL_INTERVAL
done

echo "======================================================"
echo "✅ Monitoring complete. Deployments are stable."
echo "======================================================"
