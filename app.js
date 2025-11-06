// Verificar autenticação
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser) {
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
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
});

// Adicionar tarefa
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const taskText = taskInput.value.trim();
    
    if (!taskText) return;
    
    const newTask = {
        id: Date.now(),
        userId: currentUser.id,
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateStats();
    
    taskInput.value = '';
    taskInput.focus();
});

// Carregar tarefas do localStorage
function loadTasks() {
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks = allTasks.filter(task => task.userId === currentUser.id);
}

// Salvar tarefas no localStorage
function saveTasks() {
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const otherUsersTasks = allTasks.filter(task => task.userId !== currentUser.id);
    const updatedTasks = [...otherUsersTasks, ...tasks];
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
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
function toggleTask(e) {
    const taskId = parseInt(e.target.dataset.id);
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// Excluir tarefa
function deleteTask(e) {
    const taskId = parseInt(e.target.dataset.id);
    
    if (confirm('Deseja realmente excluir esta tarefa?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        renderTasks();
        updateStats();
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
