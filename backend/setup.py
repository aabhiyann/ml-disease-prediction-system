from setuptools import setup, find_packages

setup(
    name="ml-disease-prediction",
    version="2.1.0",
    packages=find_packages(),
    install_requires=[
        "flask>=2.0.2",
        "flask-cors>=3.0.10",
        "pandas>=1.3.0",
        "numpy>=1.21.0",
        "scikit-learn>=1.0.0",
        "joblib>=1.1.0",
        "matplotlib>=3.4.0",
    ],
    python_requires=">=3.8",
)
