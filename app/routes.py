from flask import Blueprint, render_template, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
from app.services.email_processor import EmailProcessor
from app.services.ai_classifier import AIClassifier

main = Blueprint('main', __name__)

# Instanciar os serviços
email_processor = EmailProcessor()
ai_classifier = AIClassifier()

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx'}

def allowed_file(filename):
    """Verifica se o arquivo tem extensão permitida"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@main.route('/')
def index():
    """Página principal"""
    return render_template('index.html')

@main.route('/classify', methods=['POST'])
def classify_email():
    """Endpoint para classificar emails"""
    try:
        email_content = ""
        
        # Verificar se é texto direto ou arquivo
        if 'email_text' in request.form and request.form['email_text'].strip():
            email_content = request.form['email_text']
        elif 'file' in request.files:
            file = request.files['file']
            if file.filename != '' and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                
                # Processar o arquivo
                email_content = email_processor.extract_text_from_file(filepath)
                
                # Remover arquivo após processamento (opcional)
                os.remove(filepath)
            else:
                return jsonify({'error': 'Arquivo inválido'}), 400
        else:
            return jsonify({'error': 'Nenhum conteúdo fornecido'}), 400
        
        if not email_content.strip():
            return jsonify({'error': 'Conteúdo do email está vazio'}), 400
        
        # Classificar o email
        classification_result = ai_classifier.classify_email(email_content)
        
        return jsonify(classification_result)
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@main.route('/health')
def health_check():
    """Endpoint para verificar se a aplicação está funcionando"""
    return jsonify({'status': 'healthy', 'message': 'Email Classifier está funcionando!'})