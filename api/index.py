import os
import sys

# Add ZeroDayAttack-Phase1 and project root to sys.path
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
app_dir = os.path.join(root_dir, "ZeroDayAttack-Phase1")

if app_dir not in sys.path:
    sys.path.insert(0, app_dir)
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from app import app
