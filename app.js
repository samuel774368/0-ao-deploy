// Configuração da API
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';

// Verificar autenticação
const token = localStorage.getItem('token');
const currentUser = JSON.parse(localStorage.getItem('user'));

if (!token || !currentUser) {
    window.location.href = 'index.html';
}

// Elementos do DOM
const userNameElement = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const tasksList = document.getElementById('tasksList');
const emptyState = document.getElementById('emptyState');
const filterTabs = document.querySelectorAll('.filter-tab');

// Estatísticas
const totalTasksElement = document.getElementById('totalTasks');
const completedTasksElement = document.getElementById('completedTasks');
const pendingTasksElement = document.getElementById('pendingTasks');

// Variáveis
let tasks = [];
let currentFilter = 'all';

// Inicializar
userNameElement.textContent = currentUser.name;
loadTasks();
renderTasks();
updateStats();

// Logout
logoutBtn.addEventListener('click', () => {
    if (confirm('Deseja realmente sair?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }
});

// Adicionar tarefa
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const taskText = taskInput.value.trim();
    
    if (!taskText) return;
    
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text: taskText })
        });
        
        const data = await response.json();
        
        if (data.success) {
            await loadTasks();
            taskInput.value = '';
            taskInput.focus();
        } else {
            alert(`❌ ${data.message}`);
        }
    } catch (error) {
        console.error('Erro ao adicionar tarefa:', error);
        alert('❌ Erro ao adicionar tarefa. Tente novamente.');
    }
});

// Carregar tarefas do servidor
async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            tasks = data.tasks.map(task => ({
                id: task._id,
                text: task.text,
                completed: task.completed,
                createdAt: task.createdAt
            }));
            renderTasks();
            updateStats();
        }
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        alert('❌ Erro ao carregar tarefas.');
    }
}

// Salvar tarefas (não usado mais, tudo é via API)
function saveTasks() {
    // Função mantida para compatibilidade, mas não faz nada
}

// Renderizar tarefas
function renderTasks() {
    let filteredTasks = tasks;
    
    if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    }
    
    // Ordenar por data (mais recente primeiro)
    filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    if (filteredTasks.length === 0) {
        tasksList.innerHTML = '';
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        tasksList.innerHTML = filteredTasks.map(task => createTaskElement(task)).join('');
        
        // Adicionar event listeners
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', toggleTask);
        });
        
        document.querySelectorAll('.task-delete').forEach(btn => {
            btn.addEventListener('click', deleteTask);
        });
    }
}

// Criar elemento HTML da tarefa
function createTaskElement(task) {
    const date = new Date(task.createdAt);
    const formattedDate = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    return `
        <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                data-id="${task.id}"
            >
            <span class="task-text">${escapeHtml(task.text)}</span>
            <span class="task-date">${formattedDate}</span>
            <button class="task-delete" data-id="${task.id}">Excluir</button>
        </div>
    `;
}

// Alternar estado da tarefa (completada/pendente)
async function toggleTask(e) {
    const taskId = e.target.dataset.id;
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        try {
            const response = await fetch(`${API_URL}/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ completed: !task.completed })
            });
            
            const data = await response.json();
            
            if (data.success) {
                await loadTasks();
            } else {
                alert(`❌ ${data.message}`);
            }
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
            alert('❌ Erro ao atualizar tarefa.');
        }
    }
}

// Excluir tarefa
async function deleteTask(e) {
    const taskId = e.target.dataset.id;
    
    if (confirm('Deseja realmente excluir esta tarefa?')) {
        try {
            const response = await fetch(`${API_URL}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                await loadTasks();
            } else {
                alert(`❌ ${data.message}`);
            }
        } catch (error) {
            console.error('Erro ao deletar tarefa:', error);
            alert('❌ Erro ao deletar tarefa.');
        }
    }
}

// Atualizar estatísticas
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    
    totalTasksElement.textContent = total;
    completedTasksElement.textContent = completed;
    pendingTasksElement.textContent = pending;
}

// Filtros
filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.filter;
        renderTasks();
    });
});

// Função para escapar HTML (prevenir XSS)
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Atalho de teclado para focar no input
document.addEventListener('keydown', (e) => {
    if (e.key === 'n' && e.ctrlKey) {
        e.preventDefault();
        taskInput.focus();
    }
});
