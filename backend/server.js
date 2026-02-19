const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

let db;

async function initDB() {
  let connected = false;

  while (!connected) {
    try {
      db = await mysql.createConnection(dbConfig);
      connected = true;
      console.log("Connected to MySQL");

      await db.execute(`
        CREATE TABLE IF NOT EXISTS posts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          topic VARCHAR(255) NOT NULL,
          data TEXT NOT NULL,
          timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);

    } catch (err) {
      console.log("Waiting for MySQL...");
      await new Promise(res => setTimeout(res, 3000));
    }
  }
}

initDB();

// GET posts 
app.get("/api/posts", async (req, res) => {
  const [rows] = await db.execute(
    "SELECT * FROM posts ORDER BY timestamp DESC, id DESC"
  );
  res.status(200).json(rows);
});

// POST post
app.post("/api/posts", async (req, res) => {
  const { topic, data } = req.body;

  if (!topic || !data || topic.trim() === "" || data.trim() === "") {
    return res.status(400).json({ error: "topic and data are required" });
  }

  const [result] = await db.execute(
    "INSERT INTO posts (topic, data) VALUES (?, ?)",
    [topic, data]
  );

  const [newPost] = await db.execute(
    "SELECT * FROM posts WHERE id = ?",
    [result.insertId]
  );

  res.status(201).json(newPost[0]);
});

app.listen(3002, () => {
  console.log("Backend running on port 3002");
});

