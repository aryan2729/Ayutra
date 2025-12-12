# Troubleshooting Guide

## XGBoost Installation Issues

If you encounter errors like:
```
XGBoostError: XGBoost Library (libxgboost.dylib) could not be loaded.
Library not loaded: @rpath/libomp.dylib
```

### Solution for macOS:

1. Install OpenMP runtime:
```bash
brew install libomp
```

2. Then reinstall xgboost:
```bash
pip3 install --upgrade --force-reinstall xgboost
```

### Solution for Linux:

```bash
sudo apt-get install libomp-dev  # Ubuntu/Debian
# or
sudo yum install libgomp  # CentOS/RHEL
```

### Solution for Windows:

Install Microsoft Visual C++ Redistributable or use conda:
```bash
conda install -c conda-forge xgboost
```

## Model Loading Warnings

If you see sklearn version warnings:
```
InconsistentVersionWarning: Trying to unpickle estimator from version 1.2.2 when using version 1.6.1
```

These are warnings, not errors. The models should still work, but for best results, consider:
- Using the same sklearn version as training (1.2.2)
- Or retraining models with current sklearn version

## Python Version Issues

If models were trained with Python 3.9 but you're using Python 3.11:
- The models should still work, but you may see warnings
- For production, use the same Python version as training

## Port Already in Use

If port 8000 is already in use:
```bash
# Find process using port 8000
lsof -i :8000

# Kill the process or change port in main.py
```

## Import Errors

If you see "No module named 'ml_service'":
- Make sure you're running from the correct directory
- Or install the package: `pip install -e .`

## Dataset Not Found

If the dataset file is missing:
- Encoders will be built from the model's training data if available
- Or provide the dataset path in config.py
