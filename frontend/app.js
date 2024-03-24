document.addEventListener("DOMContentLoaded", fetchTasks);
document.getElementById("taskForm").addEventListener("submit", addTask);

function fetchTasks() {
  fetch("http://localhost:3000/tasks")
    .then((response) => response.json())
    .then((data) => {
      const taskList = document.getElementById("taskList");
      taskList.innerHTML = "";
      data.forEach((task) => {
        const li = document.createElement("li");
        li.textContent = task.task;
        li.id = task.id;
        // Add a click event to delete the task when clicked
        li.addEventListener("click", () => deleteTask(task.id));
        taskList.appendChild(li);
      });
    });
}

function addTask(event) {
  event.preventDefault();
  const taskInput = document.getElementById("taskInput");
  fetch("http://localhost:3000/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task: taskInput.value }),
  }).then(() => {
    taskInput.value = ""; // Clear input field
    fetchTasks(); // Refresh the list
  });
}
function deleteTask(id) {
  fetch(`http://localhost:3000/tasks/${id}`, { method: "DELETE" }).then(() =>
    fetchTasks()
  ); // Refresh the list after deletion
}

// This function will add a visual confirmation for task deletions.
// It's an optional UX enhancement.
function handleTaskClick(taskElement) {
  const isConfirmed = confirm("Are you sure you want to delete this task?");
  if (isConfirmed) {
    deleteTask(taskElement.id);
  }
}
