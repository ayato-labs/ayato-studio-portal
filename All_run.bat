@echo off
cd /d %~dp0
call ..\.venv\Scripts\activate.bat
python scripts/auto_runner.py --once
