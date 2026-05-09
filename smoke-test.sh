#!/bin/bash
# AITenderIndonesia API smoke test - runs all endpoints, fails on regression
set -e
BASE="${1:-http://127.0.0.1}"
FAIL=0
PASS=0
echo "=== AITenderIndonesia smoke test against $BASE ==="
check() {
  local name="$1"; local cmd="$2"; local expect="$3"
  local out=$(eval "$cmd" 2>&1 || true)
  if echo "$out" | grep -q "$expect"; then
    echo "  PASS  $name"; PASS=$((PASS+1))
  else
    echo "  FAIL  $name (expect '$expect' in: ${out:0:120})"; FAIL=$((FAIL+1))
  fi
}
check "GET /"                   "curl -s -o /dev/null -w '%{http_code}' $BASE/"                                                                  "200"
check "GET /chat.html"          "curl -s -o /dev/null -w '%{http_code}' $BASE/chat.html"                                                         "200"
check "GET /admin.html"         "curl -s -o /dev/null -w '%{http_code}' $BASE/admin.html"                                                        "200"
check "GET /api/load-tenders"   "curl -s $BASE/api/load-tenders | head -c 50"                                                                   "data"
check "GET /api/health-check"   "curl -s $BASE/api/health-check | head -c 100"                                                                  "providers"
check "POST /api/chat (Halo)"   "curl -s -X POST -H 'Content-Type: application/json' -d '{\"message\":\"Halo\"}' $BASE/api/chat | head -c 200"  "AITenderIndonesia"
check "POST /api/manage-users"  "curl -s -X POST -H 'Content-Type: application/json' -d '{\"action\":\"list\"}' $BASE/api/manage-users | head -c 100" "username"
check "POST /api/manage-users auth" "curl -s -X POST -H 'Content-Type: application/json' -d '{\"action\":\"auth\",\"username\":\"nell\",\"password\":\"123456\"}' $BASE/api/manage-users" "success"
check "POST /api/chat (tender hari ini)" "curl -s -X POST -H 'Content-Type: application/json' -d '{\"message\":\"ada tender hari ini?\"}' $BASE/api/chat | head -c 200" "245 tender"
echo "=== RESULT: $PASS passed, $FAIL failed ==="
exit $FAIL
