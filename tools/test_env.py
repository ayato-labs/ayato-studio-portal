import os
import subprocess
import sys

print("Python version:", sys.version)
print("Current working directory:", os.getcwd())

workspace = r"C:\Users\saiha\My_Service\programing\ayato-studio"
print(f"Workspace exists: {os.path.exists(workspace)}")

# ワークスペースに移動して git status を実行
try:
    res = subprocess.run(["git", "status"], cwd=workspace, capture_output=True, text=True)
    print("git status exit code:", res.returncode)
    print("git status stdout:\n", res.stdout)
    print("git status stderr:\n", res.stderr)
except Exception as e:
    print("Error running git status:", e)

# ワークスペース直下のファイルをリスト
try:
    print("Files in workspace:", os.listdir(workspace))
except Exception as e:
    print("Error listing workspace files:", e)
