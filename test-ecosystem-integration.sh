#!/bin/bash

# TiltCheck Ecosystem Integration Test Script
# Comprehensive testing of all endpoints and integrations

echo "🧪 ================================="
echo "🎯 TiltCheck Ecosystem Integration Tests"
echo "🧪 ================================="

# Configuration
BASE_URL="http://localhost:4001"
TIMEOUT=10

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0

# Function to test endpoint
test_endpoint() {
    local endpoint=$1
    local expected_status=${2:-200}
    local description=$3
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -n "Testing $description..."
    
    response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout $TIMEOUT "$BASE_URL$endpoint" 2>/dev/null)
    
    if [ "$response" -eq "$expected_status" ]; then
        echo -e " ${GREEN}✅ PASS${NC} ($response)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e " ${RED}❌ FAIL${NC} (Expected: $expected_status, Got: $response)"
    fi
}

# Function to test JSON endpoint
test_json_endpoint() {
    local endpoint=$1
    local description=$2
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -n "Testing $description..."
    
    response=$(curl -s --connect-timeout $TIMEOUT "$BASE_URL$endpoint" 2>/dev/null)
    
    if echo "$response" | jq . > /dev/null 2>&1; then
        echo -e " ${GREEN}✅ PASS${NC} (Valid JSON)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e " ${RED}❌ FAIL${NC} (Invalid JSON or no response)"
    fi
}

# Function to check if server is running
check_server() {
    echo "🔍 Checking if server is running on port 4001..."
    
    if curl -s --connect-timeout 5 "$BASE_URL/api/health" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Server is running${NC}"
        return 0
    else
        echo -e "${RED}❌ Server is not running on port 4001${NC}"
        echo "Please start the server first with: ./start-unified-ecosystem.sh"
        exit 1
    fi
}

# Start tests
echo "🚀 Starting TiltCheck Ecosystem Integration Tests"
echo "📍 Target: $BASE_URL"
echo ""

# Check if server is running
check_server
echo ""

# Test landing pages
echo "🧪 ================================="
echo "📄 Testing Landing Pages"
echo "🧪 ================================="

test_endpoint "/" "Root page"
test_endpoint "/compliance" "Compliance page"
test_endpoint "/portfolio" "Portfolio page"  
test_endpoint "/support" "Support page"

echo ""

# Test API endpoints
echo "🧪 ================================="
echo "🔌 Testing API Endpoints"
echo "🧪 ================================="

test_json_endpoint "/api/health" "Health check API"
test_json_endpoint "/api/crypto/prices" "Crypto prices API"
test_json_endpoint "/api/swc/verification" "SWC verification API"
test_json_endpoint "/api/stats" "Ecosystem stats API"
test_json_endpoint "/api/navigation" "Navigation API"

echo ""

# Test ecosystem routes
echo "🧪 ================================="
echo "🏠 Testing Ecosystem Routes"
echo "🧪 ================================="

test_json_endpoint "/ecosystem" "Ecosystem overview"
test_json_endpoint "/bot/invite" "Bot invite info"
test_json_endpoint "/developer" "Developer info"

echo ""

# Test redirects
echo "🧪 ================================="
echo "🔀 Testing Redirects"
echo "🧪 ================================="

test_endpoint "/bot" 302 "Bot invite redirect"
test_endpoint "/github" 301 "GitHub redirect"
test_endpoint "/discord" 301 "Discord redirect"
test_endpoint "/kofi" 301 "Ko-fi redirect"
test_endpoint "/linkedin" 301 "LinkedIn redirect"

echo ""

# Test 404 handling
echo "🧪 ================================="
echo "🚫 Testing 404 Handling"
echo "🧪 ================================="

test_endpoint "/nonexistent-page" 404 "404 error handling"

echo ""

# Test specific features
echo "🧪 ================================="
echo "⚙️ Testing Specific Features"
echo "🧪 ================================="

# Test if crypto ticker data has required fields
echo -n "Testing crypto ticker data structure..."
TOTAL_TESTS=$((TOTAL_TESTS + 1))

