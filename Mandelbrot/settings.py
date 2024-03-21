from pathlib import Path
from datetime import timedelta
import os
import environ


ENV = environ.Env()


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = ENV('SECRET_KEY')



# SECURITY WARNING: don't run with debug turned on in production!
IS_HEROKU_APP = "DYNO" in os.environ and not "CI" in os.environ

if IS_HEROKU_APP:
    DEBUG = False
else:
    DEBUG = True

if IS_HEROKU_APP:
    ALLOWED_HOSTS = ['saifchan-website-5405fadf9541.herokuapp.com', 'saifchan.online']

else:
    ALLOWED_HOSTS = []

# Application definition

INSTALLED_APPS = [
    'authentication',
    'whitenoise',
    'whitenoise.runserver_nostatic',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'corsheaders',
    

    'sessions_manager',
    'learning_tracker',
    'entertainment',
    'tasks',
    'goals',

    'rest_framework',
    'rest_framework_simplejwt.token_blacklist',
    'rest_framework.authtoken',
    'dj_rest_auth',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.github'
    
    
    
]

SITE_ID = 2

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',

    'allauth.account.middleware.AccountMiddleware'
]

CLIENT_ID = ENV('GOOGLE_CLIENT_ID')
CLIENT_SECRET = ENV('GOOGLE_CLIENT_SECRET')
GITHUB_CLIENT_ID = ENV('GITHUB_CLIENT_ID')
GITHUB_CLIENT_SECRET = ENV('GITHUB_CLIENT_SECRET')

CORS_ALLOW_PRIVATE_NETWORK = False

if IS_HEROKU_APP:
    CORS_ALLOWED_ORIGINS = [
        'https://saifchan.online'
    ]
else:

    CORS_ALLOWED_ORIGINS = [
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://127.0.0.1:8000',
        'http://localhost:8000',
        'chrome-extension://chaepekccofhljddepeknooibilbohob'
    ]


if IS_HEROKU_APP:


    CSRF_TRUSTED_ORIGINS = [
        'https://saifchan.online'
    ]
else:
    CSRF_TRUSTED_ORIGINS = [
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://127.0.0.1:8000',
        'http://localhost:8000',
        'chrome-extension://chaepekccofhljddepeknooibilbohob'
    ]

CORS_ALLOW_METHODS = (
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
)

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

SECURE_CROSS_ORIGIN_OPENER_POLICY = 'same-origin-allow-popups'

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication'

    ]
}

AUTHENTICATION_BACKENDS = ['authentication.models.EmailModelBackend']

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=365),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": False,
    "UPDATE_LAST_LOGIN": False,

    "ALGORITHM": "HS256",
    "VERIFYING_KEY": "",
    "AUDIENCE": None,
    "ISSUER": None,
    "JSON_ENCODER": None,
    "JWK_URL": None,
    "LEEWAY": 0,

    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",

    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",

    "JTI_CLAIM": "jti",
    "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",
    "SLIDING_TOKEN_LIFETIME": timedelta(minutes=5),
    "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),

    "TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainPairSerializer",
    "TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSerializer",
    "TOKEN_VERIFY_SERIALIZER": "rest_framework_simplejwt.serializers.TokenVerifySerializer",
    "TOKEN_BLACKLIST_SERIALIZER": "rest_framework_simplejwt.serializers.TokenBlacklistSerializer",
    "SLIDING_TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainSlidingSerializer",
    "SLIDING_TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSlidingSerializer",
}

ROOT_URLCONF = 'Mandelbrot.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'FrontEnd/')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'Mandelbrot.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

if IS_HEROKU_APP:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': ENV('PG_NAME'), 
            'USER': ENV('PG_USER'),
            'PASSWORD': ENV('PG_PASSWORD'),
            'HOST': ENV('PG_HOST'), 
            'PORT': ENV('PG_PORT'),
        }
    }

else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_ROOT = os.path.join(BASE_DIR ,'staticfiles')
STATIC_URL = '/assets/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'FrontEnd/sessions-manager/dist/assets'),
    os.path.join(BASE_DIR, 'FrontEnd/learning-tracker/dist/assets'),
    os.path.join(BASE_DIR, 'FrontEnd/entertainment/dist/assets'),
    os.path.join(BASE_DIR, 'FrontEnd/goals/dist/assets'),
    os.path.join(BASE_DIR, 'FrontEnd/home-tasks/dist/assets'),
    os.path.join(BASE_DIR, 'FrontEnd/website-home/dist/assets')
    
]

STORAGES = {
    'staticfiles': {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"
    }
} 

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# LOGIN_REDIRECT_URL = '/'
# LOGOUT_REDIRECT_URL = '/'
ACCOUNT_EMAIL_VERIFICATION = "none"