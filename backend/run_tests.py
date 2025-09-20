#!/usr/bin/env python3
"""
Test runner script for the ML Disease Prediction backend
"""
import subprocess
import sys
import os

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n{'='*50}")
    print(f"Running: {description}")
    print(f"Command: {command}")
    print(f"{'='*50}")
    
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print("✅ SUCCESS")
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print("❌ FAILED")
        print(f"Error: {e}")
        if e.stdout:
            print(f"Stdout: {e.stdout}")
        if e.stderr:
            print(f"Stderr: {e.stderr}")
        return False

def main():
    """Main test runner"""
    print("🧪 ML Disease Prediction Backend Test Suite")
    print("=" * 50)
    
    # Change to backend directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Test commands
    tests = [
        ("python -m pytest tests/ -v", "Unit Tests"),
        ("python -m pytest tests/ --cov=services --cov=app_refactored --cov-report=html", "Coverage Report"),
        ("python -m flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics", "Lint Check"),
        ("python -c 'import app_refactored; print(\"✅ App imports successfully\")'", "Import Test"),
    ]
    
    passed = 0
    total = len(tests)
    
    for command, description in tests:
        if run_command(command, description):
            passed += 1
    
    print(f"\n{'='*50}")
    print(f"Test Results: {passed}/{total} passed")
    print(f"{'='*50}")
    
    if passed == total:
        print("🎉 All tests passed!")
        sys.exit(0)
    else:
        print("❌ Some tests failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
