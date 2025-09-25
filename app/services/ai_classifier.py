import os
from google import genai
from dotenv import load_dotenv

class AIClassifier:
    """Classe responsável pela classificação de emails usando IA"""
    
    def __init__(self):
        load_dotenv()
        self.api_key = os.getenv('GEMINI_API_KEY')
        self.model_name = os.getenv('AI_MODEL')
        self.client = None
        self.model = None
        
        if self.api_key:
            self.client = genai.Client(api_key=self.api_key)
            self.model = self.model_name
        else:
            self.model = None
    
    def classify_email(self, email_content):
        """
        Classifica um email e gera resposta automática
        
        Args:
            email_content (str): Conteúdo do email
            
        Returns:
            dict: Resultado da classificação com categoria e resposta sugerida
        """
        try:
            # Classificar email
            classification = self._classify_content(email_content)
            
            # Gerar resposta automática
            suggested_response = self._generate_response(email_content, classification)
            
            return {
                'classification': classification,
                'suggested_response': suggested_response,
                'original_content': email_content[:200] + "..." if len(email_content) > 200 else email_content
            }
            
        except Exception as e:
            return {
                'error': f"Erro na classificação: {str(e)}",
                'classification': 'unknown',
                'suggested_response': 'Não foi possível gerar uma resposta automática.',
                'original_content': email_content[:200] + "..." if len(email_content) > 200 else email_content
            }
    
    def _classify_content(self, content):
        """
        Classifica o conteúdo do email
        
        Args:
            content (str): Conteúdo do email
            
        Returns:
            str: Classificação ('produtivo' ou 'improdutivo')
        """
        if not self.api_key or not self.model:
            # Fallback: classificação baseada em palavras-chave
            return self._fallback_classification(content)
        
        try:
            prompt = f"""
            Classifique este email em uma das duas categorias:
            
            - PRODUTIVO: Emails que requerem uma ação ou resposta específica (solicitações de suporte, dúvidas técnicas, atualizações de status, etc.)
            - IMPRODUTIVO: Emails que não necessitam de uma ação imediata (felicitações, agradecimentos, mensagens sociais, etc.)
            
            Email para classificação:
            "{content}"
            
            Responda apenas com: PRODUTIVO ou IMPRODUTIVO
            """
            
            # Usar o client para gerar conteúdo com o modelo
            response = self.client.models.generate_content(
                model=self.model,
                contents=[prompt]
            )
            classification = response.text.strip().upper()
            
            if classification in ['PRODUTIVO', 'IMPRODUTIVO']:
                return classification.lower()
            else:
                return 'produtivo'  # Default
                
        except Exception as e:
            print(f"Erro na classificação com Gemini: {e}")
            return self._fallback_classification(content)
    
    def _generate_response(self, content, classification):
        """
        Gera resposta automática baseada na classificação
        
        Args:
            content (str): Conteúdo original do email
            classification (str): Classificação do email
            
        Returns:
            str: Resposta sugerida
        """
        if not self.api_key or not self.model:
            return self._fallback_response(classification)
        
        try:
            if classification == 'produtivo':
                prompt = f"""
                Gere uma resposta profissional e útil para este email classificado como PRODUTIVO.
                A resposta deve reconhecer a solicitação e indicar que será tratada adequadamente.
                
                Email original:
                "{content}"
                
                Gere uma resposta em português, formal e concisa (máximo 3 parágrafos).
                """
            else:
                prompt = f"""
                Gere uma resposta cordial para este email classificado como IMPRODUTIVO.
                A resposta deve ser amigável e agradecida.
                
                Email original:
                "{content}"
                
                Gere uma resposta em português, cordial e breve (máximo 2 parágrafos).
                """
            
            # Usar o client para gerar conteúdo com o modelo
            response = self.client.models.generate_content(
                model=self.model,
                contents=[prompt]
            )
            return response.text.strip()
            
        except Exception as e:
            print(f"Erro na geração de resposta com Gemini: {e}")
            return self._fallback_response(classification)
    
    def _fallback_classification(self, content):
        """Classificação baseada em palavras-chave quando API não está disponível"""
        productive_keywords = [
            'dúvida', 'problema', 'erro', 'suporte', 'ajuda', 'questão',
            'solicitação', 'requisição', 'status', 'atualização', 'urgente',
            'prazo', 'pendência', 'ticket', 'chamado'
        ]
        
        content_lower = content.lower()
        
        for keyword in productive_keywords:
            if keyword in content_lower:
                return 'produtivo'
        
        return 'improdutivo'
    
    def _fallback_response(self, classification):
        """Respostas padrão quando API não está disponível"""
        if classification == 'produtivo':
            return """
            Obrigado pelo seu contato.
            
            Recebemos sua solicitação e ela será analisada pela nossa equipe. 
            Retornaremos com uma resposta assim que possível.
            
            Atenciosamente,
            Equipe de Suporte
            """
        else:
            return """
            Obrigado pela sua mensagem!
            
            Ficamos felizes em receber seu contato.
            
            Atenciosamente,
            Equipe
            """