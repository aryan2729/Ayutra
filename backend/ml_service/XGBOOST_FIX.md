# XGBoost OpenMP Fix for Apple Silicon

## Issue
XGBoost requires OpenMP runtime library. On Apple Silicon Macs, there can be architecture mismatches.

## Solution

### Option 1: Use conda (Recommended)
```bash
conda install -c conda-forge xgboost
```

### Option 2: Install libomp for arm64
```bash
# Check which homebrew you're using
which brew
# Should be /opt/homebrew/bin/brew for Apple Silicon

# Install libomp
arch -arm64 /opt/homebrew/bin/brew install libomp

# Reinstall xgboost
pip3 install --upgrade --force-reinstall xgboost
```

### Option 3: Use Python 3.9 (if xgboost works there)
```bash
# Use python3.9 if it has xgboost working
python3.9 -m pip install xgboost
python3.9 main.py
```

### Option 4: Skip xgboost temporarily
If models don't require xgboost at runtime, you can modify `model_loader.py` to make xgboost import optional:

```python
try:
    import xgboost
except ImportError:
    xgboost = None
    logger.warning("xgboost not available - some models may not work")
```

## Verify Installation
```bash
python3 -c "import xgboost; print('XGBoost version:', xgboost.__version__)"
```

## For Production
Consider using Docker with a pre-built image that has all dependencies:
```dockerfile
FROM python:3.11-slim
RUN apt-get update && apt-get install -y libomp-dev
RUN pip install xgboost
```
