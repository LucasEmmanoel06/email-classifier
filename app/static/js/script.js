// Elementos DOM
const emailForm = document.getElementById('emailForm');
const emailText = document.getElementById('emailText');
const fileUpload = document.getElementById('fileUpload');
const fileUploadArea = document.getElementById('fileUploadArea');
const fileName = document.getElementById('fileName');
const classifyBtn = document.getElementById('classifyBtn');
const resultsSection = document.getElementById('resultsSection');
const errorSection = document.getElementById('errorSection');

// Configurar upload de arquivos
fileUploadArea.addEventListener('click', () => fileUpload.click());

fileUpload.addEventListener('change', handleFileSelect);

// Drag and drop
fileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadArea.classList.add('dragover');
});

fileUploadArea.addEventListener('dragleave', () => {
    fileUploadArea.classList.remove('dragover');
});

fileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileUpload.files = files;
        handleFileSelect();
    }
});

// Limpar campo de texto quando arquivo for selecionado
fileUpload.addEventListener('change', () => {
    if (fileUpload.files.length > 0) {
        emailText.value = '';
    }
});

// Limpar arquivo quando texto for digitado
emailText.addEventListener('input', () => {
    if (emailText.value.trim()) {
        fileUpload.value = '';
        fileName.style.display = 'none';
    }
});

// Função para lidar com seleção de arquivo
function handleFileSelect() {
    const file = fileUpload.files[0];
    if (file) {
        fileName.textContent = `📄 ${file.name} (${formatFileSize(file.size)})`;
        fileName.style.display = 'block';
        emailText.value = ''; // Limpar texto quando arquivo for selecionado
    } else {
        fileName.style.display = 'none';
    }
}

// Formatar tamanho do arquivo
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Submissão do formulário
emailForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validação
    const hasText = emailText.value.trim();
    const hasFile = fileUpload.files.length > 0;
    
    if (!hasText && !hasFile) {
        showError('Por favor, insira o texto do email ou faça upload de um arquivo.');
        return;
    }
    
    // Estado de loading
    setLoadingState(true);
    hideResults();
    
    try {
        // Preparar dados do formulário
        const formData = new FormData();
        
        if (hasText) {
            formData.append('email_text', emailText.value);
        }
        
        if (hasFile) {
            formData.append('file', fileUpload.files[0]);
        }
        
        // Fazer requisição
        const response = await fetch('/classify', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Erro na classificação');
        }
        
        // Mostrar resultados
        showResults(result);
        
    } catch (error) {
        showError(error.message || 'Erro interno do servidor');
    } finally {
        setLoadingState(false);
    }
});

// Função para mostrar resultados
function showResults(result) {
    hideError();
    
    // Classificação
    const classificationText = document.getElementById('classificationText');
    const classificationBadge = document.getElementById('classificationBadge');
    
    classificationText.textContent = result.classification.toUpperCase();
    classificationBadge.className = `classification-badge ${result.classification}`;
    
    // Resposta sugerida
    const responseText = document.getElementById('responseText');
    responseText.textContent = result.suggested_response || 'Nenhuma resposta gerada.';
    
    // Conteúdo original
    const originalText = document.getElementById('originalText');
    originalText.textContent = result.original_content || 'Não disponível.';
    
    // Mostrar seção de resultados
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Função para mostrar erro
function showError(message) {
    hideResults();
    
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    
    errorSection.style.display = 'block';
    errorSection.scrollIntoView({ behavior: 'smooth' });
}

// Funções auxiliares
function hideResults() {
    resultsSection.style.display = 'none';
}

function hideError() {
    errorSection.style.display = 'none';
}

function setLoadingState(loading) {
    classifyBtn.disabled = loading;
    
    if (loading) {
        classifyBtn.querySelector('.btn-text').style.display = 'none';
        classifyBtn.querySelector('.btn-loading').style.display = 'inline';
    } else {
        classifyBtn.querySelector('.btn-text').style.display = 'inline';
        classifyBtn.querySelector('.btn-loading').style.display = 'none';
    }
}

// Copiar resposta
document.getElementById('copyResponseBtn').addEventListener('click', () => {
    const responseText = document.getElementById('responseText').textContent;
    
    navigator.clipboard.writeText(responseText).then(() => {
        const btn = document.getElementById('copyResponseBtn');
        const originalText = btn.textContent;
        
        btn.textContent = 'Copiado! ✓';
        btn.style.background = '#48bb78';
        btn.style.color = 'white';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.color = '';
        }, 2000);
    }).catch(() => {
        alert('Erro ao copiar texto. Tente selecionar e copiar manualmente.');
    });
});