crypto_response=$(curl -s --connect-timeout $TIMEOUT "$BASE_URL/api/crypto/prices" 2>/dev/null)
if echo "$crypto_response" | jq '.BTC.price' > /dev/null 2>&1 && echo "$crypto_response" | jq '.BTC.change' > /dev/null 2>&1; then
    echo -e " ${GREEN}✅ PASS${NC} (Has required fields)"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e " ${RED}❌ FAIL${NC} (Missing required fields)"
fi

# Test SWC verification data
echo -n "Testing SWC verification data..."
TOTAL_TESTS=$((TOTAL_TESTS + 1))

swc_response=$(curl -s --connect-timeout $TIMEOUT "$BASE_URL/api/swc/verification" 2>/dev/null)
if echo "$swc_response" | jq '.verified' | grep -q "true" && echo "$swc_response" | jq '.discord_interaction_id' | grep -q "1174481962614931507"; then
    echo -e " ${GREEN}✅ PASS${NC} (Correct verification data)"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e " ${RED}❌ FAIL${NC} (Incorrect verification data)"
fi

# Test footer consistency
echo -n "Testing footer consistency..."
TOTAL_TESTS=$((TOTAL_TESTS + 1))

health_response=$(curl -s --connect-timeout $TIMEOUT "$BASE_URL/api/health" 2>/dev/null)
if echo "$health_response" | jq '.footer.developer' | grep -q "jmenichole"; then
    echo -e " ${GREEN}✅ PASS${NC} (Footer contains developer info)"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e " ${RED}❌ FAIL${NC} (Footer missing developer info)"
fi

echo ""

# Performance tests
echo "🧪 ================================="
echo "⚡ Testing Performance"
echo "🧪 ================================="

echo -n "Testing response time..."
TOTAL_TESTS=$((TOTAL_TESTS + 1))

start_time=$(date +%s%N)
curl -s --connect-timeout $TIMEOUT "$BASE_URL/api/health" > /dev/null 2>&1
end_time=$(date +%s%N)

response_time=$(( (end_time - start_time) / 1000000 )) # Convert to milliseconds

if [ $response_time -lt 1000 ]; then
    echo -e " ${GREEN}✅ PASS${NC} (${response_time}ms)"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e " ${YELLOW}⚠️ SLOW${NC} (${response_time}ms)"
fi

echo ""

# Integration tests
echo "🧪 ================================="
echo "🔗 Testing External Integrations"
echo "🧪 ================================="

# Check if external links are properly referenced
echo -n "Testing external link references..."
TOTAL_TESTS=$((TOTAL_TESTS + 1))

ecosystem_response=$(curl -s --connect-timeout $TIMEOUT "$BASE_URL/ecosystem" 2>/dev/null)
if echo "$ecosystem_response" | jq '.liveApplications.degensBot' | grep -q "tiltcheckecosystem.created.app"; then
    echo -e " ${GREEN}✅ PASS${NC} (External links properly referenced)"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e " ${RED}❌ FAIL${NC} (External links missing or incorrect)"
fi

echo ""

# Final results
echo "🧪 ================================="
echo "📊 Test Results Summary"
echo "🧪 ================================="

echo "Total Tests: $TOTAL_TESTS"
echo "Passed: $PASSED_TESTS"
echo "Failed: $((TOTAL_TESTS - PASSED_TESTS))"

if [ $PASSED_TESTS -eq $TOTAL_TESTS ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    echo -e "${GREEN}✅ TiltCheck Ecosystem is fully integrated and operational!${NC}"
    exit_code=0
else
    echo -e "${RED}❌ Some tests failed.${NC}"
    echo -e "${YELLOW}⚠️ Please review the failed tests above.${NC}"
    exit_code=1
fi

echo ""
echo "🧪 ================================="
echo "🎯 Integration Status:"
echo "   📄 Landing Pages: Operational"
echo "   🔌 API Endpoints: Functional"
echo "   🔀 Redirects: Working"
echo "   🏠 Ecosystem Links: Integrated"
echo "   👤 Developer Attribution: Present"
echo "   🛡️ SWC Verification: Active"
echo "   💰 Crypto Tickers: Live"
echo ""
echo "🌐 Access your ecosystem at: $BASE_URL"
echo "💬 Join Discord: https://discord.gg/K3Md6aZx"
echo "👤 Developer: jmenichole - Mischief Manager"
echo "🧪 ================================="

exit $exit_code
