web: python manage.py makemigrations && python manage.py migrate --run-syncdb && python manage.py createsuperuser --noinput && python manage.py collectstatic --noinput && gunicorn Mandelbrot.wsgi