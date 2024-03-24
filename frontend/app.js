// Add event listeners after the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", initialize);

// Initialize the application by fetching existing tasks and setting up form submission
function initialize() {
  fetchTasks();
  document.getElementById("taskForm").addEventListener("submit", addTask);
}

// Fetch tasks from the server and display them in the UI
function fetchTasks() {
  fetch("http://localhost:3000/tasks")
    .then((response) => response.json())
    .then(displayTasks)
    .catch(console.error); // Log errors to the console
}

// Display tasks in the task list
function displayTasks(tasks) {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = ""; // Clear existing tasks

  tasks.forEach((task) => {
    const listItem = createTaskListItem(task);
    taskList.appendChild(listItem);
  });
}

// Create a list item for a task
function createTaskListItem(task) {
  const listItem = document.createElement("li");
  listItem.textContent = task.task;
  listItem.id = task.id;

  // Add a click event to handle task deletion
  listItem.addEventListener("click", () => handleTaskClick(listItem));

  return listItem;
}

// Handle form submission to add a new task
function addTask(event) {
  event.preventDefault(); // Prevent default form submission behavior

  const taskInput = document.getElementById("taskInput");
  const task = taskInput.value.trim();

  if (task) {
    submitTask(task);
  }
}

// Submit a new task to the server
function submitTask(task) {
  fetch("http://localhost:3000/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task }),
  })
    .then(() => {
      document.getElementById("taskInput").value = ""; // Clear input field
      fetchTasks(); // Refresh the task list
    })
    .catch(console.error); // Log errors to the console
}

// Handle task item click event to confirm and delete a task
function handleTaskClick(taskElement) {
  const isConfirmed = confirm("Are you sure you want to delete this task?");
  if (isConfirmed) {
    deleteTask(taskElement.id);
  }
}

// Delete a task by its ID
function deleteTask(id) {
  fetch(`http://localhost:3000/tasks/${id}`, { method: "DELETE" })
    .then(fetchTasks) // Refresh the task list after deletion
    .catch(console.error); // Log errors to the console
}
