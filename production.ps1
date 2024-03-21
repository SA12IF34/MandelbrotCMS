Set-Location -Path ".\FrontEnd\entertainment"
vite build --mode production

Set-Location -Path ".."

Set-Location -Path ".\goals"
vite build --mode production

Set-Location -Path ".."

Set-Location -Path ".\home-tasks"
vite build --mode production

Set-Location -Path ".."

Set-Location -Path ".\learning-tracker"
vite build --mode production

Set-Location -Path ".."

Set-Location -Path ".\sessions-manager"
vite build --mode production

Set-Location -Path '..'

Set-Location -Path ".\website-home"
vite build --mode production

Set-Location -Path "..\.."

git add .
git commit -m "Deploy to production"
git push heroku master