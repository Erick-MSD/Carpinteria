// Para login.html
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Verificar que ambos campos estén completos
            if (!email || !password) {
                alert('Por favor, completa todos los campos');
                return;
            }
            
            // Verificar credenciales contra localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Guardar sesión del usuario
                sessionStorage.setItem('currentUser', JSON.stringify({
                    name: user.name,
                    email: user.email
                }));
                
                alert('Inicio de sesión exitoso');
                window.location.href = 'dashboard.html'; // Redireccionar a la página principal después del login
            } else {
                alert('Correo electrónico o contraseña incorrectos');
            }
        });
    }
});