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
        text_content = None
        file_paths = []
        
        # Coletar texto direto se fornecido
        if 'email_text' in request.form and request.form['email_text'].strip():
            text_content = request.form['email_text']
        
        # Coletar arquivos se fornecidos
        if 'file' in request.files:
            files = request.files.getlist('file')
            for file in files:
                if file.filename != '' and allowed_file(file.filename):
                    filename = secure_filename(file.filename)
                    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                    file.save(filepath)
                    file_paths.append(filepath)
                elif file.filename != '':
                    # Limpar arquivos salvos em caso de erro
                    for fp in file_paths:
                        if os.path.exists(fp):
                            os.remove(fp)
                    return jsonify({'error': f'Arquivo com formato não suportado: {file.filename}'}), 400
        
        # Verificar se há pelo menos algum conteúdo
        if not text_content and not file_paths:
            return jsonify({'error': 'Nenhum conteúdo fornecido. Insira texto ou anexe arquivos.'}), 400
        
        # Processar conteúdo combinado
        try:
            email_content = email_processor.process_email_content(
                text_content=text_content,
                file_paths=file_paths
            )
        except ValueError as e:
            return jsonify({'error': str(e)}), 400
        finally:
            # Limpar arquivos temporários
            for filepath in file_paths:
                if os.path.exists(filepath):
                    os.remove(filepath)
        
        # Classificar o email
        classification_result = ai_classifier.classify_email(email_content)
        
        return jsonify(classification_result)
        
    except Exception as e:
        # Limpar arquivos em caso de erro inesperado
        for filepath in file_paths:
            if os.path.exists(filepath):
                os.remove(filepath)
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@main.route('/health')
def health_check():
    """Endpoint para verificar se a aplicação está funcionando"""
    return jsonify({'status': 'healthy', 'message': 'Email Classifier está funcionando!'})