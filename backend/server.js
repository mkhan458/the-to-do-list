// Import required modules
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const cors = require("cors");

// Initialize the express application
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Setup the PostgreSQL client  using the connection URL from the .env file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// API Endpoint: Fetch all tasks
app.get("/tasks", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM todo_items ORDER BY id ASC"
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Endpoint: Add a new task
app.post("/tasks", async (req, res) => {
  try {
    const { task } = req.body;
    if (!task) {
      return res.status(400).json({ error: "Task description is required" });
    }

    const result = await pool.query(
      "INSERT INTO todo_items (task) VALUES ($1) RETURNING *",
      [task]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Endpoint: Delete a task by ID
app.delete("/tasks/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query(
      "DELETE FROM todo_items WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: `Task with ID: ${id} deleted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
