@echo off
cd /d "%~dp0"
if /I "%~1"=="-Build" (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-unipaths.ps1" -Build
) else (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-unipaths.ps1"
)
