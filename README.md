# Email Classifier Assistant

Uma aplicação web para classificação automática de emails usando I.A.

## 📋 Funcionalidades

- **Classificação Automática**: Classifica emails como "Produtivo" ou "Improdutivo"
- **Sugestão de Respostas**: Gera respostas automáticas baseadas na classificação
- **Múltiplos Formatos**: Suporta upload de arquivos .txt, .pdf e .docx
- **Interface Intuitiva**: Design moderno e responsivo

## 🚀 Como Executar

### 1. Configurar o Ambiente

```bash
# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt
```

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
copy .env.example .env
```
Edite o arquivo .env com suas configurações.
**Especialmente importante: GEMINI_API_KEY**

[🔑 Veja como configurar sua chave de API](#chaves-de-api)

### 3. Executar a Aplicação

```bash
python run.py
```

A aplicação estará disponível em: http://localhost:5000

## 🏗️ Estrutura do Projeto

```
email-classifier-assistant/
│
├── app/
│   ├── __init__.py              # Factory da aplicação Flask
│   ├── routes.py                # Rotas da aplicação
│   ├── services/
│   │   ├── email_processor.py   # Processamento de emails e arquivos
│   │   └── ai_classifier.py     # Classificação usando IA
│   ├── templates/
│   │   └── index.html           # Interface principal
│   └── static/
│       ├── css/
│       │   └── style.css        # Estilos da aplicação
│       └── js/
│           └── script.js        # Lógica do frontend
│
├── uploads/                     # Diretório para arquivos temporários
├── requirements.txt             # Dependências Python
├── .env.example                 # Exemplo de configurações
└── run.py                       # Ponto de entrada da aplicação
```

## 🛠️ Tecnologias Utilizadas

- **Backend**: Flask, Google Gemini API, PyPDF2, python-docx
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **IA**: Google Gemini 2.5 Flash (com fallback para classificação baseada em keywords)

## 📝 Configurações Importantes

### Chaves de API
- Configure sua `GEMINI_API_KEY` no arquivo `.env`
- Obtenha sua chave gratuita em: https://aistudio.google.com/app/apikey
- Sem a API key, o sistema usará classificação baseada em palavras-chave