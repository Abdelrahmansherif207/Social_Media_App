const loginForm = document.getElementById("login-form");
const error = document.getElementById("error");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();

        if (response.ok && data.token) {
            localStorage.setItem("authorization", `Bearer ${data.token}`);
            window.location.href = "/";
        } else {
            error.textContent = "Invalid email or password";
            error.style.color = "red";
        }
    } catch (error) {
        console.error("Failed to login user:", error);
    }
});
