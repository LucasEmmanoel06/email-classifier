import os
import PyPDF2
from docx import Document

class EmailProcessor:
    """Classe responsável pelo processamento de emails e extração de texto"""
    
    def __init__(self):
        pass
    
    def extract_text_from_file(self, filepath):
        """
        Extrai texto de diferentes tipos de arquivo
        
        Args:
            filepath (str): Caminho para o arquivo
            
        Returns:
            str: Texto extraído do arquivo
        """
        file_extension = filepath.split('.')[-1].lower()
        
        if file_extension == 'txt':
            return self._extract_from_txt(filepath)
        elif file_extension == 'pdf':
            return self._extract_from_pdf(filepath)
        elif file_extension == 'docx':
            return self._extract_from_docx(filepath)
        else:
            raise ValueError(f"Formato de arquivo não suportado: {file_extension}")
    
    def _extract_from_txt(self, filepath):
        """Extrai texto de arquivo .txt"""
        with open(filepath, 'r', encoding='utf-8') as file:
            return file.read()
    
    def _extract_from_pdf(self, filepath):
        """Extrai texto de arquivo .pdf"""
        text = ""
        with open(filepath, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text()
        return text
    
    def _extract_from_docx(self, filepath):
        """Extrai texto de arquivo .docx"""
        doc = Document(filepath)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    
    def preprocess_text(self, text):
        """
        Pré-processa o texto do email
        
        Args:
            text (str): Texto bruto do email
            
        Returns:
            str: Texto pré-processado
        """
        # Remover caracteres especiais excessivos
        text = text.strip()
        
        # Remover múltiplas quebras de linha
        text = '\n'.join([line.strip() for line in text.split('\n') if line.strip()])
        
        return text