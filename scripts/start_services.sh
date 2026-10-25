#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

# Kill any existing processes on ports 5002, 8080, 5001
lsof -ti:5002 | xargs kill -9 2>/dev/null || true
lsof -ti:8080 | xargs kill -9 2>/dev/null || true
lsof -ti:5001 | xargs kill -9 2>/dev/null || true

# Start products_list on 5002 with nohup
nohup "$DIR/.venv/bin/python" "$DIR/products_list/app.py" > /tmp/products_list.log 2>&1 &
echo "products_list PID: $!"

# Start dealer_details on 8080 with nohup
(cd "$DIR/dealer_details" && PORT=8080 nohup node server.js > /tmp/dealer_details.log 2>&1 &)
echo "dealer_details started"

# Start frontend on 5001 with nohup
(cd "$DIR/dealer_evaluation_frontend" && PORT=5001 nohup "$DIR/.venv/bin/python" app.py > /tmp/frontend.log 2>&1 &)
echo "frontend started"

sleep 2
echo "All microservices started."
