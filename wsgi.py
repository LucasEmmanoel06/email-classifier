from app import create_app

# WSGI entrypoint for production servers (e.g., Waitress, Gunicorn, uWSGI)
application = create_app()

# Optional: expose `app` alias too for compatibility
app = application
