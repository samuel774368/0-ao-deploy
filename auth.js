// Configuração da API
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';

// Elementos do DOM
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');

// Alternar entre formulários de login e registro
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Processar registro de novo usuário
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Validações
    if (password !== confirmPassword) {
        alert('❌ As senhas não coincidem!');
        return;
    }
    
    if (password.length < 6) {
        alert('❌ A senha deve ter pelo menos 6 caracteres!');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Salvar token
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            alert('✅ Conta criada com sucesso!');
            
            // Redirecionar para dashboard
            window.location.href = 'dashboard.html';
        } else {
            alert(`❌ ${data.message}`);
        }
    } catch (error) {
        console.error('Erro ao registrar:', error);
        alert('❌ Erro ao criar conta. Tente novamente.');
    }
});

// Processar login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Salvar token e dados do usuário
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirecionar para dashboard
            window.location.href = 'dashboard.html';
        } else {
            alert(`❌ ${data.message}`);
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('❌ Erro ao fazer login. Tente novamente.');
    }
});

// Verificar se já está logado ao carregar a página
window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    if (token && (window.location.pathname === '/' || window.location.pathname.includes('index.html'))) {
        window.location.href = 'dashboard.html';
    }
});
