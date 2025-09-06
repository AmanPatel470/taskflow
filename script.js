function toggleBox() {
    const loginBox = document.getElementById("login-box");
    const registerBox = document.getElementById("register-box");
  
    if (loginBox.style.display === "none") {
      loginBox.style.display = "block";
      registerBox.style.display = "none";
    } else {
      loginBox.style.display = "none";
      registerBox.style.display = "block";
    }
  }
  
  function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
  
    fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then(res => res.json())
      .then(data => {
        console.log("Login response:", data);
        if (data._id) {  // check if user object returned directly
          localStorage.setItem("user", JSON.stringify(data));
          window.location.href = "dashboard.html";
        } else {
          alert(data.message || "Login failed");
        }
      })
      .catch(err => {
        console.error("Login error:", err);
        alert("Login request failed");
      });
  }
   
  
  function register() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
  
    console.log("Register with:", name, email, password);
  
    // 🚀 Actually send data to backend:
    fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    })
      .then(res => res.json())
      .then(data => {
        console.log("Response from backend:", data);
        alert(data.message);   // Show success or error from backend
      })
      .catch(err => {
        console.error("Error:", err);
      });
  }
  