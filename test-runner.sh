#!/bin/bash

echo "🧪 Running ML Disease Prediction Tests"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to run tests and check result
run_test() {
    local test_name="$1"
    local test_command="$2"
    local test_dir="$3"
    
    echo -e "\n${YELLOW}Running $test_name...${NC}"
    cd "$test_dir"
    
    if eval "$test_command"; then
        echo -e "${GREEN}✅ $test_name passed${NC}"
        return 0
    else
        echo -e "${RED}❌ $test_name failed${NC}"
        return 1
    fi
}

# Track overall success
overall_success=true

# Backend Tests
echo -e "\n${YELLOW}Backend Tests${NC}"
echo "============="

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
pip install -r requirements.txt -q
pip install -r requirements-test.txt -q

# Run backend tests
if run_test "Backend API Tests" "python -m pytest tests/test_api.py -v" "backend"; then
    echo "Backend API tests passed"
else
    overall_success=false
fi

if run_test "Backend Service Tests" "python -m pytest tests/test_services.py -v" "backend"; then
    echo "Backend service tests passed"
else
    overall_success=false
fi

# Frontend Tests
echo -e "\n${YELLOW}Frontend Tests${NC}"
echo "=============="

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
npm install --silent --legacy-peer-deps

# Run frontend tests
if run_test "Frontend Component Tests" "npm test -- --watchAll=false --passWithNoTests" "frontend"; then
    echo "Frontend tests passed"
else
    overall_success=false
fi

# Summary
echo -e "\n${YELLOW}Test Summary${NC}"
echo "============"

if [ "$overall_success" = true ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed${NC}"
    exit 1
fi
