const user = JSON.parse(localStorage.getItem("user"));
if (!user || !user._id) {
  alert("You must log in first.");
  window.location.href = "index.html";
} else {
  document.getElementById("welcome-message").textContent = `Welcome, ${user.name}!`;
}

let tasks = [];

async function fetchTasks() {
  try {
    const res = await fetch(`http://localhost:5000/api/tasks/${user._id}`);
    tasks = await res.json();
    renderTasks();
  } catch (err) {
    console.error("Error fetching tasks:", err);
  }
}

function renderTasks() {
  const pendingList = document.getElementById("task-list");
  const completedList = document.getElementById("completed-list");
  const pendingMsg = document.getElementById("pending-msg");
  const completedMsg = document.getElementById("completed-msg");

  pendingList.innerHTML = "";
  completedList.innerHTML = "";
  pendingMsg.innerHTML = "";
  completedMsg.innerHTML = "";

  if (!Array.isArray(tasks)) {
    pendingMsg.innerHTML = "<p>Error loading tasks</p>";
    return;
  }

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  // Pending
  if (pendingTasks.length === 0) {
    pendingMsg.innerHTML = "<p>No tasks left</p>";
  } else {
    pendingTasks.forEach(task => {
      const li = createTaskItem(task);
      pendingList.appendChild(li);
    });
  }

  // Completed
  if (completedTasks.length === 0) {
    completedMsg.innerHTML = "<p>0 tasks completed</p>";
  } else {
    completedMsg.innerHTML = `<p>${completedTasks.length} task(s) completed</p>`;
    completedTasks.forEach(task => {
      const li = createTaskItem(task);
      completedList.appendChild(li);
    });
  }
}

function createTaskItem(task) {
  const li = document.createElement("li");

  const textSpan = document.createElement("span");
  textSpan.textContent = task.text;

  // Complete or Return button
  const completeBtn = document.createElement("button");
  if (!task.completed) {
    completeBtn.textContent = "✔";
    completeBtn.className = "complete-btn";
    completeBtn.title = "Mark as completed";
    completeBtn.onclick = (e) => {
      e.stopPropagation();
      toggleComplete(task._id, true);
    };
  } else {
    completeBtn.textContent = "↑";
    completeBtn.className = "return-btn";
    completeBtn.title = "Return to pending";
    completeBtn.onclick = (e) => {
      e.stopPropagation();
      toggleComplete(task._id, false);
    };
  }

  // Delete button
  const delBtn = document.createElement("button");
  delBtn.textContent = "×";
  delBtn.className = "delete-btn";
  delBtn.title = "Delete task";
  delBtn.onclick = (e) => {
    e.stopPropagation();
    deleteTask(task._id);
  };

  if (task.completed) {
    textSpan.style.textDecoration = "line-through";
    textSpan.style.opacity = "0.6";
  }

  li.appendChild(textSpan);
  li.appendChild(completeBtn);
  li.appendChild(delBtn);

  return li;
}

async function addTask() {
  const input = document.getElementById("task-input");
  const text = input.value.trim();
  if (text) {
    await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id, text })
    });
    input.value = "";
    fetchTasks();
  }
}

async function deleteTask(taskId) {
  if (confirm("Delete this task?")) {
    await fetch(`http://localhost:5000/api/tasks/${taskId}`, { method: "DELETE" });
    fetchTasks();
  }
}

async function toggleComplete(taskId, completed) {
  await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed })
  });
  fetchTasks();
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

document.getElementById("task-input").addEventListener("keypress", function(e) {
  if (e.key === "Enter") addTask();
});

fetchTasks();
