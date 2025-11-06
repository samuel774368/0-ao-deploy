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
registerForm.addEventListener('submit', (e) => {
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
    
    // Verificar se o usuário já existe
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.find(u => u.email === email);
    
    if (userExists) {
        alert('❌ Este e-mail já está cadastrado!');
        return;
    }
    
    // Criar novo usuário
    const newUser = {
        id: Date.now(),
        name,
        email,
        password, // Em produção, isso deveria ser criptografado!
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('✅ Conta criada com sucesso! Faça login para continuar.');
    
    // Voltar para o formulário de login
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    registerForm.reset();
});

// Processar login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Buscar usuários
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        alert('❌ E-mail ou senha incorretos!');
        return;
    }
    
    // Salvar usuário logado
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Redirecionar para dashboard
    window.location.href = 'dashboard.html';
});

// Verificar se já está logado ao carregar a página
window.addEventListener('load', () => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser && window.location.pathname.includes('index.html')) {
        window.location.href = 'dashboard.html';
    }
});
