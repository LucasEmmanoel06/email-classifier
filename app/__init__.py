from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

def create_app():
    """Factory function para criar a aplicação Flask"""
    load_dotenv()
    
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', 'uploads')
    app.config['MAX_CONTENT_LENGTH'] = int(os.getenv('MAX_CONTENT_LENGTH', 16777216))
    
    # Configurar CORS
    CORS(app)
    
    # Registrar rotas
    from app.routes import main
    app.register_blueprint(main)
    
    return app