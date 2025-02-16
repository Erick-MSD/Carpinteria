document.addEventListener("DOMContentLoaded", function () {
    // Evento para el formulario de inicio de sesión
    document.getElementById("loginForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo: email, password: password })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Inicio de sesión exitoso");
            localStorage.setItem("token", data.token); // Guarda el token
            window.location.href = "/perfil"; // Redirige a perfil (ajusta según necesidad)
        } else {
            alert(data.message);
        }
    });

    // Evento para el formulario de registro
    document.getElementById("registerForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const nombre = document.getElementById("registerName").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        const response = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, correo: email, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Registro exitoso, ahora inicia sesión.");
            showLogin(); // Cambia la pestaña al login
        } else {
            alert(data.message);
        }
    });
});
