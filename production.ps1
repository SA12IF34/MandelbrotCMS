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

Set-Location -Path ".\notes"
vite build --mode production

Set-Location -Path '..'
