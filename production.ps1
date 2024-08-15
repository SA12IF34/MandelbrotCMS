Set-Location -Path ".\FrontEnd\entertainment"
npm install
vite build --mode production

Set-Location -Path ".."

Set-Location -Path ".\goals"
npm install
vite build --mode production

Set-Location -Path ".."

Set-Location -Path ".\home-tasks"
npm install
vite build --mode production

Set-Location -Path ".."

Set-Location -Path ".\learning-tracker"
npm install
vite build --mode production

Set-Location -Path ".."

Set-Location -Path ".\sessions-manager"
npm install
vite build --mode production

Set-Location -Path '..'

Set-Location -Path ".\notes"
npm install
vite build --mode production

Set-Location -Path '..'

Set-Location -Path ".\website-home"
npm install
vite build --mode production


Set-Location -Path "..\.."
# git add .
# git commit -m "commit"
# git push origin main
