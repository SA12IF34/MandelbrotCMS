web: python manage.py makemigrations sessions_manager && python manage.py migrate sessions_manager && python manage.py makemigrations learning_tracker && python manage.py migrate learning_tracker && python manage.py makemigrations entertainment && python manage.py migrate entertainment && python manage.py makemigrations tasks && python manage.py migrate tasks && python manage.py makemigrations goals && python manage.py migrate goals && python manage.py makemigrations notes && python manage.py migrate notes && python manage.py makemigrations saifapp && python manage.py migrate saifapp && python manage.py makemigrations && python manage.py migrate --run-syncdb && python manage.py collectstatic --noinput && gunicorn Mandelbrot.wsgi