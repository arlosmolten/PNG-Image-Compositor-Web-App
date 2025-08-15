@echo off
echo Building the project...
npm run build

echo Creating a runnable package in the 'dist' folder...
echo npx serve -s . > dist\run.bat

echo Done. You can now zip the 'dist' folder and share it.
