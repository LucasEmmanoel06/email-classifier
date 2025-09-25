# Email Classifier Assistant

Uma aplicação web para classificação automática de emails usando Inteligência Artificial.

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

# Ativar ambiente virtual (Windows)
venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt
```

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
copy .env.example .env

# Editar .env com suas configurações
# Especialmente importante: GEMINI_API_KEY
```

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

## 🔧 Próximos Passos para Desenvolvimento

### Backend (`app/services/`)
- [ ] Implementar processamento NLP mais avançado
- [ ] Adicionar mais modelos de IA (Hugging Face)
- [ ] Implementar sistema de cache para classificações
- [ ] Adicionar logging e monitoramento

### Frontend (`app/templates/` e `app/static/`)
- [ ] Adicionar mais feedbacks visuais
- [ ] Implementar histórico de classificações
- [ ] Adicionar exportação de resultados
- [ ] Melhorar responsividade mobile

### Funcionalidades Adicionais
- [ ] Sistema de treinamento personalizado
- [ ] API REST para integração externa
- [ ] Dashboard de estatísticas
- [ ] Integração com email providers

## 🛠️ Tecnologias Utilizadas

- **Backend**: Flask, Google Gemini API, PyPDF2, python-docx
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **IA**: Google Gemini 1.5 Flash (com fallback para classificação baseada em keywords)
- **Processamento**: NLTK, spaCy (opcional)

## 📝 Configurações Importantes

### API Keys
- Configure sua `GEMINI_API_KEY` no arquivo `.env`
- Obtenha sua chave gratuita em: https://aistudio.google.com/app/apikey
- Sem a API key, o sistema usará classificação baseada em palavras-chave