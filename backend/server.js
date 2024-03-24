// Import required modules
require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

// Initialize the express application
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Use express's built-in middleware

// Setup the PostgreSQL client using the connection URL from the .env file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Async middleware for handling exceptions in async routes
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Database operations
const db = {
  fetchAllTasks: async () => {
    return await pool.query("SELECT * FROM todo_items ORDER BY id ASC");
  },
  addTask: async (task) => {
    return await pool.query(
      "INSERT INTO todo_items (task) VALUES ($1) RETURNING *",
      [task]
    );
  },
  deleteTask: async (id) => {
    return await pool.query(
      "DELETE FROM todo_items WHERE id = $1 RETURNING *",
      [id]
    );
  },
};

// API Endpoint: Fetch all tasks
app.get(
  "/tasks",
  asyncHandler(async (req, res) => {
    const { rows } = await db.fetchAllTasks();
    res.status(200).json(rows);
  })
);

// API Endpoint: Add a new task
app.post(
  "/tasks",
  asyncHandler(async (req, res) => {
    const { task } = req.body;
    if (!task) {
      return res.status(400).json({ error: "Task description is required" });
    }
    const result = await db.addTask(task);
    res.status(201).json(result.rows[0]);
  })
);

// API Endpoint: Delete a task by ID
app.delete(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await db.deleteTask(id);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: `Task with ID: ${id} deleted` });
  })
);

// Central error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
