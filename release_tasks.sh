Bash
#!/bin/bash
python manage.py makemigrations
python manage.py migrate --sync-db
