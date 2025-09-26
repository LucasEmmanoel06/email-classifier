// Elementos DOM
const emailForm = document.getElementById('emailForm');
const emailText = document.getElementById('emailText');
const fileUpload = document.getElementById('fileUpload');
const fileUploadArea = document.getElementById('fileUploadArea');
const fileList = document.getElementById('fileList');
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

// Não mais necessário limpar campos - agora permitimos ambos

// Função para lidar com seleção de arquivos (múltiplos)
function handleFileSelect() {
    const files = fileUpload.files;
    displayFileList(files);
}

// Função para exibir lista de arquivos selecionados
function displayFileList(files) {
    fileList.innerHTML = '';
    
    if (files.length === 0) {
        fileList.style.display = 'none';
        return;
    }
    
    fileList.style.display = 'block';
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span class="file-info">
                📄 ${file.name} (${formatFileSize(file.size)})
            </span>
            <button type="button" class="remove-file-btn" onclick="removeFile(${i})">✕</button>
        `;
        fileList.appendChild(fileItem);
    }
}

// Função para remover arquivo específico
function removeFile(index) {
    const dt = new DataTransfer();
    const files = fileUpload.files;
    
    for (let i = 0; i < files.length; i++) {
        if (i !== index) {
            dt.items.add(files[i]);
        }
    }
    
    fileUpload.files = dt.files;
    displayFileList(fileUpload.files);
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
    const hasFiles = fileUpload.files.length > 0;
    
    if (!hasText && !hasFiles) {
        showError('Por favor, insira o texto do email e/ou faça upload de arquivos.');
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
        
        if (hasFiles) {
            for (let i = 0; i < fileUpload.files.length; i++) {
                formData.append('file', fileUpload.files[i]);
            }
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
    
    // Método de classificação
    const classificationMethod = document.getElementById('classificationMethod');
    const methodText = getMethodText(result.classification_method);
    classificationMethod.textContent = methodText;
    classificationMethod.className = `method-badge ${result.classification_method}`;
    
    // Resposta sugerida
    const responseText = document.getElementById('responseText');
    responseText.textContent = result.suggested_response || 'Nenhuma resposta gerada.';
    
    // Método da resposta
    const responseMethod = document.getElementById('responseMethod');
    const responseMethodText = getMethodText(result.response_method);
    responseMethod.textContent = responseMethodText;
    responseMethod.className = `method-badge ${result.response_method}`;
    
    // Conteúdo original
    const originalText = document.getElementById('originalText');
    originalText.textContent = result.original_content || 'Não disponível.';
    
    // Mostrar seção de resultados
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Função para converter código do método em texto legível
function getMethodText(method) {
    switch(method) {
        case 'ai':
            return '🤖 Inteligência Artificial';
        case 'keywords':
            return '🔍 Palavras-chave';
        case 'template':
            return '📝 Template padrão';
        case 'erro':
            return '❌ Erro';
        default:
            return '❓ Desconhecido';
    }
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
        const originalHTML = btn.innerHTML;
        
        // Mudança visual para indicar sucesso
        btn.classList.add('copied');
        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
        `;
        btn.title = 'Copiado!';
        
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = originalHTML;
            btn.title = 'Copiar resposta';
        }, 2000);
    }).catch(() => {
        alert('Erro ao copiar texto. Tente selecionar e copiar manualmente.');
    });
});