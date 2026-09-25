@echo off
where node >nul 2>nul
if %errorlevel% equ 0 (
  node "%~dp0launch.cjs" %*
) else (
  "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" "%~dp0launch.cjs" %*
)
if errorlevel 1 pause
